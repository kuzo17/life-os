import { DomainError } from '../../../domain/shared/result';
import type { Workspace } from '../../../domain/workspace/model';
import { isRecord, validateWorkspace } from '../../../domain/workspace/validation';
import type { AtomicWorkspaceStorage, StoredWorkspace } from '../../ports/atomic-workspace-storage';

export const localDatabaseName = 'lifeos-lab-workspace-v1';
const storeName = 'workspace';
const recordKey = 'current';

function decode(value: unknown): StoredWorkspace {
  if (!isRecord(value) || Object.keys(value).length !== 3 || value.format !== 1 ||
    !Number.isSafeInteger(value.revision) || Number(value.revision) < 0) throw new DomainError('Archivio locale non valido. Nessun dato è stato sostituito.');
  validateWorkspace(value.data);
  return { revision: value.revision as number, data: value.data };
}

async function openDatabase(factory: IDBFactory, seed: Workspace): Promise<IDBDatabase> {
  validateWorkspace(seed);
  const owned = structuredClone(seed);
  return new Promise((resolve, reject) => {
    let settled = false;
    const request = factory.open(localDatabaseName, 1);
    const timer = setTimeout(() => fail(), 6000);
    function fail() {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(new Error('Storage non disponibile.'));
    }
    request.onerror = fail;
    request.onblocked = fail;
    request.onupgradeneeded = event => {
      if (settled || event.oldVersion !== 0) { request.transaction?.abort(); return; }
      // Seed solo nella transazione di creazione. Mai su lettura fallita/mancante.
      request.result.createObjectStore(storeName).add({ format: 1, revision: 0, data: owned }, recordKey);
    };
    request.onsuccess = () => {
      if (settled) { request.result.close(); return; }
      settled = true;
      clearTimeout(timer);
      request.result.onversionchange = () => request.result.close();
      resolve(request.result);
    };
  });
}

export async function openIndexedDbStorage(factory: IDBFactory, seed: Workspace): Promise<AtomicWorkspaceStorage> {
  const database = await openDatabase(factory, seed);
  function run(expectedRevision?: number, next?: Workspace): Promise<StoredWorkspace | null> {
    return new Promise((resolve, reject) => {
      let result: StoredWorkspace | null = null;
      let invalid: unknown;
      // Nessun await dentro la transazione: il browser non deve chiuderla a metà.
      const transaction = expectedRevision === undefined
        ? database.transaction(storeName, 'readonly')
        : database.transaction(storeName, 'readwrite', { durability: 'strict' });
      transaction.onabort = () => reject(invalid ?? transaction.error ?? new Error('Salvataggio interrotto.'));
      transaction.onerror = () => { /* L'abort gestisce l'esito; nessun log di dati. */ };
      transaction.oncomplete = () => resolve(result);
      const store = transaction.objectStore(storeName);
      const request = store.get(recordKey);
      request.onsuccess = () => {
        try {
          const current = decode(request.result);
          if (expectedRevision === undefined) { result = current; return; }
          if (current.revision !== expectedRevision) return;
          if (!next || !Number.isSafeInteger(current.revision + 1)) throw new Error('Revisione non valida.');
          result = { revision: current.revision + 1, data: next };
          store.put({ format: 1, ...result }, recordKey);
        } catch (error) { invalid = error; transaction.abort(); }
      };
    });
  }
  const storage: AtomicWorkspaceStorage = Object.freeze({
    async read() {
      const value = await run();
      if (!value) throw new Error('Archivio locale assente.');
      return value;
    },
    compareAndSwap(expectedRevision, next) {
      validateWorkspace(next);
      return run(expectedRevision, structuredClone(next));
    },
    close: () => database.close(),
  } satisfies AtomicWorkspaceStorage);
  try { await storage.read(); return storage; }
  catch (error) { database.close(); throw error; }
}
