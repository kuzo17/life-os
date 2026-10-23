import { DomainError, UncertainWriteError } from '../../../domain/shared/result';
import type { Workspace } from '../../../domain/workspace/model';
import type { AtomicWorkspaceStorage } from '../../ports/atomic-workspace-storage';
import { decodeRtdb, encodeRtdb } from './codec';

export const emulatorOrigin = 'http://127.0.0.1:8900';
export const emulatorNamespace = 'demo-lifeos-contract';

// Solo contratto di test: nessuna URL, credenziale o selezione backend configurabile.
export async function openEmulatorStorage(runId: string, seed: Workspace, transport: typeof fetch = globalThis.fetch): Promise<AtomicWorkspaceStorage> {
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(runId)) throw new DomainError('Identità prova non valida.');
  const initial = encodeRtdb({ revision: 0, data: seed });
  const url = `${emulatorOrigin}/contractRuns/${runId}.json?ns=${emulatorNamespace}`;
  let closed = false;
  async function readTagged() {
    if (closed) throw new Error('Archivio di prova chiuso.');
    const response = await transport(url, { headers: { 'X-Firebase-ETag': 'true' }, redirect: 'error', signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error('Lettura emulatore non riuscita.');
    const etag = response.headers.get('etag');
    if (!etag) throw new Error('Confronto atomico non disponibile.');
    const value: unknown = await response.json();
    return { etag, value: value === null ? null : decodeRtdb(value) };
  }
  async function put(etag: string, data: ReturnType<typeof encodeRtdb>) {
    if (closed) throw new Error('Archivio di prova chiuso.');
    let response: Response;
    try {
      response = await transport(url, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'if-match': etag }, body: JSON.stringify(data), redirect: 'error', signal: AbortSignal.timeout(5000) });
    } catch { throw new UncertainWriteError(); }
    if (response.status === 412) return null;
    if (response.status >= 500) throw new UncertainWriteError();
    if (!response.ok) throw new Error('Scrittura emulatore rifiutata.');
    try {
      const saved = decodeRtdb(await response.json());
      if (JSON.stringify(encodeRtdb(saved)) !== JSON.stringify(data)) throw new UncertainWriteError();
      return saved;
    }
    catch { throw new UncertainWriteError(); }
  }
  const found = await readTagged();
  if (found.value === null) {
    await put('null_etag', initial);
    if ((await readTagged()).value === null) throw new Error('Inizializzazione non confermata.');
  }
  return Object.freeze({
    async read() {
      const value = (await readTagged()).value;
      if (!value) throw new Error('Record di prova assente: nessun reset automatico.');
      return value;
    },
    async compareAndSwap(expectedRevision, next) {
      const candidate = encodeRtdb({ revision: expectedRevision + 1, data: next });
      const current = await readTagged();
      if (current.value === null) throw new Error('Record di prova assente.');
      if (current.value.revision !== expectedRevision) return null;
      return put(current.etag, candidate);
    },
    close() { closed = true; },
  } satisfies AtomicWorkspaceStorage);
}
