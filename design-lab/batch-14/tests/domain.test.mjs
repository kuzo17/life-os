import test from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../src/data/store.mjs';
import { createSeed } from '../src/data/seed.mjs';
import { validateSnapshot } from '../src/data/schema.mjs';
import { createCommandBus } from '../src/domains/commands/bus.mjs';

function app() {
  let serial = 0;
  const store = createStore(createSeed(), { validate: validateSnapshot });
  const commands = createCommandBus(store, { nextId: prefix => `${prefix}-test-${++serial}` });
  return { store, commands };
}

test('snapshots and returned entities cannot be mutated by a view', () => {
  const { store, commands } = app();
  const snapshot = store.read();
  assert.throws(() => snapshot.tasks.push({}), TypeError);
  assert.throws(() => { snapshot.tasks[0].title = 'Corrotto'; }, TypeError);
  const created = commands.createEntity({ kind: 'task', title: 'Sintetica', projectId: 'kdp' });
  assert.equal(created.ok, true);
  assert.throws(() => { created.entity.title = 'Corrotto'; }, TypeError);
  assert.equal(snapshot.tasks.length, 5);
  assert.equal(store.read().tasks.length, 6);
});

test('multi capture rolls back even after the first insertion', () => {
  const { store, commands } = app();
  const before = store.read();
  const result = commands.captureBatch([
    { kind: 'task', title: 'Valida', projectId: 'kdp' },
    { kind: 'expense', title: 'Importo errato', projectId: 'kdp', amount: -4 }
  ]);
  assert.equal(result.ok, false);
  assert.equal(store.read(), before);
  assert.equal(store.revision(), 0);
  assert.equal(commands.canUndo(), false);
});

test('Inbox → task → Agenda → edit → undo share the same canonical record', () => {
  const { store, commands } = app();
  const triage = commands.triageInboxToTask(1, { title: 'Da Inbox', projectId: 'kdp', when: 'oggi' });
  assert.equal(triage.ok, true);
  const id = triage.entity.id;
  assert.equal(store.read().inbox.some(row => row.id === 1), false);
  assert.equal(store.read().tasks.filter(row => row.id === id).length, 1);
  assert.equal(commands.bulkMoveTasks([id], 'venerdì').ok, true);
  assert.equal(store.read().tasks.find(row => row.id === id).when, 'venerdì');
  assert.equal(commands.execute('task.update', { id, patch: { title: 'Aggiornata' } }).ok, true);
  commands.undo();
  assert.equal(store.read().tasks.find(row => row.id === id).title, 'Da Inbox');
  commands.undo();
  assert.equal(store.read().tasks.find(row => row.id === id).when, 'oggi');
  commands.undo();
  assert.equal(store.read().tasks.some(row => row.id === id), false);
  assert.equal(store.read().inbox.some(row => row.id === 1), true);
});

test('string-ID Inbox → note is atomic and reversible', () => {
  const { store, commands } = app();
  const source = commands.parkInbox('Nota sintetica');
  const count = store.read().inbox.length;
  assert.equal(commands.triageInbox(source.entity.id, { kind: 'note', projectId: 'missing' }).ok, false);
  assert.equal(store.read().inbox.length, count);
  const result = commands.triageInbox(source.entity.id, { kind: 'note', projectId: 'kdp' });
  assert.equal(result.ok, true);
  assert.equal(result.entity.title, 'Nota sintetica');
  assert.equal(store.read().inbox.length, count - 1);
  commands.undo();
  assert.equal(store.read().inbox.length, count);
  assert.equal(store.read().notes.some(row => row.id === result.entity.id), false);
});

test('folder rename/move/archive preserve stable project and task identity', () => {
  const { store, commands } = app();
  const folder = commands.execute('folder.save', { name: 'Cartella sintetica' }).entity;
  const taskProject = store.read().tasks[0].projectId;
  assert.equal(commands.execute('project.save', { id: 'kdp', name: 'Nome nuovo', folderId: folder.id, status: 'archived' }).ok, true);
  assert.equal(store.read().tasks[0].projectId, taskProject);
  assert.equal(commands.execute('folder.delete', { id: folder.id }).ok, false);
  commands.undo();
  assert.equal(store.read().projects.find(row => row.id === 'kdp').folderId, 'zjpc');
  assert.equal(commands.execute('folder.delete', { id: folder.id }).ok, true);
});

test('finance and inventory use the same Undo without affecting tasks', () => {
  const { store, commands } = app();
  const tasksBefore = structuredClone(store.read().tasks);
  commands.execute('inventory.save', { id: 'card-1', title: 'Carta modificata', quantity: 2 });
  commands.execute('finance.sourceMode', { id: 'shop' });
  commands.execute('finance.transaction', { name: 'Movimento sintetico', amount: 12, type: 'out' });
  assert.equal(store.read().tx.length, 4);
  commands.undo();
  assert.equal(store.read().tx.length, 3);
  commands.undo();
  assert.equal(store.read().incomeSources.find(row => row.id === 'shop').mode, 'fixed');
  commands.undo();
  assert.equal(store.read().inventory.find(row => row.id === 'card-1').quantity, 1);
  assert.deepEqual(store.read().tasks, tasksBefore);
});

test('invalid commands and stale bulk selections leave state and history untouched', () => {
  const { store, commands } = app();
  const before = store.read();
  for (const result of [
    commands.execute('unsupported', {}),
    commands.execute('toString', {}),
    commands.execute('task.update', { id: 't1', patch: { projectId: 'missing' } }),
    commands.bulkMoveTasks(['t1', 'missing'], 'domani'),
    commands.execute('inventory.save', { id: 'card-1', quantity: 0 }),
    commands.execute('finance.transaction', { name: 'Errato', amount: 0, type: 'out' }),
    commands.captureBatch([])
  ]) assert.equal(result.ok, false);
  assert.equal(store.read(), before);
  assert.equal(commands.history().length, 0);
});

test('isolated instances and unsubscribe do not leak data or notifications', () => {
  const first = app(), second = app();
  let calls = 0;
  const unsubscribe = first.store.subscribe(() => calls++);
  first.commands.toggleTask('t1');
  assert.equal(first.store.read().tasks[0].done, false);
  assert.equal(second.store.read().tasks[0].done, true);
  unsubscribe(); first.commands.undo();
  assert.equal(calls, 1);
});
