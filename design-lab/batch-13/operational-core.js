(function attachOperationalCore(global) {
  "use strict";

  const clone = value => JSON.parse(JSON.stringify(value));
  const text = value => String(value ?? "").trim();

  function createOperationalCore(options) {
    if (!options || typeof options.read !== "function" || typeof options.restore !== "function") {
      throw new TypeError("Operational Core richiede read() e restore().");
    }

    const history = [];
    const undoStack = [];
    const now = options.now || (() => new Date().toISOString());
    const nextId = options.nextId || (prefix => `${prefix}-${Date.now()}`);
    const hasProject = options.hasProject || (() => true);
    const changed = options.onChange || (() => {});

    function fail(error) {
      return { ok: false, error };
    }

    function record(label, mutate) {
      const before = clone(options.read());
      const result = mutate(options.read()) || { ok: true };
      if (result.ok === false) return result;
      undoStack.push({ label, before });
      if (undoStack.length > 30) undoStack.shift();
      history.unshift({ id: nextId("op"), label, at: now(), undone: false });
      if (history.length > 50) history.length = 50;
      changed({ type: "commit", label });
      return { ok: true, label, ...result };
    }

    function validateEntity(input) {
      const kind = input.kind;
      const title = text(input.title);
      if (!title) return fail("Inserisci un titolo.");
      const projectKinds = new Set(["task", "goal", "weekly_goal", "recurring", "expense", "note", "link"]);
      if (projectKinds.has(kind) && (!input.projectId || !hasProject(input.projectId))) {
        return fail("Scegli un progetto valido.");
      }
      if (kind === "expense" && (!Number.isFinite(Number(input.amount)) || Number(input.amount) < 0)) {
        return fail("Controlla l’importo.");
      }
      return { ok: true, title };
    }

    function insertEntity(state, input, validated) {
      const kind = input.kind;
      const title = validated.title;
      if (kind === "task") {
        const entity = { id: nextId("task"), title, projectId: input.projectId, priority: input.priority || "media", when: text(input.when) || "oggi", time: text(input.time), done: false };
        state.tasks.unshift(entity);
        return { entity, destination: "tasks" };
      }
      if (kind === "goal" || kind === "weekly_goal") {
        const entity = { id: nextId("goal"), projectId: input.projectId, title, scope: kind === "weekly_goal" ? "settimanale" : "generale", done: false };
        state.goals.unshift(entity);
        return { entity, destination: "goals" };
      }
      if (kind === "recurring") {
        const entity = { id: nextId("recur"), projectId: input.projectId, title, rule: text(input.extra) || "Frequenza da definire", streak: 0, active: true };
        state.recurrences.unshift(entity);
        return { entity, destination: "recurrences" };
      }
      if (kind === "expense") {
        const entity = { id: nextId("expense"), projectId: input.projectId, title, amount: Number(input.amount), date: text(input.when) || "Da definire", paid: false };
        state.expenses.unshift(entity);
        return { entity, destination: "expenses" };
      }
      if (kind === "note" || kind === "link") {
        const entity = { id: nextId("note"), projectId: input.projectId, title, body: text(input.extra), kind: kind === "link" ? "link" : "nota" };
        state.notes.unshift(entity);
        return { entity, destination: "notes" };
      }
      const entity = { id: nextId("inbox"), text: `${kind}: ${title}`, type: kind || "idea" };
      state.inbox.unshift(entity);
      return { entity, destination: "inbox" };
    }

    function createEntity(input) {
      const validated = validateEntity(input);
      if (!validated.ok) return validated;
      return record(`Creato: ${validated.title}`, state => insertEntity(state, input, validated));
    }

    function captureBatch(items) {
      const validated = items.map(item => ({ item, result: validateEntity(item) }));
      const invalid = validated.find(entry => !entry.result.ok);
      if (invalid) return invalid.result;
      return record(`Cattura: ${items.length} elementi`, state => {
        const created = validated.map(entry => insertEntity(state, entry.item, entry.result));
        return { count: created.length, created };
      });
    }

    function parkInbox(value, type = "idea") {
      const valueText = text(value);
      if (!valueText) return fail("Scrivi qualcosa da salvare.");
      return record("Salvato in Inbox", state => {
        const entity = { id: nextId("inbox"), text: valueText, type };
        state.inbox.unshift(entity);
        return { entity };
      });
    }

    function triageInboxToTask(inboxId, input) {
      const validated = validateEntity({ ...input, kind: "task" });
      if (!validated.ok) return validated;
      return record("Inbox → Task", state => {
        const index = state.inbox.findIndex(item => String(item.id) === String(inboxId));
        if (index < 0) return fail("Elemento Inbox non trovato.");
        const [source] = state.inbox.splice(index, 1);
        const created = insertEntity(state, { ...input, kind: "task", title: input.title || source.text }, validated);
        return { source, ...created };
      });
    }

    function toggle(collection, id, field, label) {
      return record(label, state => {
        const entity = state[collection].find(item => String(item.id) === String(id));
        if (!entity) return fail("Elemento non trovato.");
        entity[field] = !entity[field];
        return { entity };
      });
    }

    function deleteEntity(collection, id, label = "Elemento eliminato") {
      return record(label, state => {
        const index = state[collection].findIndex(item => String(item.id) === String(id));
        if (index < 0) return fail("Elemento non trovato.");
        const [entity] = state[collection].splice(index, 1);
        return { entity };
      });
    }

    function bulkMoveTasks(ids, when) {
      const selected = new Set(ids.map(String));
      return record(`Spostate ${selected.size} task`, state => {
        let count = 0;
        for (const task of state.tasks) if (selected.has(String(task.id))) { task.when = when; count += 1; }
        return count ? { count } : fail("Nessuna task selezionata.");
      });
    }

    function bulkDuplicateTasks(ids) {
      const selected = new Set(ids.map(String));
      return record(`Duplicate ${selected.size} task`, state => {
        const source = state.tasks.filter(task => selected.has(String(task.id)));
        if (!source.length) return fail("Nessuna task selezionata.");
        const entities = source.map(task => ({ ...clone(task), id: nextId("task"), title: `${task.title} · copia`, done: false }));
        state.tasks.unshift(...entities);
        return { count: entities.length, entities };
      });
    }

    function bulkDeleteTasks(ids) {
      const selected = new Set(ids.map(String));
      return record(`Eliminate ${selected.size} task`, state => {
        const removed = state.tasks.filter(task => selected.has(String(task.id)));
        if (!removed.length) return fail("Nessuna task selezionata.");
        state.tasks.splice(0, state.tasks.length, ...state.tasks.filter(task => !selected.has(String(task.id))));
        return { count: removed.length, entities: removed };
      });
    }

    function undo() {
      const entry = undoStack.pop();
      if (!entry) return fail("Nessuna operazione da annullare.");
      options.restore(clone(entry.before));
      const previous = history.find(item => !item.undone && item.label === entry.label);
      if (previous) previous.undone = true;
      history.unshift({ id: nextId("op"), label: `Annullato: ${entry.label}`, at: now(), undone: false });
      changed({ type: "undo", label: entry.label });
      return { ok: true, label: entry.label };
    }

    return {
      createEntity,
      captureBatch,
      parkInbox,
      triageInboxToTask,
      toggleTask: id => toggle("tasks", id, "done", "Stato task aggiornato"),
      toggleGoal: id => toggle("goals", id, "done", "Stato obiettivo aggiornato"),
      toggleRecurrence: id => toggle("recurrences", id, "active", "Ricorrenza aggiornata"),
      toggleExpense: id => toggle("expenses", id, "paid", "Stato spesa aggiornato"),
      deleteEntity,
      bulkMoveTasks,
      bulkDuplicateTasks,
      bulkDeleteTasks,
      undo,
      canUndo: () => undoStack.length > 0,
      history: () => clone(history),
      pendingUndoLabel: () => undoStack.at(-1)?.label || null
    };
  }

  global.LifeOSOperationalCore = { createOperationalCore };
})(typeof globalThis !== "undefined" ? globalThis : window);
