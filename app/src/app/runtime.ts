import { createWorkspaceService } from '../application/workspace-service';
import { createMemoryWorkspaceRepository } from '../data/adapters/memory/workspace-repository';
import { createSyntheticWorkspace, referenceDay } from '../data/fixtures/workspace';
import { openIndexedDbStorage } from '../data/adapters/indexeddb/storage';
import { createLocalWorkspaceRepository } from '../data/adapters/local/workspace-repository';
import type { WorkspaceRepository } from '../data/ports/workspace-repository';

export function createRuntime(repository: WorkspaceRepository = createMemoryWorkspaceRepository(createSyntheticWorkspace())) {
  // Memoria per test isolati; l'avvio browser usa soltanto openLocalRuntime.
  return Object.freeze({ repository, workspace: createWorkspaceService(repository), referenceDay });
}

export async function openLocalRuntime() {
  const storage = await openIndexedDbStorage(globalThis.indexedDB, createSyntheticWorkspace());
  return createRuntime(await createLocalWorkspaceRepository(storage));
}

export type Runtime = ReturnType<typeof createRuntime>;
