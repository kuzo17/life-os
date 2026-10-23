import { describe, expect, it } from 'vitest';
import { mapLegacyProjects } from '../../src/data/migrations/legacy-projects';
import { mapLegacyAgenda } from '../../src/data/migrations/legacy-agenda';

const base = { id: 'seed-a', tag: 'PROGETTO DEMO A', sub: 'Solo sintetico', color: '#39dfce', folder: 'LAVORO DEMO', tasks0: ['Spunto sintetico'], goals0: [], note0: 'Nota sintetica' };
const defaults = { folders: ['LAVORO DEMO', 'STUDIO DEMO'], projects: [base, { ...base, id: 'seed-b', tag: 'PROGETTO DEMO B' }] };

describe('catalogo V1: PD/custom, override, archivio e ordine', () => {
  it('conserva ID e originali, applica override seed e proprietà custom secondo il boot V1', () => {
    const entries = {
      customProjs: [{ ...base, id: 'cp_demo', tag: 'CUSTOM DEMO', folder: 'STUDIO DEMO' }],
      'proj_tag_seed-a': 'RINOMINATO DEMO', 'proj_folder_seed-a': 'STUDIO DEMO',
      'proj_color_seed-a': '#fff', 'proj_pri_seed-a': 'high',
      'proj_tag_cp_demo': 'OVERRIDE OBSOLETO', 'proj_folder_cp_demo': 'LAVORO DEMO',
      archived: ['seed-b'], projOrders: { 'STUDIO DEMO': ['cp_demo', 'seed-a'] },
    };
    const report = mapLegacyProjects('snapshot', defaults, entries);
    expect(report.complete).toBe(true);
    expect(report.projects.map(item => item.project.id)).toEqual(['seed-a', 'seed-b', 'cp_demo']);
    expect(report.projects[0]).toMatchObject({ project: { name: 'RINOMINATO DEMO' }, priority: 'high', color: '#fff', legacyFolder: 'STUDIO DEMO' });
    expect(report.projects[1]?.archived).toBe(true);
    expect(report.projects[2]).toMatchObject({ project: { name: 'CUSTOM DEMO' }, legacyFolder: 'STUDIO DEMO' });
    expect(report.orderByFolder[1]?.projectIds).toEqual(['cp_demo', 'seed-a']);
    expect(report.originals.find(item => item.sourcePath === 'PD/0')?.original).toEqual(base);
    expect(report.originals.find(item => item.sourcePath === 'proj_tag_cp_demo')?.original).toBe('OVERRIDE OBSOLETO');
    expect(Object.isFrozen(report.originals[0]?.original)).toBe(true);
    expect(base.tag).toBe('PROGETTO DEMO A');
    expect(report.warnings).toHaveLength(2);
  });

  it('eliminati esclusi dal catalogo attivo, archiviati conservati; task orfane non riassegnate', () => {
    const report = mapLegacyProjects('snapshot', defaults, { deletedPD: ['seed-a'], archived: ['seed-b'] });
    expect(report.projects.map(item => item.project.id)).toEqual(['seed-b']);
    expect(report.deletedProjects[0]?.project.id).toBe('seed-a');
    const agenda = mapLegacyAgenda('snapshot', report.projects.map(item => ({ ...item.project })), {
      'agenda_2026-10-25': [{ text: 'Orfana sintetica', projId: 'seed-a', done: false }, { text: 'Collegata archivio', projId: 'seed-b', done: true }],
    });
    expect(agenda.workspace.tasks).toHaveLength(1);
    expect(agenda.workspace.tasks[0]?.projectId).toBe('seed-b');
    expect(agenda.quarantine[0]?.original).toMatchObject({ projId: 'seed-a' });
  });

  it('folder override inesistente conserva il default V1 e segnala, cartella orfana non inventata', () => {
    const report = mapLegacyProjects('s', defaults, {
      'proj_folder_seed-a': 'INESISTENTE', customProjs: [{ ...base, id: 'cp_orfano', folder: 'CANCELLATA' }],
      projOrders: { 'LAVORO DEMO': ['obsoleto', 'seed-a', 'seed-a'] },
    });
    expect(report.projects[0]?.legacyFolder).toBe('LAVORO DEMO');
    expect(report.projects[2]).toMatchObject({ folderId: null, legacyFolder: 'CANCELLATA' });
    expect(report.folders).toHaveLength(2);
    expect(report.orderByFolder[0]?.projectIds).toEqual(['seed-a', 'seed-b']);
    expect(report.warnings).toHaveLength(3);
    const many = Array.from({ length: 103 }, (_, i) => ({ ...base, id: `p${i}` }));
    const saved = many.slice(1).map(item => item.id);
    const large = mapLegacyProjects('s', { ...defaults, projects: many }, { projOrders: { 'LAVORO DEMO': saved } });
    expect(large.orderByFolder[0]?.projectIds.indexOf('p0')).toBe(99);
  });

  it('collisioni e campi sconosciuti vanno in quarantena, senza scegliere un progetto arbitrario', () => {
    const report = mapLegacyProjects('s', defaults, {
      customProjs: [{ ...base, id: 'seed-a' }, { ...base, id: 'cp_unknown', futureField: 3 }],
      'proj_tag_mancante': 'Non perdere', estraneo: { intatto: true },
    });
    expect(report.complete).toBe(false);
    expect(report.projects.map(item => item.project.id)).toEqual(['seed-b']);
    expect(report.quarantine).toHaveLength(5);
    expect(report.quarantine.find(item => item.sourcePath === 'estraneo')?.original).toEqual({ intatto: true });
  });

  it('stesso snapshot è ripetibile e il catalogo copre forme speciali senza reinterpretare i contenuti iniziali', () => {
    const kinds = ['vinted', 'carte', 'risparmio', 'crypto', 'allenamento', 'alimentazione', 'stretching'];
    const projects = Array.from({ length: 14 }, (_, i) => i < 7 ? { ...base, id: `s${i}` } : { ...base, id: `s${i}`, hasInv: kinds[i - 7] });
    const input = { 'proj_tag_s0': 'NUOVO', archived: ['s1'] };
    const a = mapLegacyProjects('fisso', { ...defaults, projects }, input);
    const b = mapLegacyProjects('fisso', { ...defaults, projects }, { archived: ['s1'], 'proj_tag_s0': 'NUOVO' });
    expect(a).toEqual(b);
    expect(a.projects).toHaveLength(14);
    expect(a.projects.slice(7).map(item => item.kind)).toEqual(kinds);
    expect(a.originals.find(item => item.sourcePath === 'PD/0')?.original).toMatchObject({ tasks0: base.tasks0, note0: base.note0 });
  });

  it('dati strutturali invalidi e override invalidi non producono una migrazione apparentemente valida', () => {
    expect(() => mapLegacyProjects('bad/path', defaults, {})).toThrow();
    expect(() => mapLegacyProjects('s', defaults, { folders: null })).toThrow();
    expect(() => mapLegacyProjects('s', defaults, { customProjs: {} })).toThrow();
    expect(() => mapLegacyProjects('s', defaults, { projOrders: [] })).toThrow();
    expect(mapLegacyProjects('s', defaults, { 'proj_pri_seed-a': 'urgente' }).complete).toBe(false);
    expect(mapLegacyProjects('s', { ...defaults, projects: [{ ...base, hasInv: ['vinted'] }] }, {}).complete).toBe(false);
    const duplicates = mapLegacyProjects('s', defaults, { folders: ['LAVORO DEMO', 'LAVORO DEMO'] });
    expect(duplicates.folders).toHaveLength(0);
    expect(duplicates.complete).toBe(false);
  });
});
