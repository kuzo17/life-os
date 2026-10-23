import type { AtomicWorkspaceStorage } from '../../ports/atomic-workspace-storage';
import { createStoredWorkspaceRepository } from '../shared/stored-workspace-repository';

export function createLocalWorkspaceRepository(storage: AtomicWorkspaceStorage) {
  return createStoredWorkspaceRepository(storage, 'local');
}
