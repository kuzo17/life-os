import { $ } from "../../shared/dom.mjs";
import { safe, priorityChip } from "../../shared/patterns.mjs";
import { projectName, taskPriority } from "../workspace/selectors.mjs";
import { dialog } from "../../shared/feedback.mjs";
import { projects, tasks } from "../../data/runtime.mjs";
function renderTaskRow(t, showProject = true) {
  return '<div class="list-item"><button class="check ' + (t.done ? "done" : "") + '" data-task="' + safe(t.id) + '" aria-pressed="' + Boolean(t.done) + '" aria-label="Completa o riapri task">' + (t.done ? "✓" : "") + '</button>' + '<div class="body"><button class="text-action task-title ' + (t.done ? "done" : "") + '" data-task-leaf="' + safe(t.id) + '">' + safe(t.title) + '</button><div class="sub">' + (showProject ? safe(projectName(t.projectId)) + " · " : "") + (t.when && t.when !== "oggi" ? safe(t.when) + " · " : "") + safe(t.time || "Senza orario") + '</div></div>' + priorityChip(taskPriority(t)) + '</div>';
}
function taskRows() {
  return tasks.filter(t => t.when === "oggi").map(t => renderTaskRow(t, true)).join("") || '<div class="empty">Nessuna task per oggi.</div>';
}
function taskLeaf(id) {
  const t = tasks.find(t => t.id === id);
  if (!t) return;
  dialog("Dettaglio task", '<form id="task-leaf-form" data-task-id="' + safe(t.id) + '">' + '<div class="eyebrow">DETTAGLIO ELEMENTO / SHEET</div>' + '<label class="field-label" for="leaf-title">Titolo</label><input id="leaf-title" class="field" value="' + safe(t.title) + '" maxlength="180" required>' + '<label class="field-label" for="leaf-project">Progetto</label><select id="leaf-project" class="field">' + projects.map(p => '<option value="' + p.id + '" ' + (t.projectId === p.id ? "selected" : "") + '>' + safe(p.name) + '</option>').join("") + '</select>' + '<label class="field-label" for="leaf-priority">Priorità</label><select id="leaf-priority" class="field">' + ["alta", "media", "bassa"].map(x => '<option ' + (taskPriority(t) === x ? "selected" : "") + '>' + x + '</option>').join("") + '</select>' + '<label class="field-label" for="leaf-when">Quando</label><select id="leaf-when" class="field">' + ["oggi", "domani", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica", "Da pianificare"].map(x => '<option ' + (t.when === x ? "selected" : "") + '>' + x + '</option>').join("") + '</select>' + '<div class="modal-actions"><button class="button" type="button" data-close>Chiudi</button><button class="button primary" type="submit">Salva nella demo</button></div></form>' + '<p class="xs muted" style="line-height:1.7;margin-top:12px">Stesso ID task nelle viste progetto, Oggi e Agenda. I dati non vengono salvati fuori dal prototipo.</p>');
  $("#dlg").classList.add("sheet");
}
export { renderTaskRow, taskRows, taskLeaf };
