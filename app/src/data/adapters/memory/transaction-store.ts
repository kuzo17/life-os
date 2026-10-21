import { cloneMutable, deepFreeze, type DeepReadonly } from '../../../domain/shared/immutable';
import { failure, safeFailure, type Result } from '../../../domain/shared/result';

export interface StoreSnapshot<T> {
  readonly revision: number;
  readonly data: DeepReadonly<T>;
}

export interface Operation {
  readonly revision: number;
  readonly label: string;
  readonly undone: boolean;
}

// Recupero controllato di Batch 14/data/store.mjs: solo workspace volatile, non ledger.
export function createTransactionStore<T extends object>(seed: T, validate: (value: unknown) => void) {
  validate(seed);
  let snapshot: StoreSnapshot<T> = Object.freeze({ revision: 0, data: deepFreeze(structuredClone(seed)) });
  let busy = false;
  const listeners = new Set<() => void>();
  const undoStack: { data: DeepReadonly<T>; revision: number; label: string }[] = [];
  let operations: readonly Operation[] = Object.freeze([]);

  function publish() {
    for (const listener of [...listeners]) {
      try { listener(); } catch { /* Un osservatore non può far fallire un commit già applicato. */ }
    }
  }

  function transact(expectedRevision: number, label: string, mutate: (draft: T) => void): Result<number> {
    if (busy) return failure('busy', 'Operazione già in corso.');
    if (expectedRevision !== snapshot.revision) return failure('conflict', 'I dati sono cambiati. Riprova sulla versione aggiornata.');
    busy = true;
    try {
      const draft = cloneMutable<T>(snapshot.data);
      mutate(draft);
      validate(draft);
      const next = Object.freeze({ revision: snapshot.revision + 1, data: deepFreeze(draft) });
      const operation = Object.freeze({ revision: next.revision, label, undone: false });
      const history = Object.freeze([operation, ...operations].slice(0, 50));
      undoStack.push({ data: snapshot.data, revision: next.revision, label });
      if (undoStack.length > 30) undoStack.shift();
      operations = history;
      snapshot = next;
      publish();
      return Object.freeze({ ok: true, value: next.revision });
    } catch (error) {
      return safeFailure(error);
    } finally { busy = false; }
  }

  function undo(expectedRevision: number): Result<number> {
    if (busy) return failure('busy', 'Operazione già in corso.');
    if (expectedRevision !== snapshot.revision) return failure('conflict', 'I dati sono cambiati. Riprova sulla versione aggiornata.');
    const entry = undoStack.pop();
    if (!entry) return failure('empty-history', 'Nessuna operazione da annullare.');
    busy = true;
    try {
      operations = Object.freeze(operations.map(item => item.revision === entry.revision ? Object.freeze({ ...item, undone: true }) : item));
      snapshot = Object.freeze({ revision: snapshot.revision + 1, data: entry.data });
      publish();
      return Object.freeze({ ok: true, value: snapshot.revision });
    } finally { busy = false; }
  }

  return Object.freeze({
    getSnapshot: () => snapshot,
    transact,
    undo,
    undoLabel: () => undoStack.at(-1)?.label ?? null,
    history: () => operations,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  });
}
