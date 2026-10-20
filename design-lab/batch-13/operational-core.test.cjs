const assert = require("node:assert/strict");
require("./operational-core.js");

let serial = 0;
let state = {
  tasks: [{ id: "t1", title: "Esistente", projectId: "p1", priority: "media", when: "oggi", time: "", done: false }],
  inbox: [{ id: "i1", text: "Idea da smistare", type: "idea" }],
  goals: [],
  recurrences: [],
  expenses: [],
  notes: []
};

const core = globalThis.LifeOSOperationalCore.createOperationalCore({
  read: () => state,
  restore: snapshot => { state = snapshot; },
  hasProject: id => id === "p1",
  nextId: prefix => `${prefix}-${++serial}`,
  now: () => "2026-10-20T00:00:00.000Z"
});

assert.equal(core.createEntity({ kind: "task", title: "", projectId: "p1" }).ok, false);
assert.equal(core.createEntity({ kind: "task", title: "Senza progetto" }).ok, false);

const created = core.createEntity({ kind: "task", title: "Nuova task", projectId: "p1", priority: "alta", when: "domani" });
assert.equal(created.ok, true);
assert.equal(state.tasks[0].title, "Nuova task");
assert.equal(state.tasks[0].when, "domani");

const batch = core.captureBatch([
  { kind: "task", title: "Task batch", projectId: "p1", when: "oggi" },
  { kind: "note", title: "Nota batch", projectId: "p1", extra: "Dettaglio" },
  { kind: "weight", title: "72.4" }
]);
assert.equal(batch.count, 3);
assert.equal(state.notes[0].title, "Nota batch");
assert.match(state.inbox[0].text, /^weight:/);

const beforeMove = state.tasks.find(task => task.title === "Task batch").when;
core.bulkMoveTasks([state.tasks.find(task => task.title === "Task batch").id], "venerdì");
assert.equal(state.tasks.find(task => task.title === "Task batch").when, "venerdì");
assert.equal(core.undo().ok, true);
assert.equal(state.tasks.find(task => task.title === "Task batch").when, beforeMove);

const triaged = core.triageInboxToTask("i1", { title: "Idea da smistare", projectId: "p1", priority: "bassa", when: "oggi" });
assert.equal(triaged.ok, true);
assert.equal(state.inbox.some(item => item.id === "i1"), false);
assert.equal(state.tasks[0].title, "Idea da smistare");

const countBeforeDelete = state.tasks.length;
core.bulkDeleteTasks([state.tasks[0].id]);
assert.equal(state.tasks.length, countBeforeDelete - 1);
core.undo();
assert.equal(state.tasks.length, countBeforeDelete);

assert.equal(core.history().length > 0, true);
assert.equal(core.canUndo(), true);
console.log("Batch 13 operational core PASS: 15 assertions");
