import { cloneMutable, type DeepReadonly } from '../shared/immutable';
import { DomainError } from '../shared/result';
import type { Workspace, WorkspaceCommand } from './model';
import { requireText, validateWorkspace } from './validation';

export function applyWorkspaceCommand(current: DeepReadonly<Workspace>, command: WorkspaceCommand): Workspace {
  const draft = cloneMutable<Workspace>(current);
  switch (command.type) {
    case 'task.setCompleted': {
      const task = draft.tasks.find(item => item.id === command.id);
      if (!task) throw new DomainError('Task non trovata.');
      task.completed = command.completed;
      break;
    }
    case 'project.rename': {
      requireText(command.name, 'nome progetto', 100);
      const project = draft.projects.find(item => item.id === command.id);
      if (!project) throw new DomainError('Progetto non trovato.');
      project.name = command.name.trim();
      break;
    }
    default: throw new DomainError('Comando non supportato.');
  }
  validateWorkspace(draft);
  return draft;
}
