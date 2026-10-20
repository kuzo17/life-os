import { safe, sectionHead, headline, priorityChip } from "../../shared/patterns.mjs";
import { projectName, taskPriority } from "../workspace/selectors.mjs";
import { dialog } from "../../shared/feedback.mjs";
import { agendaWeek, agendaTodayIdx } from "../../shared/dates.mjs";
import { state, agendaSelection } from "../../app/ui-state.mjs";
import { projects, tasks } from "../../data/runtime.mjs";
function taskWeekIndex(t) {
  const w = String(t.when || "").toLocaleLowerCase("it");
  if (w === "oggi") return agendaTodayIdx();
  if (w === "domani") return (agendaTodayIdx() + 1) % 7;
  if (w === "dopodomani") return (agendaTodayIdx() + 2) % 7;
  return agendaWeek.indexOf(w);
}
function agendaTasksForDay(idx) {
  return tasks.filter(t => taskWeekIndex(t) === idx);
}
function agendaTaskMarkup(t) {
  return '<div class="agenda-task">' + (state.agendaBulk ? '<button class="agenda-select ' + (agendaSelection.has(t.id) ? 'on' : '') + '" data-agenda-select="' + safe(t.id) + '" aria-pressed="' + agendaSelection.has(t.id) + '" aria-label="Seleziona ' + safe(t.title) + '">✓</button>' : '') + '<div class="agenda-task-when">' + safe(t.time || "—") + '</div>' + '<button class="check ' + (t.done ? 'done' : '') + '" data-task="' + safe(t.id) + '" aria-pressed="' + t.done + '" aria-label="Completa la task">' + (t.done ? '✓' : '') + '</button>' + '<div class="body"><button class="text-action ' + (t.done ? 'task-title done' : '') + '" data-task-leaf="' + safe(t.id) + '">' + safe(t.title) + '</button>' + '<div class="sub">' + safe(projectName(t.projectId)) + '</div></div>' + priorityChip(taskPriority(t)) + '</div>';
}
function agendaDayColumns() {
  return '<div class="agenda-week-grid">' + agendaWeek.map((w, i) => {
    const day = agendaTasksForDay(i),
      count = day.filter(t => !t.done).length;
    return '<button class="agenda-day-card ' + (state.agendaDay === i ? 'selected' : '') + '" data-day="' + i + '"><div class="agenda-day-title">' + w.slice(0, 3).toUpperCase() + '</div>' + '<div class="agenda-day-num">' + (i === agendaTodayIdx() ? 'OGGI' : String(i + 1).padStart(2, '0')) + '</div>' + '<div class="agenda-day-count">' + count + ' da fare</div>' + '<div class="agenda-day-markers">' + day.slice(0, 3).map(t => '<i style="background:var(' + (t.done ? '--muted' : taskPriority(t) === 'alta' ? '--coral' : '--blue') + ')"></i>').join('') + '</div></button>';
  }).join('') + '</div>';
}
function viewAgenda() {
  const pending = tasks.filter(t => !t.done),
    dated = pending.filter(t => taskWeekIndex(t) >= 0),
    unscheduled = pending.filter(t => taskWeekIndex(t) < 0);
  const idx = state.agendaDay,
    selected = agendaWeek[idx],
    dayItems = agendaTasksForDay(idx).filter(t => state.agendaProject === 'all' || t.projectId === state.agendaProject);
  const list = dayItems.length ? dayItems.map(agendaTaskMarkup).join('') : '<div class="empty">Nessuna task assegnata a questo giorno nella demo.</div>';
  const dayTabs = '<div class="action-row"><button class="tab ' + (state.agendaMode === 'week' ? 'active' : '') + '" data-agenda-mode="week">Settimana</button>' + '<button class="tab ' + (state.agendaMode === 'day' ? 'active' : '') + '" data-agenda-mode="day">Giorno</button>' + '<button class="tab ' + (state.agendaBulk ? 'active' : '') + '" data-agenda-bulk-toggle aria-pressed="' + state.agendaBulk + '">☑ Seleziona</button>' + '<button class="button small" data-action="quick">+ Nuova attività</button></div>';
  const projectFilter = '<label class="tiny muted" for="agenda-project">Mostra progetto</label> <select class="field agenda-project-filter" id="agenda-project"><option value="all">Tutti i progetti</option>' + projects.map(p => '<option value="' + p.id + '" ' + (state.agendaProject === p.id ? 'selected' : '') + '>' + safe(p.name) + '</option>').join('') + '</select>';
  const weekly = state.agendaMode === 'week' ? agendaDayColumns() : '<div class="agenda-day-focus">' + agendaDayColumns() + '</div>';
  const todayOrOther = idx === agendaTodayIdx() ? 'OGGI' : 'GIORNO SELEZIONATO';
  const bulk = state.agendaBulk ? '<div class="agenda-bulkbar"><b>' + agendaSelection.size + ' selezionate</b><button class="button small" data-agenda-bulk-action="move" ' + (!agendaSelection.size ? 'disabled' : '') + '>Sposta</button><button class="button small" data-agenda-bulk-action="duplicate" ' + (!agendaSelection.size ? 'disabled' : '') + '>Duplica</button><button class="button small danger" data-agenda-bulk-action="delete" ' + (!agendaSelection.size ? 'disabled' : '') + '>Elimina</button><button class="button small" data-agenda-bulk-action="cancel">Annulla</button></div>' : '';
  return headline("Agenda", "La stessa task vive nel progetto e si vede qui nella data prevista. Nessun clone fra schermate.", "PIANIFICAZIONE / SETTIMANA") + dayTabs + '<div class="agenda-command"><div><span class="eyebrow">LA TUA SETTIMANA</span><h2>' + dated.length + ' task pianificate <span class="small muted">· ' + unscheduled.length + ' da organizzare</span></h2></div><div>' + projectFilter + '</div></div>' + weekly + '<div class="agenda-main-grid"><div>' + sectionHead(selected.charAt(0).toUpperCase() + selected.slice(1), "Apri una task per cambiare progetto, data o priorità") + '<div class="card"><div class="eyebrow">' + todayOrOther + '</div>' + list + '</div>' + bulk + '</div>' + '<div>' + sectionHead("Organizza senza duplicare", "Le modifiche si riflettono in tutti i moduli") + '<div class="card"><div class="eyebrow">INBOX TEMPORALE</div><h2>' + unscheduled.length + ' task senza giorno</h2>' + '<p class="small muted" style="line-height:1.75;margin-top:13px">Scegli un giorno direttamente da una task. Manteniamo sempre il progetto originale.</p>' + '<div>' + unscheduled.slice(0, 5).map(t => '<div class="list-item"><div class="body"><button class="text-action" data-task-leaf="' + safe(t.id) + '">' + safe(t.title) + '</button><div class="sub">' + safe(projectName(t.projectId)) + '</div></div><button class="button small" data-agenda-schedule="' + safe(t.id) + '">Pianifica</button></div>').join('') + '</div>' + '<div class="hint-box" style="margin-top:15px">Batch 08 rende navigabili selezione multipla, spostamento, duplicazione ed eliminazione. Drag/drop, date ISO/timezone e ricorrenze materializzate restano gap espliciti.</div></div></div></div>';
}
function openAgendaBulkMove() {
  dialog("Sposta task selezionate", '<form id="agenda-bulk-move-form"><p class="small muted">' + agendaSelection.size + ' task · la stessa entità cambierà giorno, senza creare copie.</p><label class="field-label" for="agenda-bulk-day">Nuovo giorno</label><select class="field" id="agenda-bulk-day">' + agendaWeek.map(x => '<option value="' + x + '">' + x + '</option>').join('') + '<option value="Da pianificare">Da pianificare</option></select><div class="modal-actions"><button type="button" class="button" data-close>Annulla</button><button class="button primary" type="submit">Sposta nella demo</button></div></form>');
}
export { taskWeekIndex, agendaTasksForDay, agendaTaskMarkup, agendaDayColumns, viewAgenda, openAgendaBulkMove };
