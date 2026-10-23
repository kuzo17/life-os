import type { WorkspaceRepository } from '../data/ports/workspace-repository';
import { failure, safeFailure, type Result } from '../domain/shared/result';
import { applyWorkspaceCommand } from '../domain/workspace/commands';
import type { WorkspaceCommand } from '../domain/workspace/model';

export function createWorkspaceService(repository: WorkspaceRepository) {
  async function execute(command: WorkspaceCommand, expectedRevision = repository.getSnapshot().revision): Promise<Result<number>> {
    try {
      const current = await repository.read();
      if (expectedRevision !== current.revision) return failure('conflict', 'Un’altra modifica è stata salvata. Controlla la versione aggiornata prima di riprovare.');
      const next = applyWorkspaceCommand(current.data, command);
      return await repository.commit({ expectedRevision: current.revision, next, label: command.type === 'project.rename' ? 'Rinomina progetto' : 'Stato task' });
    } catch (error) { return safeFailure(error); }
  }

  return Object.freeze({
    execute,
    async refresh(): Promise<Result<number>> {
      try { return Object.freeze({ ok: true, value: (await repository.read()).revision }); }
      catch (error) { return safeFailure(error); }
    },
    async undo(): Promise<Result<number>> {
      try { return await repository.undo((await repository.read()).revision); }
      catch (error) { return safeFailure(error); }
    },
  });
}
