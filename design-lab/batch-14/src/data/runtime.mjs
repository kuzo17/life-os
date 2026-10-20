import { createStore } from './store.mjs';
import { createSeed } from './seed.mjs';
import { validateSnapshot } from './schema.mjs';
export const store = createStore(createSeed(), {
  validate: validateSnapshot
});
export let projects, tasks, inbox, tx, projectGoals, recurrences, projectExpenses, projectNotes, homeFolders, incomeSources, inventory;
function bindSnapshot(snapshot) {
  ({
    projects,
    tasks,
    inbox,
    tx,
    goals: projectGoals,
    recurrences,
    expenses: projectExpenses,
    notes: projectNotes,
    homeFolders,
    incomeSources,
    inventory
  } = snapshot);
}
bindSnapshot(store.read());
store.subscribe(bindSnapshot);
