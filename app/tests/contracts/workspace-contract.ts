import { expect, it } from 'vitest';
import { createSyntheticWorkspace } from '../../src/data/fixtures/workspace';
import { createWorkspaceService } from '../../src/application/workspace-service';
import { cloneMutable } from '../../src/domain/shared/immutable';
import type { Workspace } from '../../src/domain/workspace/model';
import type { WorkspaceRepository } from '../../src/data/ports/workspace-repository';
import { mapLegacyAgenda } from '../../src/data/migrations/legacy-agenda';
import { tasksForProject, tasksOn } from '../../src/domain/workspace/selectors';

export function workspaceRepositoryContract(open: (seed?: Workspace) => Promise<WorkspaceRepository>) {
  it('estratto V1 → mapper → repository → comando: identità e metadati rimangono canonici', async () => {
    const mapped = mapLegacyAgenda('contratto', createSyntheticWorkspace().projects, {
      'agenda_2026-10-25': [{ text: 'Task V1 sintetica', projId: 'orione', done: false, time: '23:30', pri: 'high', type: 'day', ts: 1000 }],
    });
    const repo = await open(cloneMutable<Workspace>(mapped.workspace));
    const id = mapped.mappings[0]!.taskId;
    expect((await createWorkspaceService(repo).execute({ type: 'task.setCompleted', id, completed: true })).ok).toBe(true);
    const current = (await repo.read()).data;
    expect(tasksOn(current, '2026-10-25')[0]).toBe(tasksForProject(current, 'orione')[0]);
    expect(current.tasks).toHaveLength(1);
    expect(current.tasks[0]).toMatchObject({ id, completed: true, time: '23:30', priority: 'high', scheduledOn: '2026-10-25' });
    repo.close();
  });

  it('commit, lettura stabile, snapshot immutabili, notifiche e Undo monotono', async () => {
    const repo = await open();
    const initial = await repo.read();
    expect(repo.getSnapshot()).toBe(initial);
    const next = cloneMutable<Workspace>(initial.data);
    next.tasks[0]!.completed = true;
    let notified = 0;
    repo.subscribe(() => { throw new Error('Osservatore isolato'); });
    const stop = repo.subscribe(() => { notified++; });
    expect(await repo.commit({ expectedRevision: 0, next, label: 'Completa' })).toEqual({ ok: true, value: 1 });
    next.tasks.splice(0);
    expect(repo.getSnapshot().data.tasks[0]?.completed).toBe(true);
    expect(initial.data.tasks[0]?.completed).toBe(false);
    expect(Object.isFrozen(repo.getSnapshot().data.tasks[0])).toBe(true);
    expect(repo.getSnapshot().undoLabel).toBe('Completa');
    expect(await repo.undo(1)).toEqual({ ok: true, value: 2 });
    expect(repo.getSnapshot().data).toEqual(initial.data);
    expect(notified).toBe(2);
    stop();
    expect((await repo.undo(2)).ok).toBe(false);
    repo.close();
  });

  it('rifiuta record invalidi e commit obsoleti senza notificare o sovrascrivere', async () => {
    const repo = await open();
    const initial = repo.getSnapshot();
    const next = cloneMutable<Workspace>(initial.data);
    next.tasks[0]!.time = '25:00';
    expect((await repo.commit({ expectedRevision: 0, next, label: 'Invalida' })).ok).toBe(false);
    expect(repo.getSnapshot()).toBe(initial);
    next.tasks[0]!.time = '12:00';
    const results = await Promise.all([repo.commit({ expectedRevision: 0, next, label: 'A' }), repo.commit({ expectedRevision: 0, next, label: 'B' })]);
    expect(results.filter(result => result.ok)).toHaveLength(1);
    expect(repo.getSnapshot().revision).toBe(1);
    repo.close();
  });
}
