import type { DeepReadonly } from '../shared/immutable';
import type { Task, Workspace } from './model';

function agendaOrder(a: DeepReadonly<Task>, b: DeepReadonly<Task>) {
  return (a.time ?? '99:99').localeCompare(b.time ?? '99:99') || a.sortOrder - b.sortOrder || a.id.localeCompare(b.id);
}

export function tasksOn(data: DeepReadonly<Workspace>, day: string) {
  return data.tasks.filter(task => task.scheduledOn === day).sort(agendaOrder);
}

export function tasksForProject(data: DeepReadonly<Workspace>, projectId: string) {
  return data.tasks.filter(task => task.projectId === projectId).sort((a, b) => (a.scheduledOn ?? '9999').localeCompare(b.scheduledOn ?? '9999') || agendaOrder(a, b));
}

export function unscheduledTasks(data: DeepReadonly<Workspace>) {
  return data.tasks.filter(task => task.scheduledOn === null).sort(agendaOrder);
}

export function scheduledDays(data: DeepReadonly<Workspace>) {
  return [...new Set(data.tasks.map(task => task.scheduledOn).filter((day): day is string => day !== null))].sort();
}

export function completion(tasks: DeepReadonly<Workspace['tasks']>) {
  return { completed: tasks.filter(task => task.completed).length, total: tasks.length };
}
