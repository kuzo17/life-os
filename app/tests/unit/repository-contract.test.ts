import { describe, expect, it } from 'vitest';
import { createLocalWorkspaceRepository } from '../../src/data/adapters/local/workspace-repository';
import { createMemoryWorkspaceRepository } from '../../src/data/adapters/memory/workspace-repository';
import { createSyntheticWorkspace } from '../../src/data/fixtures/workspace';
import type { AtomicWorkspaceStorage } from '../../src/data/ports/atomic-workspace-storage';
import { createWorkspaceService } from '../../src/application/workspace-service';
import { cloneMutable } from '../../src/domain/shared/immutable';
import type { Workspace } from '../../src/domain/workspace/model';
import { mapLegacyAgenda } from '../../src/data/migrations/legacy-agenda';
import { tasksForProject, tasksOn } from '../../src/domain/workspace/selectors';

// Fake atomico per il contratto, NON un emulatore IndexedDB/RTDB. IDB reale negli E2E.
function fakeStorage(seed = createSyntheticWorkspace()) {
  let stored = { revision: 0, data: structuredClone(seed) };
  let fail = false;
  const storage: AtomicWorkspaceStorage = {
    read: async () => structuredClone(stored),
    async compareAndSwap(expectedRevision, next) {
      if (fail) throw new Error('quota: contenuto privato da non mostrare');
      if (expectedRevision !== stored.revision) return null;
      stored = { revision: stored.revision + 1, data: structuredClone(next) };
      return structuredClone(stored);
    },
    close: () => {},
  };
  return { storage, setFailure: (value: boolean) => { fail = value; } };
}

for (const adapter of ['memory', 'local-contract'] as const) describe(`contratto repository ${adapter}`, () => {
  async function open(seed = createSyntheticWorkspace()) { return adapter === 'memory' ? createMemoryWorkspaceRepository(seed) : createLocalWorkspaceRepository(fakeStorage(seed).storage); }

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
});

it('fallimento duraturo: niente snapshot ottimistico, Undo consumato o messaggi interni', async () => {
  const fake = fakeStorage();
  const repo = await createLocalWorkspaceRepository(fake.storage);
  const service = createWorkspaceService(repo);
  fake.setFailure(true);
  const before = repo.getSnapshot();
  const result = await service.execute({ type: 'project.rename', id: 'orione', name: 'Nuovo' });
  expect(result.ok).toBe(false);
  expect(JSON.stringify(result)).not.toContain('privato');
  expect(repo.getSnapshot()).toBe(before);
  fake.setFailure(false);
  await service.execute({ type: 'project.rename', id: 'orione', name: 'Nuovo' });
  fake.setFailure(true);
  expect((await service.undo()).ok).toBe(false);
  expect(repo.getSnapshot().undoLabel).toBe('Rinomina progetto');
  fake.setFailure(false);
  expect((await service.undo()).ok).toBe(true);
  expect(repo.getSnapshot().data.projects[0]?.name).toBe('Progetto Orione');
});

it('istanze condivise: CAS rifiuta stale, refresh invalida Undo e una bozza non sovrascrive dopo refresh', async () => {
  const fake = fakeStorage();
  const a = await createLocalWorkspaceRepository(fake.storage);
  const b = await createLocalWorkspaceRepository(fake.storage);
  const one = createWorkspaceService(a), two = createWorkspaceService(b);
  await one.execute({ type: 'project.rename', id: 'orione', name: 'Prima scheda' });
  const stale = cloneMutable<Workspace>(b.getSnapshot().data);
  stale.projects[0]!.name = 'Sovrascrittura';
  expect((await b.commit({ expectedRevision: 0, next: stale, label: 'Stale' })).ok).toBe(false);
  expect(b.getSnapshot().data.projects[0]?.name).toBe('Prima scheda');
  expect(b.getSnapshot().undoLabel).toBeNull();
  expect((await two.execute({ type: 'project.rename', id: 'orione', name: 'Vecchia bozza' }, 0)).ok).toBe(false);
  await two.execute({ type: 'task.setCompleted', id: 'task-1', completed: true });
  await a.read();
  expect(a.getSnapshot().undoLabel).toBeNull();
  expect((await a.undo(a.getSnapshot().revision)).ok).toBe(false);
  const reopened = await createLocalWorkspaceRepository(fake.storage);
  expect(reopened.getSnapshot().data).toEqual(b.getSnapshot().data);
  expect(reopened.getSnapshot().undoLabel).toBeNull();
});
