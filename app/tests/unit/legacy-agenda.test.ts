import { describe, expect, it } from 'vitest';
import { mapLegacyAgenda } from '../../src/data/migrations/legacy-agenda';
import { tasksOn } from '../../src/domain/workspace/selectors';

const projects = [{ id: 'cp_synthetic', name: 'Progetto sintetico', description: '' }];
const task = { text: 'Testo identico', projId: '', done: false, ts: 1000, type: 'day', pri: 'none', time: '' };

describe('caratterizzazione Agenda V1: baseline e58a77e3, righe 1741–2166', () => {
  it('conserva task libere, riferimenti, orario, priorità e ordine senza collassare titoli/timestamp uguali', () => {
    const input = { 'agenda_2026-10-25': [task, { ...task, projId: 'cp_synthetic', time: '09:00', pri: 'high', done: true }, { ...task }] };
    const output = mapLegacyAgenda('fixture01', projects, input);
    expect(output.complete).toBe(true);
    expect(output.workspace.tasks.map(item => item.id)).toEqual(['v1_fixture01_20261025_0', 'v1_fixture01_20261025_1', 'v1_fixture01_20261025_2']);
    expect(output.workspace.tasks[0]?.projectId).toBeNull();
    expect(output.workspace.tasks[1]).toMatchObject({ projectId: 'cp_synthetic', time: '09:00', priority: 'high', completed: true, sortOrder: 1 });
    expect(tasksOn(output.workspace, '2026-10-25').map(item => item.sortOrder)).toEqual([1, 0, 2]);
    expect(output.originals.map(item => item.original)).toEqual(input['agenda_2026-10-25']);
    expect(Object.isFrozen(output.originals[0]?.original)).toBe(true);
    expect(input['agenda_2026-10-25'][0]).toBe(task);
  });

  it('stesso snapshot e ordine diverso delle chiavi producono stesso mapping, senza Date.now/ID casuali', () => {
    const a = { 'agenda_2028-02-29': [task], 'agenda_2026-12-31': [{ ...task, ts: undefined }] };
    const b = { 'agenda_2026-12-31': a['agenda_2026-12-31'], 'agenda_2028-02-29': a['agenda_2028-02-29'] };
    expect(mapLegacyAgenda('fisso', projects, a)).toEqual(mapLegacyAgenda('fisso', projects, b));
    expect(mapLegacyAgenda('altro', projects, a).mappings).not.toEqual(mapLegacyAgenda('fisso', projects, a).mappings);
    for (const day of ['2026-03-29', '2026-10-25', '2026-12-31', '2027-01-01', '2028-02-29']) {
      expect(mapLegacyAgenda('date', projects, { [`agenda_${day}`]: [task] }).workspace.tasks[0]?.scheduledOn).toBe(day);
    }
  });

  it('conserva integralmente orfani, forme ambigue e campi sconosciuti in quarantena, senza ALTRO o correzioni inventate', () => {
    const records = [task, { ...task, projId: 'eliminato' }, { ...task, projId: null }, { ...task, unknown: 'non perdere' }, { ...task, type: 'recur' }, { ...task, done: 1 }, { ...task, pri: 'low' }, { ...task, pri: null }, { ...task, time: '24:00' }, { ...task, ts: Infinity }, { ...task, text: '' }];
    const output = mapLegacyAgenda('errori', projects, { 'agenda_2026-10-21': records, 'agenda_2026-02-30': [task], 'agenda_2026-10-22': {}, 'goals_demo': [task] });
    expect(output.complete).toBe(false);
    expect(output.workspace.projects).toEqual(projects);
    expect(output.workspace.tasks).toHaveLength(1);
    expect(output.mappings.length + output.quarantine.filter(item => item.sourcePath.startsWith('agenda_2026-10-21/')).length).toBe(records.length);
    expect(output.quarantine.find(item => item.sourcePath === 'agenda_2026-10-21/3')?.original).toEqual(records[3]);
    expect(output.quarantine).toHaveLength(13);
    expect(() => mapLegacyAgenda('../bad', projects, {})).toThrow();
  });
});
