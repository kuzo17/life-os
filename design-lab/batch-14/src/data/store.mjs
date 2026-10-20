const copy = value => structuredClone(value);
export function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

/** Owns canonical records. Views receive frozen snapshots, never writable arrays. */
export function createStore(seed, {
  validate = () => {},
  now = () => new Date().toISOString(),
  onSubscriberError = console.error
} = {}) {
  validate(seed);
  let snapshot = deepFreeze(copy(seed));
  let revision = 0;
  const subscribers = new Set();
  const undoStack = [];
  const operations = [];
  function publish() {
    for (const listener of subscribers) {
      try {
        listener(snapshot, revision);
      } catch (error) {
        onSubscriberError(error);
      }
    }
  }
  function transact(type, label, reduce) {
    const draft = copy(snapshot);
    try {
      const result = reduce(draft) || {};
      if (result.ok === false) return result;
      validate(draft);
      const operation = {
        id: `operation-${revision + 1}`,
        type,
        label,
        at: now(),
        undone: false
      };
      undoStack.push({
        before: snapshot,
        operationId: operation.id
      });
      if (undoStack.length > 30) undoStack.shift();
      snapshot = deepFreeze(draft);
      revision += 1;
      operations.unshift(operation);
      if (operations.length > 50) operations.length = 50;
      publish();
      return deepFreeze(copy({
        ok: true,
        label,
        ...result
      }));
    } catch (error) {
      return {
        ok: false,
        error: error.message || 'Operazione non riuscita.'
      };
    }
  }
  function undo() {
    const entry = undoStack.pop();
    if (!entry) return {
      ok: false,
      error: 'Nessuna operazione da annullare.'
    };
    const operation = operations.find(item => item.id === entry.operationId);
    if (operation) operation.undone = true;
    snapshot = entry.before;
    revision += 1;
    publish();
    return {
      ok: true,
      label: operation?.label || 'Operazione annullata'
    };
  }
  return Object.freeze({
    read: () => snapshot,
    revision: () => revision,
    transact,
    undo,
    canUndo: () => undoStack.length > 0,
    pendingUndoLabel: () => operations.find(item => item.id === undoStack.at(-1)?.operationId)?.label || null,
    history: () => deepFreeze(copy(operations)),
    subscribe(listener) {
      subscribers.add(listener);
      return () => subscribers.delete(listener);
    }
  });
}
