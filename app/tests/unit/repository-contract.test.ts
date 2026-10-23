import { describe, expect, it } from 'vitest';
import { createLocalWorkspaceRepository } from '../../src/data/adapters/local/workspace-repository';
import { createMemoryWorkspaceRepository } from '../../src/data/adapters/memory/workspace-repository';
import { createSyntheticWorkspace } from '../../src/data/fixtures/workspace';
import type { AtomicWorkspaceStorage } from '../../src/data/ports/atomic-workspace-storage';
import { createWorkspaceService } from '../../src/application/workspace-service';
import { cloneMutable } from '../../src/domain/shared/immutable';
import type { Workspace } from '../../src/domain/workspace/model';
import { workspaceRepositoryContract } from '../contracts/workspace-contract';

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

  workspaceRepositoryContract(open);
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

it('una conferma lenta non fa regredire una cache che ha già letto la revisione successiva', async () => {
  let stored = { revision: 0, data: createSyntheticWorkspace() };
  let release!: () => void;
  let written!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  const started = new Promise<void>(resolve => { written = resolve; });
  const storage: AtomicWorkspaceStorage = {
    read: async () => structuredClone(stored), close: () => {},
    async compareAndSwap(_expected, next) {
      const saved = { revision: 1, data: structuredClone(next) };
      stored = saved;
      written();
      await gate;
      return saved;
    },
  };
  const repo = await createLocalWorkspaceRepository(storage);
  const next = createSyntheticWorkspace();
  next.projects[0]!.name = 'Prima conferma lenta';
  const commit = repo.commit({ expectedRevision: 0, next, label: 'Lenta' });
  await started;
  stored = { revision: 2, data: createSyntheticWorkspace() };
  stored.data.projects[0]!.name = 'Seconda modifica già letta';
  await repo.read();
  release();
  expect((await commit).ok).toBe(true);
  expect(repo.getSnapshot().revision).toBe(2);
  expect(repo.getSnapshot().data.projects[0]?.name).toBe('Seconda modifica già letta');
  expect(repo.getSnapshot().undoLabel).toBeNull();
});
