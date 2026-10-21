import type { DeepReadonly } from '../shared/immutable';
import type { Workspace } from './model';

export function tasksOn(data: DeepReadonly<Workspace>, day: string) {
  return data.tasks.filter(task => task.scheduledOn === day);
}

export function tasksForProject(data: DeepReadonly<Workspace>, projectId: string) {
  return data.tasks.filter(task => task.projectId === projectId);
}

export function unscheduledTasks(data: DeepReadonly<Workspace>) {
  return data.tasks.filter(task => task.scheduledOn === null);
}

export function scheduledDays(data: DeepReadonly<Workspace>) {
  return [...new Set(data.tasks.map(task => task.scheduledOn).filter((day): day is string => day !== null))].sort();
}

export function completion(tasks: DeepReadonly<Workspace['tasks']>) {
  return { completed: tasks.filter(task => task.completed).length, total: tasks.length };
}
