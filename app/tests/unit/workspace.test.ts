import { describe, expect, it } from 'vitest';
import { createRuntime } from '../../src/app/runtime';
import { createSyntheticWorkspace } from '../../src/data/fixtures/workspace';
import { applyWorkspaceCommand } from '../../src/domain/workspace/commands';
import { completion, tasksForProject, tasksOn, unscheduledTasks } from '../../src/domain/workspace/selectors';
import { isCalendarDate, validateWorkspace } from '../../src/domain/workspace/validation';

describe('contratto iniziale workspace, non ancora mapping V1', () => {
  it('le viste selezionano gli stessi record canonici, senza copie mutabili', async () => {
    const runtime = createRuntime();
    await runtime.workspace.execute({ type: 'task.setCompleted', id: 'task-1', completed: true });
    const current = runtime.repository.getSnapshot();
    const today = tasksOn(current.data, runtime.referenceDay);
    const project = tasksForProject(current.data, 'orione');
    expect(today.find(task => task.id === 'task-1')).toBe(project.find(task => task.id === 'task-1'));
    expect(completion(today)).toEqual({ completed: 2, total: 3 });
    expect(current.durability).toBe('volatile');
    await runtime.workspace.undo();
    expect(runtime.repository.getSnapshot().data.tasks[0]?.completed).toBe(false);
  });

  it('la rinomina non modifica identità o riferimenti delle task', async () => {
    const runtime = createRuntime();
    const before = runtime.repository.getSnapshot().data.tasks;
    expect((await runtime.workspace.execute({ type: 'project.rename', id: 'orione', name: '  Nuovo nome  ' })).ok).toBe(true);
    expect(runtime.repository.getSnapshot().data.projects[0]?.name).toBe('Nuovo nome');
    expect(runtime.repository.getSnapshot().data.tasks).toEqual(before);
  });

  it('non ammette nomi vuoti, comandi sconosciuti o ID non presenti', async () => {
    const runtime = createRuntime();
    const before = runtime.repository.getSnapshot();
    const results = await Promise.all([
      runtime.workspace.execute({ type: 'project.rename', id: 'orione', name: ' ' }),
      runtime.workspace.execute({ type: 'task.setCompleted', id: 'inesistente', completed: true }),
      runtime.workspace.execute({ type: 'toString' } as never),
    ]);
    expect(results.every(result => !result.ok)).toBe(true);
    expect(runtime.repository.getSnapshot()).toBe(before);
  });

  it('due commit sulla stessa revisione non si sovrascrivono silenziosamente', async () => {
    const runtime = createRuntime();
    const current = await runtime.repository.read();
    const next = applyWorkspaceCommand(current.data, { type: 'project.rename', id: 'orione', name: 'Primo' });
    const other = applyWorkspaceCommand(current.data, { type: 'project.rename', id: 'orione', name: 'Secondo' });
    const results = await Promise.all([
      runtime.repository.commit({ expectedRevision: 0, next, label: 'Primo' }),
      runtime.repository.commit({ expectedRevision: 0, next: other, label: 'Secondo' }),
    ]);
    expect(results.map(result => result.ok)).toEqual([true, false]);
    expect(runtime.repository.getSnapshot().data.projects[0]?.name).toBe('Primo');
    expect(runtime.repository.getSnapshot().revision).toBe(1);
  });

  it('il repository rifiuta formati sconosciuti senza scartare campi in silenzio', async () => {
    const runtime = createRuntime();
    const next = { ...createSyntheticWorkspace(), extra: 'non mappato' };
    expect((await runtime.repository.commit({ expectedRevision: 0, next, label: 'Input' })).ok).toBe(false);
    expect(runtime.repository.getSnapshot().revision).toBe(0);
  });

  it('valida ID unici, relazioni, booleani e date di calendario', () => {
    const seed = createSyntheticWorkspace();
    expect(() => validateWorkspace(seed)).not.toThrow();
    expect(unscheduledTasks(seed)).toHaveLength(1);
    const invalid = structuredClone(seed);
    invalid.tasks[0]!.scheduledOn = '2026-02-30';
    expect(() => validateWorkspace(invalid)).toThrow();
    invalid.tasks[0]!.scheduledOn = '2026-02-28';
    invalid.tasks[1]!.id = invalid.tasks[0]!.id;
    expect(() => validateWorkspace(invalid)).toThrow();
    for (const value of ['2026-2-01', 'oggi', '2026-13-01', null, 20261021]) expect(isCalendarDate(value)).toBe(false);
    expect(isCalendarDate('2028-02-29')).toBe(true);
  });

  it('una nuova istanza riparte dal seed: non finge persistenza', async () => {
    const first = createRuntime();
    await first.workspace.execute({ type: 'task.setCompleted', id: 'task-1', completed: true });
    expect(createRuntime().repository.getSnapshot().data.tasks[0]?.completed).toBe(false);
  });
});
