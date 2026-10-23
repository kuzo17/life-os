import { deepFreeze } from '../../domain/shared/immutable';
import { DomainError } from '../../domain/shared/result';
import type { Project } from '../../domain/workspace/model';
import { isRecord, requireText } from '../../domain/workspace/validation';
import { decodeLegacyProject, requireColor, textList } from './legacy-project-record';

interface CatalogProject {
  project: Project; origin: 'seed' | 'custom'; sourcePath: string;
  folderId: string | null; legacyFolder: string | null; color: string;
  kind: string | null; archived: boolean; priority: 'none' | 'medium' | 'high';
}

export function mapLegacyProjects(snapshotId: string, defaults: { projects: readonly unknown[]; folders: readonly string[] }, entries: Record<string, unknown>) {
  if (!/^[a-zA-Z0-9_-]{1,32}$/.test(snapshotId)) throw new DomainError('Identità snapshot non valida.');
  const names = textList(Object.hasOwn(entries, 'folders') ? entries.folders : [...defaults.folders], 'cartelle');
  const custom = Object.hasOwn(entries, 'customProjs') ? entries.customProjs : [];
  if (!Array.isArray(custom)) throw new DomainError('Collezione progetti custom non valida.');
  const deleted = textList(entries.deletedPD === undefined ? [] : entries.deletedPD, 'eliminati');
  const archived = textList(entries.archived === undefined ? [] : entries.archived, 'archivio');
  const orders = entries.projOrders === undefined ? {} : entries.projOrders;
  if (!isRecord(orders)) throw new DomainError('Ordinamento progetti non valido.');
  const orderMap = new Map(Object.entries(orders).map(([key, value]) => [key, textList(value, 'ordine')]));
  const originals = [
    { sourcePath: 'defaults/folders', original: structuredClone(defaults.folders) as unknown },
    ...defaults.projects.map((original, index) => ({ sourcePath: `PD/${index}`, original: structuredClone(original) })),
    ...Object.keys(entries).sort().map(sourcePath => ({ sourcePath, original: structuredClone(entries[sourcePath]) })),
  ];
  const quarantine: { sourcePath: string; reason: string; original: unknown }[] = [];
  const warnings: { sourcePath: string; reason: string }[] = [];
  const folderCounts = new Map(names.map(name => [name, names.filter(other => other === name).length]));
  const folders = names.flatMap((name, index) => {
    if (folderCounts.get(name) !== 1) {
      quarantine.push({ sourcePath: `folders/${index}`, reason: 'Nome cartella duplicato: identità ambigua.', original: name });
      return [];
    }
    return [{ id: `v1_${snapshotId}_folder_${index}`, name, sortOrder: index }];
  });
  const source = [
    ...defaults.projects.map((raw, index) => ({ raw, sourcePath: `PD/${index}`, origin: 'seed' as const })),
    ...custom.map((raw: unknown, index: number) => ({ raw, sourcePath: `customProjs/${index}`, origin: 'custom' as const })),
  ];
  const counts = new Map<string, number>();
  for (const { raw } of source) if (isRecord(raw) && typeof raw.id === 'string') counts.set(raw.id, (counts.get(raw.id) ?? 0) + 1);
  const projects: CatalogProject[] = [];
  const deletedProjects: CatalogProject[] = [];
  const consumed = new Set(['folders', 'customProjs', 'deletedPD', 'archived', 'projOrders']);
  for (const { raw, sourcePath, origin } of source) {
    try {
      const record = decodeLegacyProject(raw);
      if (counts.get(record.id) !== 1) throw new DomainError('ID progetto duplicato: nessuna associazione arbitraria.');
      let name = record.tag;
      let folder = record.folder ?? null;
      let color = record.color;
      let priority: CatalogProject['priority'] = 'none';
      for (const field of ['tag', 'folder', 'color', 'pri'] as const) {
        const key = `proj_${field}_${record.id}`;
        if (!Object.hasOwn(entries, key)) continue;
        consumed.add(key);
        const value = entries[key];
        if ((field === 'tag' || field === 'folder') && origin === 'custom') {
          warnings.push({ sourcePath: key, reason: 'Override non usato dalla V1 per un progetto custom; originale conservato.' });
          continue;
        }
        if ((field === 'tag' || field === 'folder') && value === '') continue;
        if (field === 'color') { requireColor(value); color = value; }
        else if (field === 'pri') {
          if (value !== 'none' && value !== 'medium' && value !== 'high') throw new DomainError('Priorità progetto non valida.');
          priority = value;
        } else {
          requireText(value, field === 'tag' ? 'nome progetto' : 'cartella', 100);
          if (field === 'tag') name = value;
          else if (names.includes(value)) folder = value;
          else warnings.push({ sourcePath: key, reason: 'Folder override non valida: mantenuto il default come nel boot V1.' });
        }
      }
      const folderId = folders.find(item => item.name === folder)?.id ?? null;
      if (folder !== null && folderId === null) warnings.push({ sourcePath, reason: 'Cartella assente o ambigua: nome legacy conservato senza inventare un contenitore.' });
      const mapped: CatalogProject = {
        project: { id: record.id, name, description: record.sub }, sourcePath, origin,
        folderId, legacyFolder: folder, color, kind: record.hasInv ?? null,
        archived: archived.includes(record.id), priority,
      };
      (deleted.includes(record.id) ? deletedProjects : projects).push(mapped);
    } catch (error) {
      quarantine.push({ sourcePath, reason: error instanceof DomainError ? error.message : 'Progetto non trasformabile.', original: structuredClone(raw) });
    }
  }
  const orderByFolder = folders.map(folder => {
    const children = projects.filter(project => project.folderId === folder.id && !project.archived);
    const saved = orderMap.get(folder.name) ?? [];
    if (new Set(saved).size !== saved.length || saved.some(id => !children.some(child => child.project.id === id))) warnings.push({ sourcePath: `projOrders/${folder.name}`, reason: 'Ordine contiene riferimenti obsoleti o duplicati: conservato originale, applicati solo i figli riconosciuti.' });
    const positions = new Map(saved.map((id, index) => [id, index]));
    // Formula V1 conservata, incluso il fallback 99 e l'ultimo indice duplicato.
    const ordered = children.slice().sort((a, b) =>
      (positions.get(a.project.id) ?? 99 + children.indexOf(a)) - (positions.get(b.project.id) ?? 99 + children.indexOf(b)));
    return { folderId: folder.id, projectIds: ordered.map(child => child.project.id) };
  });
  for (const key of orderMap.keys()) if (!names.includes(key)) warnings.push({ sourcePath: `projOrders/${key}`, reason: 'Ordine di cartella assente, originale conservato.' });
  for (const id of [...deleted, ...archived]) if (!counts.has(id)) warnings.push({ sourcePath: 'deletedPD/archived', reason: 'Riferimento a progetto non presente, originale conservato.' });
  for (const key of Object.keys(entries)) if (!consumed.has(key)) quarantine.push({ sourcePath: key, reason: 'Chiave non acquisita o riferimento override non risolto.', original: structuredClone(entries[key]) });
  return deepFreeze({ folders, projects, deletedProjects, orderByFolder, originals, warnings, quarantine, complete: quarantine.length === 0 });
}
