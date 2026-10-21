import type { WorkspaceRepository } from '../data/ports/workspace-repository';
import { safeFailure, type Result } from '../domain/shared/result';
import { applyWorkspaceCommand } from '../domain/workspace/commands';
import type { WorkspaceCommand } from '../domain/workspace/model';

export function createWorkspaceService(repository: WorkspaceRepository) {
  async function execute(command: WorkspaceCommand): Promise<Result<number>> {
    try {
      const current = await repository.read();
      const next = applyWorkspaceCommand(current.data, command);
      return await repository.commit({ expectedRevision: current.revision, next, label: command.type === 'project.rename' ? 'Rinomina progetto' : 'Stato task' });
    } catch (error) { return safeFailure(error); }
  }

  return Object.freeze({
    execute,
    async undo(): Promise<Result<number>> {
      try { return await repository.undo((await repository.read()).revision); }
      catch (error) { return safeFailure(error); }
    },
  });
}
