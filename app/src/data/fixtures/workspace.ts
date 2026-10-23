import type { Workspace } from '../../domain/workspace/model';

export const referenceDay = '2026-10-21';

export function createSyntheticWorkspace(): Workspace {
  return {
    schemaVersion: 2,
    projects: [
      { id: 'orione', name: 'Progetto Orione', description: 'Organizzare un piccolo progetto, un passo alla volta.' },
      { id: 'atlas', name: 'Studio Atlas', description: 'Uno spazio per apprendimento e appunti.' },
    ],
    tasks: [
      { id: 'task-1', title: 'Definire il prossimo passo', projectId: 'orione', scheduledOn: referenceDay, completed: false, time: '09:00', priority: 'high', sortOrder: 0 },
      { id: 'task-2', title: 'Riordinare i materiali', projectId: 'orione', scheduledOn: referenceDay, completed: true, time: null, priority: 'none', sortOrder: 1 },
      { id: 'task-3', title: 'Rivedere gli appunti', projectId: 'atlas', scheduledOn: referenceDay, completed: false, time: '18:30', priority: 'medium', sortOrder: 2 },
      { id: 'task-4', title: 'Preparare la prossima sessione', projectId: 'atlas', scheduledOn: '2026-10-22', completed: false, time: null, priority: 'none', sortOrder: 0 },
      { id: 'task-5', title: 'Un pensiero ancora da organizzare', projectId: null, scheduledOn: null, completed: false, time: null, priority: 'none', sortOrder: 0 },
    ],
  };
}
