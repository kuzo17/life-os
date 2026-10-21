import { DomainError } from '../shared/result';
import type { Workspace } from './model';

function requireValue(condition: unknown, message: string): asserts condition {
  if (!condition) throw new DomainError(message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function record(value: unknown, fields: readonly string[]): asserts value is Record<string, unknown> {
  requireValue(isRecord(value), 'Record non valido.');
  requireValue(Object.keys(value).length === fields.length && fields.every(key => Object.hasOwn(value, key)), 'Campi del record non validi.');
}

export function requireText(value: unknown, label: string, max = 180): asserts value is string {
  requireValue(typeof value === 'string' && value.trim().length > 0 && value.length <= max, `Controlla ${label}.`);
}

function requireId(value: unknown): asserts value is string {
  requireValue(typeof value === 'string' && /^[a-zA-Z0-9_-]{1,80}$/.test(value), 'ID non valido.');
}

export function isCalendarDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function validateWorkspace(value: unknown): asserts value is Workspace {
  record(value, ['schemaVersion', 'projects', 'tasks']);
  requireValue(value.schemaVersion === 1, 'Versione del workspace non supportata.');
  requireValue(Array.isArray(value.projects) && Array.isArray(value.tasks), 'Collezioni non valide.');
  const projectIds = new Set<string>();
  for (const project of value.projects) {
    record(project, ['id', 'name', 'description']);
    requireId(project.id);
    requireText(project.name, 'nome progetto', 100);
    requireValue(typeof project.description === 'string' && project.description.length <= 500, 'Descrizione non valida.');
    requireValue(!projectIds.has(project.id), 'ID progetto duplicato.');
    projectIds.add(project.id);
  }
  const taskIds = new Set<string>();
  for (const task of value.tasks) {
    record(task, ['id', 'title', 'projectId', 'scheduledOn', 'completed']);
    requireId(task.id);
    requireText(task.title, 'titolo task');
    requireValue(!taskIds.has(task.id), 'ID task duplicato.');
    requireValue(task.projectId === null || (typeof task.projectId === 'string' && projectIds.has(task.projectId)), 'Progetto della task non valido.');
    requireValue(task.scheduledOn === null || isCalendarDate(task.scheduledOn), 'Data della task non valida.');
    requireValue(typeof task.completed === 'boolean', 'Stato della task non valido.');
    taskIds.add(task.id);
  }
}
