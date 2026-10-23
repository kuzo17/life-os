import { DomainError } from '../../../domain/shared/result';
import { isRecord, validateWorkspace } from '../../../domain/workspace/validation';
import type { StoredWorkspace } from '../../ports/atomic-workspace-storage';

function invalid(): never { throw new DomainError('Formato del contratto emulatore non valido.'); }
function revision(value: unknown): asserts value is number {
  if (!Number.isSafeInteger(value) || Number(value) < 0) invalid();
}

export function encodeRtdb(value: StoredWorkspace) {
  revision(value.revision);
  validateWorkspace(value.data);
  return {
    format: 1, revision: value.revision, schemaVersion: value.data.schemaVersion,
    projectCount: value.data.projects.length, taskCount: value.data.tasks.length,
    projects: Object.fromEntries(value.data.projects.map((project, index) => [`p_${project.id}`, { ...project, index }])),
    tasks: Object.fromEntries(value.data.tasks.map((task, index) => [`t_${task.id}`, {
      ...task, index, projectId: task.projectId ?? '', scheduledOn: task.scheduledOn ?? '', time: task.time ?? '',
    }])),
  };
}

function rows(value: unknown, count: unknown, prefix: string, fields: string[]) {
  revision(count);
  if (count === 0 && value === undefined) return [];
  if (!isRecord(value) || Object.keys(value).length !== count) invalid();
  const result = Object.entries(value).map(([key, item]) => {
    if (!isRecord(item) || Object.keys(item).length !== fields.length + 1 || !fields.every(field => Object.hasOwn(item, field)) || !Object.hasOwn(item, 'index')) invalid();
    if (typeof item.id !== 'string' || key !== `${prefix}${item.id}`) invalid();
    revision(item.index);
    return item;
  }).sort((a, b) => Number(a.index) - Number(b.index));
  if (result.some((item, index) => item.index !== index)) invalid();
  return result;
}

export function decodeRtdb(value: unknown): StoredWorkspace {
  if (!isRecord(value) || value.format !== 1 || value.schemaVersion !== 2 ||
    Object.keys(value).some(key => !['format', 'revision', 'schemaVersion', 'projectCount', 'taskCount', 'projects', 'tasks'].includes(key))) invalid();
  revision(value.revision);
  const projects = rows(value.projects, value.projectCount, 'p_', ['id', 'name', 'description']).map(item => ({ id: item.id, name: item.name, description: item.description }));
  const tasks = rows(value.tasks, value.taskCount, 't_', ['id', 'title', 'projectId', 'scheduledOn', 'completed', 'time', 'priority', 'sortOrder']).map(item => ({
    id: item.id, title: item.title, projectId: item.projectId === '' ? null : item.projectId,
    scheduledOn: item.scheduledOn === '' ? null : item.scheduledOn, completed: item.completed,
    time: item.time === '' ? null : item.time, priority: item.priority, sortOrder: item.sortOrder,
  }));
  const data = { schemaVersion: 2, projects, tasks };
  validateWorkspace(data);
  return { revision: value.revision, data };
}
