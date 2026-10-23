import { cloneMutable, deepFreeze } from '../../../domain/shared/immutable';
import { failure, safeFailure, type Result } from '../../../domain/shared/result';
import type { Workspace } from '../../../domain/workspace/model';
import { validateWorkspace } from '../../../domain/workspace/validation';
import type { AtomicWorkspaceStorage, StoredWorkspace } from '../../ports/atomic-workspace-storage';
import type { WorkspaceRepository, WorkspaceVersion } from '../../ports/workspace-repository';

export async function createLocalWorkspaceRepository(storage: AtomicWorkspaceStorage): Promise<WorkspaceRepository> {
  const initial = await storage.read();
  validateWorkspace(initial.data);
  const listeners = new Set<() => void>();
  let undoStack: { data: WorkspaceVersion['data']; label: string }[] = [];
  let busy = false;
  let closed = false;
  let cached: WorkspaceVersion = Object.freeze({ ...initial, data: deepFreeze(structuredClone(initial.data)), durability: 'local', undoLabel: null });

  function publish(value: StoredWorkspace) {
    validateWorkspace(value.data);
    cached = Object.freeze({ ...value, data: deepFreeze(structuredClone(value.data)), durability: 'local', undoLabel: undoStack.at(-1)?.label ?? null });
    for (const listener of [...listeners]) {
      try { listener(); } catch { /* Il commit duraturo non dipende dagli osservatori. */ }
    }
  }

  async function read() {
    if (closed) throw new Error('Repository chiuso.');
    const stored = await storage.read();
    if (stored.revision > cached.revision) { undoStack = []; publish(stored); }
    return cached;
  }

  async function write(expectedRevision: number, next: Workspace, label: string, undo: boolean): Promise<Result<number>> {
    if (closed) return failure('unavailable', 'Archivio chiuso. Ricarica per riaprirlo.');
    if (busy) return failure('busy', 'Salvataggio già in corso.');
    if (expectedRevision !== cached.revision) return failure('conflict', 'I dati sono cambiati. Riprova sulla versione aggiornata.');
    busy = true;
    try {
      validateWorkspace(next);
      const previous = cached;
      const saved = await storage.compareAndSwap(expectedRevision, structuredClone(next));
      if (!saved) {
        await read();
        return failure('conflict', 'Un’altra scheda ha modificato i dati. Versione aggiornata: controlla e riprova.');
      }
      if (undo) undoStack.pop();
      else undoStack = [...undoStack, { data: previous.data, label }].slice(-30);
      publish(saved);
      return Object.freeze({ ok: true, value: saved.revision });
    } catch (error) { return safeFailure(error); }
    finally { busy = false; }
  }

  return Object.freeze({
    getSnapshot: () => cached,
    subscribe(listener) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    read,
    commit: ({ expectedRevision, next, label }) => write(expectedRevision, next, label, false),
    undo(expectedRevision) {
      const entry = undoStack.at(-1);
      if (!entry) return Promise.resolve(failure('empty-history', 'Nessuna operazione della sessione da annullare.'));
      return write(expectedRevision, cloneMutable<Workspace>(entry.data), entry.label, true);
    },
    close() { closed = true; storage.close(); listeners.clear(); },
  } satisfies WorkspaceRepository);
}
