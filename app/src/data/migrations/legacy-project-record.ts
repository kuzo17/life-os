import { DomainError } from '../../domain/shared/result';
import { isRecord, requireId, requireText } from '../../domain/workspace/validation';

export interface LegacyProjectRecord {
  id: string; tag: string; color: string; sub: string;
  folder?: string; hasInv?: string; tasks0?: string[]; goals0?: string[]; note0?: string;
}

export function requireColor(value: unknown): asserts value is string {
  if (typeof value !== 'string' || !/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) throw new DomainError('Colore progetto non riconosciuto.');
}

export function decodeLegacyProject(value: unknown): LegacyProjectRecord {
  if (!isRecord(value) || Object.keys(value).some(key => !['id', 'tag', 'color', 'sub', 'folder', 'hasInv', 'tasks0', 'goals0', 'note0'].includes(key))) throw new DomainError('Campi progetto non riconosciuti.');
  requireId(value.id);
  requireText(value.tag, 'nome progetto', 100);
  requireColor(value.color);
  if (typeof value.sub !== 'string' || value.sub.length > 500) throw new DomainError('Descrizione progetto non valida.');
  if (value.folder !== undefined) requireText(value.folder, 'cartella', 100);
  if (value.hasInv !== undefined && (typeof value.hasInv !== 'string' || !['vinted', 'carte', 'risparmio', 'crypto', 'allenamento', 'alimentazione', 'stretching'].includes(value.hasInv))) throw new DomainError('Tipo progetto non riconosciuto.');
  for (const key of ['tasks0', 'goals0'] as const) {
    const list = value[key];
    if (list !== undefined && (!Array.isArray(list) || [...list].some(item => typeof item !== 'string'))) throw new DomainError('Contenuto iniziale non valido.');
  }
  if (value.note0 !== undefined && typeof value.note0 !== 'string') throw new DomainError('Nota iniziale non valida.');
  return structuredClone(value) as unknown as LegacyProjectRecord;
}

export function textList(value: unknown, label: string): string[] {
  if (!Array.isArray(value)) throw new DomainError(`Collezione ${label} non valida.`);
  for (const item of value) requireText(item, label, 100);
  return structuredClone(value) as string[];
}
