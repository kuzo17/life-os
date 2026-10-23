import { expect, it, vi } from 'vitest';
import { encodeRtdb, decodeRtdb } from '../../src/data/adapters/rtdb/codec';
import { openEmulatorStorage, emulatorOrigin, emulatorNamespace } from '../../src/data/adapters/rtdb/emulator-storage';
import { createSyntheticWorkspace } from '../../src/data/fixtures/workspace';
import { saveConfirmation } from '../../src/application/save-confirmation';

it('codec RTDB esplicito, ordine e null conservati, anche con ID numerici e collezioni vuote omesse', () => {
  const value = { revision: 7, data: createSyntheticWorkspace() };
  expect(decodeRtdb(encodeRtdb(value))).toEqual(value);
  expect(decodeRtdb({ format: 1, revision: 0, schemaVersion: 2, projectCount: 0, taskCount: 0 })).toEqual({ revision: 0, data: { schemaVersion: 2, projects: [], tasks: [] } });
  value.data.projects[0]!.id = '0';
  for (const task of value.data.tasks) if (task.projectId === 'orione') task.projectId = '0';
  value.data.tasks[0]!.id = '0';
  expect(decodeRtdb(encodeRtdb(value))).toEqual(value);
});

it('codec rifiuta campi sconosciuti, contatori/indici errati, ID e riferimenti alterati', () => {
  const wire = encodeRtdb({ revision: 0, data: createSyntheticWorkspace() });
  for (const change of [
    { ...wire, extra: true }, { ...wire, projectCount: 0 }, { ...wire, tasks: [] },
    { ...wire, projects: { p_orione: { ...wire.projects.p_orione, index: 3 } } },
    { ...wire, tasks: { ...wire.tasks, 't_task-1': { ...wire.tasks['t_task-1'], projectId: 'nonpresente' } } },
    { ...wire, revision: -1 }, { ...wire, schemaVersion: 999 },
  ]) expect(() => decodeRtdb(change)).toThrow();
});

it('adattatore di prova non accetta URL/percorsi arbitrari né segue redirect', async () => {
  expect(saveConfirmation('emulated')).toBe('Confermato nell’emulatore locale di prova.');
  const transport = vi.fn<typeof fetch>(async (input, init) => {
    const url = new URL(String(input));
    expect(url.origin).toBe(emulatorOrigin);
    expect(url.searchParams.get('ns')).toBe(emulatorNamespace);
    expect(init?.redirect).toBe('error');
    expect(init?.signal).toBeDefined();
    return new Response(JSON.stringify(encodeRtdb({ revision: 0, data: createSyntheticWorkspace() })), { headers: { etag: 'fixed' } });
  });
  await expect(openEmulatorStorage('../bad', createSyntheticWorkspace(), transport)).rejects.toThrow();
  expect(transport).not.toHaveBeenCalled();
  const storage = await openEmulatorStorage('safe', createSyntheticWorkspace(), transport);
  storage.close();
  await expect(storage.read()).rejects.toThrow();
  expect(transport).toHaveBeenCalledTimes(1);
});
