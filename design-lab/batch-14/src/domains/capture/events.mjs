import { $, $$ } from "../../shared/dom.mjs";
import { notifyUndo, notify } from "../../shared/feedback.mjs";
import { finishCoreAction } from "../../app/core-feedback.mjs";
import { render } from "../../app/render-request.mjs";
import { goto } from "../../app/router.mjs";
import { quick, interpretSimpleRecap, showRecapPreview } from "./views.mjs";
import { state } from "../../app/ui-state.mjs";
import { operationalCore } from "../commands/runtime.mjs";
function handleCaptureClick(e, b) {
  if (b.dataset.ux === "natural-open") {
    quick("natural");
    return true;
  }
  if (b.dataset.ux === "quick-mode") {
    const natural = b.dataset.mode === "natural";
    $("#quick-natural").hidden = !natural;
    $("#quick-fast").hidden = natural;
    $$('[data-ux="quick-mode"]').forEach(el => {
      const active = el === b;
      el.classList.toggle("active", active);
      el.setAttribute("aria-pressed", String(active));
    });
    setTimeout(() => $(natural ? "#spoken-input" : "#fast-kind")?.focus(), 0);
    return true;
  }
  if (b.dataset.ux === "recap-back") {
    quick();
    return true;
  }
  if (b.dataset.ux === "remove-recap") {
    const row = b.closest("[data-row]");
    if (row) row.remove();
    return true;
  }
  if (b.dataset.ux === "recap-confirm") {
    const rows = $$("#spoken-preview [data-row]");
    const parsed = rows.map(el => ({
      title: el.querySelector("[data-row-text]").value.trim(),
      kind: el.querySelector("[data-row-kind]").value,
      when: el.querySelector("[data-row-day]").value,
      projectId: el.querySelector("[data-row-project]").value,
      priority: el.querySelector("[data-row-priority]").value
    })).filter(x => x.title);
    const missing = parsed.filter(x => x.kind === "task" && !x.projectId);
    if (missing.length) {
      notify("Seleziona un progetto per ogni task prima di confermare");
      return true;
    }
    const payload = parsed.map(el => el.kind === "task" ? {
      kind: "task",
      title: el.title,
      projectId: el.projectId,
      priority: el.priority,
      when: el.when
    } : {
      kind: "capture-" + el.kind,
      title: el.title + " · " + el.when
    });
    const result = operationalCore.captureBatch(payload);
    if (!result.ok) {
      notify(result.error);
      return true;
    }
    $("#dlg").close();
    state.projectId = null;
    goto(parsed.some(x => x.kind === "task" && x.when !== "oggi") ? "agenda" : "today");
    notifyUndo(result.count + " elementi inseriti · Demo", () => {
      operationalCore.undo();
      render();
      notify("Cattura annullata · Demo");
    });
    return true;
  }
  return false;
}
function handleCaptureSubmit(e) {
  if (e.target.id === "spoken-form") {
    e.preventDefault();
    const text = $("#spoken-input").value.trim();
    if (!text) return true;
    const items = interpretSimpleRecap(text);
    if (items.length) showRecapPreview(items);else notify("Non ho rilevato elementi da aggiungere");
  }
  if (e.target.id === "fast-form") {
    e.preventDefault();
    const kind = $("#fast-kind").value;
    const title = $("#fast-title")?.value.trim();
    if (!title) return true;
    const projectId = $("#fast-project")?.value || "";
    if (kind === "project") {
      const result = operationalCore.execute('project.save', {
        name: title,
        folderId: $("#fast-folder")?.value || "altro",
        cat: $("#fast-extra")?.value.trim() || "Personale",
        desc: "Progetto sintetico."
      }, 'Progetto creato');
      if (result.ok) $("#dlg").close();
      finishCoreAction(result);
      return true;
    }
    const input = {
      kind,
      title,
      projectId,
      priority: $("#fast-priority")?.value || "media",
      when: $("#fast-date")?.value.trim().toLocaleLowerCase("it") || "oggi",
      amount: Number($("#fast-amount")?.value),
      extra: $("#fast-extra")?.value.trim() || ""
    };
    const result = state.triageId ? operationalCore.triageInbox(state.triageId, input) : operationalCore.createEntity(input);
    if (result.ok) {
      state.triageId = null;
      $("#dlg").close();
    }
    finishCoreAction(result, result.destination === "inbox" ? "Bozza " + kind + " in Inbox · Demo" : "Elemento inserito nella vista demo");
  }
}
export { handleCaptureClick, handleCaptureSubmit };
