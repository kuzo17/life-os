import { entityHandlers } from './entities.mjs';
import { workspaceHandlers } from './workspace.mjs';
import { catalogFinanceHandlers } from './catalog-finance.mjs';
export function createCommandBus(store, {
  nextId = prefix => `${prefix}-${crypto.randomUUID()}`
} = {}) {
  const handlers = {
    ...entityHandlers(nextId),
    ...workspaceHandlers(nextId),
    ...catalogFinanceHandlers(nextId)
  };
  const execute = (type, payload, label = type) => {
    const handler = Object.hasOwn(handlers, type) ? handlers[type] : null;
    if (!handler) return {
      ok: false,
      error: 'Comando non supportato.'
    };
    return store.transact(type, label, draft => handler(draft, payload));
  };
  const toggle = (collection, id, label) => execute('entity.toggle', {
    collection,
    id
  }, label);
  const bulk = (action, ids, when) => execute('agenda.bulk', {
    action,
    ids,
    when
  }, `Agenda: ${action} · ${ids.length} task`);
  return Object.freeze({
    execute,
    createEntity: input => execute('capture.create', input, `Creato: ${input.title}`),
    captureBatch: items => execute('capture.batch', {
      items
    }, `Cattura: ${items.length} elementi`),
    parkInbox: (text, type) => execute('inbox.park', {
      text,
      type
    }, 'Salvato in Inbox'),
    triageInbox: (id, input) => execute('inbox.triage', {
      id,
      input
    }, `Inbox → ${input.kind}`),
    triageInboxToTask: (id, input) => execute('inbox.triage', {
      id,
      input: {
        ...input,
        kind: 'task'
      }
    }, 'Inbox → Task'),
    toggleTask: id => toggle('tasks', id, 'Stato task aggiornato'),
    toggleGoal: id => toggle('goals', id, 'Stato obiettivo aggiornato'),
    toggleRecurrence: id => toggle('recurrences', id, 'Ricorrenza aggiornata'),
    toggleExpense: id => toggle('expenses', id, 'Stato spesa aggiornato'),
    deleteEntity: (collection, id) => execute('entity.delete', {
      collection,
      id
    }, 'Elemento eliminato'),
    bulkMoveTasks: (ids, when) => bulk('move', ids, when),
    bulkDuplicateTasks: ids => bulk('duplicate', ids),
    bulkDeleteTasks: ids => bulk('delete', ids),
    undo: store.undo,
    canUndo: store.canUndo,
    history: store.history,
    pendingUndoLabel: store.pendingUndoLabel
  });
}
