import { createWorkspaceService } from '../application/workspace-service';
import { createMemoryWorkspaceRepository } from '../data/adapters/memory/workspace-repository';
import { createSyntheticWorkspace, referenceDay } from '../data/fixtures/workspace';

export function createRuntime() {
  // Unica composizione F1. Nessun SDK remoto, variabile ambiente o modalità produzione.
  const repository = createMemoryWorkspaceRepository(createSyntheticWorkspace());
  return Object.freeze({ repository, workspace: createWorkspaceService(repository), referenceDay });
}

export type Runtime = ReturnType<typeof createRuntime>;
