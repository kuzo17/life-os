import { $ } from "../../shared/dom.mjs";
import { projectById } from "../workspace/selectors.mjs";
import { notify } from "../../shared/feedback.mjs";
import { addProjectEntity, manageFolders, editFolder, editProject } from "./views.mjs";
import { finishCoreAction } from "../../app/core-feedback.mjs";
import { render } from "../../app/render-request.mjs";
import { navigate } from "../../app/router.mjs";
import { state } from "../../app/ui-state.mjs";
import { operationalCore } from "../commands/runtime.mjs";
function handleProjectsClick(e, b) {
  if (b.hasAttribute("data-folder-manage")) {
    manageFolders();
    return true;
  }
  if (b.hasAttribute("data-folder-create")) {
    editFolder(null);
    return true;
  }
  if (b.dataset.folderRename) {
    editFolder(b.dataset.folderRename);
    return true;
  }
  if (b.dataset.folderShift) {
    const result = operationalCore.execute('folder.reorder', {
      id: b.dataset.folderShift,
      shift: Number(b.dataset.shift)
    }, 'Ordine cartelle aggiornato');
    if (finishCoreAction(result)) manageFolders();
    return true;
  }
  if (b.dataset.folderDelete) {
    const result = operationalCore.execute('folder.delete', {
      id: b.dataset.folderDelete
    }, 'Cartella rimossa');
    if (finishCoreAction(result)) manageFolders();
    return true;
  }
  if (b.dataset.projectCreate) {
    editProject(null, b.dataset.projectCreate);
    return true;
  }
  if (b.dataset.projectOrganize) {
    editProject(b.dataset.projectOrganize);
    return true;
  }
  if (b.dataset.projectEntityAdd) {
    addProjectEntity(b.dataset.projectEntityAdd, b.dataset.projectId);
    return true;
  }
  if (b.dataset.goalToggle) {
    finishCoreAction(operationalCore.toggleGoal(b.dataset.goalToggle), "Stato obiettivo aggiornato · Demo");
    return true;
  }
  if (b.dataset.recurToggle) {
    finishCoreAction(operationalCore.toggleRecurrence(b.dataset.recurToggle), "Ricorrenza aggiornata · Demo");
    return true;
  }
  if (b.dataset.expenseToggle) {
    finishCoreAction(operationalCore.toggleExpense(b.dataset.expenseToggle), "Stato spesa aggiornato · nessun movimento creato");
    return true;
  }
  if (b.dataset.entityDelete) {
    const collection = {
      goal: "goals",
      recur: "recurrences",
      note: "notes"
    }[b.dataset.entityDelete];
    finishCoreAction(operationalCore.deleteEntity(collection, b.dataset.entityId), "Elemento rimosso · Demo");
    return true;
  }
  if (b.dataset.folder) {
    navigate(() => {
      state.screen = "projects";
      state.folderId = b.dataset.folder;
      state.projectId = null;
    }, {
      scroll: true
    });
    return true;
  }
  if (b.dataset.project) {
    navigate(() => {
      state.screen = "projects";
      state.projectId = b.dataset.project;
      state.folderId = projectById(b.dataset.project)?.folderId || null;
      state.projectSection = "tasks";
    }, {
      scroll: true
    });
    return true;
  }
  if (b.hasAttribute("data-projects-back")) {
    navigate(() => {
      state.screen = "projects";
      state.projectId = null;
      state.folderId = null;
    }, {
      scroll: true
    });
    return true;
  }
  if (b.hasAttribute("data-folder-back")) {
    navigate(() => {
      const orig = projectById(state.projectId);
      state.folderId = orig?.folderId || state.folderId;
      state.projectId = null;
    }, {
      scroll: true
    });
    return true;
  }
  if (b.dataset.workspaceTab) {
    navigate(() => {
      state.projectSection = b.dataset.workspaceTab;
    });
    return true;
  }
  if (b.dataset.projectFilter) {
    state.projectFilter = b.dataset.projectFilter;
    render();
    return true;
  }
  return false;
}
function handleProjectsSubmit(e) {
  if (e.target.id === "project-entity-form") {
    e.preventDefault();
    const kind = e.target.dataset.entityKind,
      projectId = e.target.dataset.projectId,
      title = $("#entity-title").value.trim(),
      extra = $("#entity-extra")?.value.trim() || "";
    if (!title) return true;
    const mapped = kind === "goals" ? extra === "settimanale" ? "weekly_goal" : "goal" : kind === "recur" ? "recurring" : kind === "expenses" ? "expense" : $("#entity-note-kind")?.value === "link" ? "link" : "note";
    const result = operationalCore.createEntity({
      kind: mapped,
      projectId,
      title,
      extra,
      amount: Number($("#entity-amount")?.value),
      when: extra
    });
    if (result.ok) $("#dlg").close();
    finishCoreAction(result, "Elemento aggiunto alla sezione progetto · Demo");
    return true;
  }
  if (e.target.id === "folder-edit-form") {
    e.preventDefault();
    const name = $("#folder-name").value.trim(),
      id = e.target.dataset.folderId;
    if (!name) return true;
    const result = operationalCore.execute('folder.save', {
      id: id || null,
      name
    }, id ? 'Cartella rinominata' : 'Cartella creata');
    if (finishCoreAction(result)) manageFolders();
    return true;
  }
  if (e.target.id === "project-edit-form") {
    e.preventDefault();
    const name = $("#project-name").value.trim(),
      folderId = $("#project-folder").value;
    const id = e.target.dataset.projectId;
    const result = operationalCore.execute('project.save', {
      id: id || null,
      name,
      folderId,
      cat: $("#project-category").value,
      status: $("#project-status").value,
      desc: $("#project-desc").value
    }, 'Progetto organizzato');
    if (!result.ok) {
      notify(result.error);
      return true;
    }
    $("#dlg").close();
    navigate(() => {
      state.screen = "projects";
      state.folderId = folderId;
      state.projectId = result.entity.id;
      state.projectSection = "tasks";
    }, {
      scroll: true
    });
    finishCoreAction(result);
    return true;
  }
}
export { handleProjectsClick, handleProjectsSubmit };
