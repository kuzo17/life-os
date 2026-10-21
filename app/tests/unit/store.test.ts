import { describe, expect, it } from 'vitest';
import { createTransactionStore } from '../../src/data/adapters/memory/transaction-store';
import { createSyntheticWorkspace } from '../../src/data/fixtures/workspace';
import { DomainError } from '../../src/domain/shared/result';
import { validateWorkspace } from '../../src/domain/workspace/validation';

function setup() { return createTransactionStore(createSyntheticWorkspace(), validateWorkspace); }

describe('transazioni recuperate dal core Batch 14', () => {
  it('isola seed, snapshot, ricevute e storico dalle mutazioni esterne', () => {
    const seed = createSyntheticWorkspace();
    const store = createTransactionStore(seed, validateWorkspace);
    seed.tasks.splice(0);
    const before = store.getSnapshot();
    expect(before.data.tasks).toHaveLength(5);
    expect(Reflect.set(before.data.tasks[0]!, 'title', 'Corrotto')).toBe(false);
    expect(before.data.tasks[0]?.title).toBe('Definire il prossimo passo');
    expect(Object.isFrozen(before.data.tasks[0])).toBe(true);
    const result = store.transact(0, 'Rinomina', draft => { draft.projects[0]!.name = 'Nuovo nome'; });
    expect(result.ok).toBe(true);
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(store.history()[0])).toBe(true);
    expect(before.data.projects[0]?.name).toBe('Progetto Orione');
  });

  it('esegue rollback anche dopo una modifica parziale', () => {
    const store = setup();
    const before = store.getSnapshot();
    const result = store.transact(0, 'Multipla', draft => {
      draft.tasks.splice(0, 1);
      throw new DomainError('Seconda operazione non valida.');
    });
    expect(result.ok).toBe(false);
    expect(store.getSnapshot()).toBe(before);
    expect(store.history()).toHaveLength(0);
    expect(store.undoLabel()).toBeNull();
  });

  it('valida il candidato prima di pubblicarlo e notificare', () => {
    const store = setup();
    let calls = 0;
    store.subscribe(() => { calls++; });
    expect(store.transact(0, 'Errata', draft => { draft.tasks[0]!.projectId = 'inesistente'; }).ok).toBe(false);
    expect(store.getSnapshot().revision).toBe(0);
    expect(calls).toBe(0);
  });

  it('mantiene revisioni monotone e collegamenti dopo rinomina e Undo', () => {
    const store = setup();
    const id = store.getSnapshot().data.tasks[0]?.projectId;
    expect(store.transact(0, 'Rinomina', draft => { draft.projects[0]!.name = 'Rinominato'; }).ok).toBe(true);
    expect(store.getSnapshot().data.tasks[0]?.projectId).toBe(id);
    expect(store.undo(1).ok).toBe(true);
    expect(store.getSnapshot().revision).toBe(2);
    expect(store.getSnapshot().data.projects[0]?.name).toBe('Progetto Orione');
    expect(store.history()[0]?.undone).toBe(true);
    expect(store.undo(2).ok).toBe(false);
  });

  it('isola istanze e unsubscribe', () => {
    const first = setup(), second = setup();
    let calls = 0;
    const unsubscribe = first.subscribe(() => { calls++; });
    first.transact(0, 'Task', draft => { draft.tasks[0]!.completed = true; });
    unsubscribe();
    first.undo(1);
    expect(calls).toBe(1);
    expect(second.getSnapshot().revision).toBe(0);
  });

  it('rifiuta revisioni vecchie e scritture rientranti; un osservatore fallito non annulla il commit', () => {
    const store = setup();
    let observerCalls = 0;
    let reentrantCode = '';
    store.subscribe(() => { throw new Error('Osservatore rotto'); });
    store.subscribe(() => {
      observerCalls++;
      const result = store.transact(1, 'Rientrante', () => {});
      if (!result.ok) reentrantCode = result.code;
    });
    expect(store.transact(0, 'Valida', draft => { draft.tasks[0]!.completed = true; }).ok).toBe(true);
    expect(observerCalls).toBe(1);
    expect(reentrantCode).toBe('busy');
    expect(store.transact(0, 'Vecchia', () => {}).ok).toBe(false);
    expect(store.undo(0).ok).toBe(false);
    expect(store.getSnapshot().data.tasks[0]?.completed).toBe(true);
  });

  it('non espone errori interni o contenuti arbitrari come messaggi utente', () => {
    const store = setup();
    const result = store.transact(0, 'Errore', () => { throw new Error('contenuto interno da non esporre'); });
    expect(JSON.stringify(result)).not.toContain('contenuto interno');
    expect(store.getSnapshot().revision).toBe(0);
  });

  it('limita Undo e storico senza rendere mutabili i vecchi snapshot', () => {
    const store = setup();
    for (let index = 0; index < 60; index++) store.transact(index, 'Rinomina', draft => { draft.projects[0]!.name = `Nome ${index}`; });
    expect(store.history()).toHaveLength(50);
    for (let index = 0; index < 30; index++) expect(store.undo(60 + index).ok).toBe(true);
    expect(store.undo(90).ok).toBe(false);
  });
});
