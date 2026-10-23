import type { Workspace } from '../../../domain/workspace/model';
import { validateWorkspace } from '../../../domain/workspace/validation';
import type { WorkspaceRepository, WorkspaceVersion } from '../../ports/workspace-repository';
import { createTransactionStore } from './transaction-store';

export function createMemoryWorkspaceRepository(seed: Workspace): WorkspaceRepository {
  const store = createTransactionStore(seed, validateWorkspace);
  const version = (): WorkspaceVersion => Object.freeze({ ...store.getSnapshot(), durability: 'volatile', undoLabel: store.undoLabel() });
  let cached = version();
  store.subscribe(() => { cached = version(); });
  return Object.freeze({
    getSnapshot: () => cached,
    subscribe: store.subscribe,
    read: async () => cached,
    commit: async ({ expectedRevision, next, label }) => store.transact(expectedRevision, label, draft => {
      validateWorkspace(next);
      const owned = structuredClone(next);
      draft.schemaVersion = owned.schemaVersion;
      draft.projects = owned.projects;
      draft.tasks = owned.tasks;
    }),
    undo: async expectedRevision => store.undo(expectedRevision),
    close: () => {},
  } satisfies WorkspaceRepository);
}
