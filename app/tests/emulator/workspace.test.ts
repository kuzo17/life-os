import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { workspaceRepositoryContract } from '../contracts/workspace-contract';
import { createSyntheticWorkspace } from '../../src/data/fixtures/workspace';
import { openEmulatorStorage, emulatorOrigin, emulatorNamespace } from '../../src/data/adapters/rtdb/emulator-storage';
import { createStoredWorkspaceRepository } from '../../src/data/adapters/shared/stored-workspace-repository';
import { createWorkspaceService } from '../../src/application/workspace-service';
import { encodeRtdb } from '../../src/data/adapters/rtdb/codec';
import type { Workspace } from '../../src/domain/workspace/model';

describe('stesso contratto su RTDB ufficiale emulato', () => {
  workspaceRepositoryContract(async (seed = createSyntheticWorkspace()) => createStoredWorkspaceRepository(await openEmulatorStorage(randomUUID(), seed), 'emulated'));
});

it('inizializzazione ripetuta/riapertura non resettano o duplicano, durata esplicitamente emulata', async () => {
  const id = randomUUID();
  const first = await createStoredWorkspaceRepository(await openEmulatorStorage(id, createSyntheticWorkspace()), 'emulated');
  await createWorkspaceService(first).execute({ type: 'project.rename', id: 'orione', name: 'Nome salvato emulatore' });
  first.close();
  const reopened = await createStoredWorkspaceRepository(await openEmulatorStorage(id, createSyntheticWorkspace()), 'emulated');
  expect(reopened.getSnapshot().durability).toBe('emulated');
  expect(reopened.getSnapshot().data.projects[0]?.name).toBe('Nome salvato emulatore');
  expect(reopened.getSnapshot().data.tasks).toHaveLength(5);
  expect(reopened.getSnapshot().revision).toBe(1);
  expect(reopened.getSnapshot().undoLabel).toBeNull();
  reopened.close();
});

it('RTDB non perde le collezioni vuote nel codec', async () => {
  const numericIds = createSyntheticWorkspace();
  numericIds.projects[0]!.id = '0';
  numericIds.projects[0]!.description = '';
  for (const task of numericIds.tasks) if (task.projectId === 'orione') task.projectId = '0';
  numericIds.tasks[0]!.id = '0';
  for (const seed of [{ schemaVersion: 2, projects: [], tasks: [] } satisfies Workspace, { ...createSyntheticWorkspace(), tasks: [] }, numericIds]) {
    const storage = await openEmulatorStorage(randomUUID(), seed);
    expect((await storage.read()).data).toEqual(seed);
    storage.close();
  }
});

it('due inizializzazioni contemporanee dello stesso estratto non duplicano né falliscono', async () => {
  const id = randomUUID();
  const stores = await Promise.all([openEmulatorStorage(id, createSyntheticWorkspace()), openEmulatorStorage(id, createSyntheticWorkspace())]);
  for (const storage of stores) {
    expect((await storage.read()).data).toEqual(createSyntheticWorkspace());
    expect((await storage.read()).revision).toBe(0);
    storage.close();
  }
});

it('due connessioni concorrenti e replay obsoleto: una sola scrittura confermata', async () => {
  const id = randomUUID();
  const a = await openEmulatorStorage(id, createSyntheticWorkspace());
  const b = await openEmulatorStorage(id, createSyntheticWorkspace());
  const one = createSyntheticWorkspace(), two = createSyntheticWorkspace();
  one.projects[0]!.name = 'Connessione A'; two.projects[0]!.name = 'Connessione B';
  const results = await Promise.all([a.compareAndSwap(0, one), b.compareAndSwap(0, two)]);
  expect(results.filter(Boolean)).toHaveLength(1);
  expect((await a.read()).revision).toBe(1);
  expect(await b.compareAndSwap(0, two)).toBeNull();
  expect((await a.read()).revision).toBe(1);
  a.close(); b.close();
});

it('conferma persa dopo PUT reale: esito incerto, rilettura e nessun retry duplicato', async () => {
  let loseAck = false;
  const transport: typeof fetch = async (input, init) => {
    const response = await fetch(input, init);
    if (loseAck && init?.method === 'PUT') { loseAck = false; throw new Error('Risposta persa, contenuto da non esporre'); }
    return response;
  };
  const repo = await createStoredWorkspaceRepository(await openEmulatorStorage(randomUUID(), createSyntheticWorkspace(), transport), 'emulated');
  const service = createWorkspaceService(repo);
  loseAck = true;
  const result = await service.execute({ type: 'project.rename', id: 'orione', name: 'Applicato, ACK perso' });
  expect(result).toMatchObject({ ok: false, code: 'uncertain' });
  expect(JSON.stringify(result)).not.toContain('contenuto da non esporre');
  expect(repo.getSnapshot().revision).toBe(0);
  expect((await repo.read()).data.projects[0]?.name).toBe('Applicato, ACK perso');
  expect(repo.getSnapshot().revision).toBe(1);
  expect((await service.execute({ type: 'project.rename', id: 'orione', name: 'Replay' }, 0)).ok).toBe(false);
  expect((await repo.read()).revision).toBe(1);
  repo.close();
});

it('regole di prova negano radice/altre aree e cancellazione, senza credenziali reali', async () => {
  const id = randomUUID();
  const storage = await openEmulatorStorage(id, createSyntheticWorkspace());
  for (const [path, method] of [['/', 'GET'], ['/private', 'PUT'], ['/contractRuns', 'GET'], [`/contractRuns/${id}`, 'DELETE']] as const) {
    const response = await fetch(`${emulatorOrigin}${path}.json?ns=${emulatorNamespace}`, { method, redirect: 'error', ...(method === 'PUT' ? { body: '{"probe":"synthetic"}', headers: { 'Content-Type': 'application/json' } } : {}) });
    expect(response.status, `${method} ${path}`).toBe(401);
  }
  expect((await storage.read()).revision).toBe(0);
  storage.close();
});

it('record emulatore sconosciuto non viene riseminato', async () => {
  const id = randomUUID();
  const seed = createSyntheticWorkspace();
  (await openEmulatorStorage(id, seed)).close();
  const url = `${emulatorOrigin}/contractRuns/${id}.json?ns=${emulatorNamespace}`;
  const response = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...encodeRtdb({ revision: 1, data: seed }), future: 'conservare' }), redirect: 'error' });
  expect(response.ok).toBe(true);
  await expect(openEmulatorStorage(id, seed)).rejects.toThrow();
  expect(await (await fetch(url)).json()).toMatchObject({ revision: 1, future: 'conservare' });
});
