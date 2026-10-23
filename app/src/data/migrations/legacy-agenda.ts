import { deepFreeze } from '../../domain/shared/immutable';
import { DomainError } from '../../domain/shared/result';
import type { Project, Task, Workspace } from '../../domain/workspace/model';
import { isCalendarDate, isRecord, requireId, validateWorkspace } from '../../domain/workspace/validation';

// Solo un estratto immutabile. Non legge storage V1, backup, credenziali o rete.
export function mapLegacyAgenda(snapshotId: string, projects: readonly Project[], entries: Record<string, unknown>) {
  if (!/^[a-zA-Z0-9_-]{1,32}$/.test(snapshotId)) throw new DomainError('Identità snapshot non valida.');
  const workspace: Workspace = { schemaVersion: 2, projects: structuredClone([...projects]), tasks: [] };
  validateWorkspace(workspace);
  const mappings: { sourcePath: string; taskId: string }[] = [];
  const quarantine: { sourcePath: string; reason: string; original: unknown }[] = [];
  const originals: { sourcePath: string; original: unknown }[] = [];
  for (const key of Object.keys(entries).sort()) {
    const raw = entries[key];
    const day = key.slice('agenda_'.length);
    if (!key.startsWith('agenda_') || !isCalendarDate(day) || !Array.isArray(raw)) {
      quarantine.push({ sourcePath: key, reason: 'Chiave data o collezione non valida.', original: structuredClone(raw) });
      continue;
    }
    for (const [index, item] of raw.entries()) {
      const sourcePath = `${key}/${index}`;
      try {
        if (!isRecord(item) || Object.keys(item).some(field => !['text', 'projId', 'done', 'ts', 'type', 'pri', 'time'].includes(field))) throw new DomainError('Formato task non riconosciuto.');
        if (item.type !== undefined && item.type !== 'day') throw new DomainError('Occorrenza non giornaliera: richiede il mapper ricorrenze.');
        if (item.ts !== undefined && (typeof item.ts !== 'number' || !Number.isFinite(item.ts))) throw new DomainError('Timestamp non valido.');
        if (item.projId !== undefined && typeof item.projId !== 'string') throw new DomainError('Riferimento progetto ambiguo.');
        const projectId = item.projId === '' || item.projId === undefined ? null : item.projId;
        if (projectId !== null) requireId(projectId);
        const task: Task = {
          id: `v1_${snapshotId}_${day.replaceAll('-', '')}_${index}`,
          title: item.text as string, projectId, scheduledOn: day, completed: item.done as boolean,
          time: item.time === '' || item.time === undefined ? null : item.time as string,
          priority: (item.pri === undefined ? 'none' : item.pri) as Task['priority'], sortOrder: index,
        };
        // Le assertion TS non sostituiscono la validazione a runtime di tutti i campi.
        validateWorkspace({ schemaVersion: 2, projects: workspace.projects, tasks: [task] });
        workspace.tasks.push(task);
        mappings.push({ sourcePath, taskId: task.id });
        originals.push({ sourcePath, original: structuredClone(item) });
      } catch (error) {
        quarantine.push({ sourcePath, reason: error instanceof DomainError ? error.message : 'Record non trasformabile.', original: structuredClone(item) });
      }
    }
  }
  validateWorkspace(workspace);
  return deepFreeze({ workspace, mappings, originals, quarantine, complete: quarantine.length === 0 });
}
