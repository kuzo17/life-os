import { safe, sectionHead, headline } from "../../shared/patterns.mjs";
import { projectName, taskPriority } from "../workspace/selectors.mjs";
import { taskRows } from "../tasks/views.mjs";
import { dialog } from "../../shared/feedback.mjs";
import { state } from "../../app/ui-state.mjs";
import { tasks, inbox } from "../../data/runtime.mjs";
function viewTodayBase() {
  const todays = tasks.filter(t => t.when === "oggi"),
    done = todays.filter(t => t.done).length,
    pct = todays.length ? Math.round(done / todays.length * 100) : 0;
  const next = todays.filter(t => !t.done).sort((a, b) => ({
    alta: 0,
    media: 1,
    bassa: 2
  }[taskPriority(a)] ?? 1) - ({
    alta: 0,
    media: 1,
    bassa: 2
  }[taskPriority(b)] ?? 1))[0];
  return headline("Oggi", "Non tutto è urgente. Inizia dalla prossima cosa importante.", "IL TUO CONTROL CENTER") + '<div class="grid c12">' + '<div class="hero span7"><div><div class="hero-label">PROSSIMA TASK DEL GIORNO · DATI DEMO</div><h2>' + safe(next?.title || "Nessuna task urgente.") + '</h2><p>' + (next ? "Progetto: " + safe(projectName(next.projectId)) + " · Priorità " + safe(taskPriority(next)) : "Hai completato le attività del giorno nella demo.") + '</p></div><div class="hero-row"><button class="button primary" data-action="focus-start">◉ Focus lavoro</button><span class="small muted">Timer di concentrazione generico; FitOS usa la sua Focus Mode dedicata.</span></div></div>' + '<div class="span5 grid c12" style="gap:12px"><div class="accent-block span12"><div><div class="xs strong">IL TUO AVANZAMENTO</div><div class="num">' + pct + '% <span class="xs" style="opacity:.8">' + done + '/' + todays.length + ' task</span></div></div><div style="height:6px;border-radius:10px;background:#ffffff45;overflow:hidden"><div style="width:' + pct + '%;height:100%;background:#fff;border-radius:10px"></div></div></div>' + '<div class="card span6" style="padding:15px"><div class="muted xs">Abitudini</div><div class="statnum">3/4</div><span class="chip cyan">In corso</span></div><div class="card span6" style="padding:15px"><div class="muted xs">Scadenze</div><div class="statnum">2</div><span class="chip coral">Da verificare</span></div></div>' + '<div class="span7">' + sectionHead("Il tuo piano", "Le task puoi completarle qui") + '<div class="card">' + taskRows() + '<button class="button small" style="margin-top:14px" data-action="quick">+ Aggiungi task</button></div></div>' + '<div class="span5">' + sectionHead("Punti da controllare", "Segnali, non notifiche inutili") + '<div class="card">' + '<div class="list-item"><span class="chip coral">!</span><div class="body"><b>Task rimasta da ieri</b><div class="sub">Riprogramma senza perdere il contesto</div></div><button class="button small" data-action="agenda">Apri</button></div>' + '<div class="list-item"><span class="chip violet">◷</span><div class="body"><b>Allenamento in programma</b><div class="sub">Scheda e sessione Focus</div></div><button class="button small" data-action="fitos">Vai</button></div>' + '<div class="list-item"><span class="chip cyan">↧</span><div class="body"><b id="today-inbox-count">' + inbox.length + ' elementi da smistare</b><div class="sub">Cattura ora, organizza più tardi</div></div><button class="button small" data-action="inbox">Inbox</button></div></div></div>' + '<div class="span4">' + sectionHead("Routine", "Progressi, senza pressioni") + '<div class="card">' + '<div class="list-item"><span class="chip cyan">✓</span><div class="body">Movimento<div class="sub">Completato oggi</div></div></div><div class="list-item"><span class="chip violet">◷</span><div class="body">Lettura<div class="sub">Da completare</div></div></div><div class="list-item"><span class="chip blue">♥</span><div class="body">Benessere<div class="sub">In corso</div></div></div><button class="button small" style="margin-top:12px" data-action="review">Vedi trend</button></div></div>' + '<div class="span4">' + sectionHead("FitOS oggi", "Un passo alla volta") + '<div class="card"><div class="eyebrow">PROSSIMA SESSIONE</div><h2 style="margin:8px 0">Upper Body A</h2><p class="small muted" style="line-height:1.6">6 esercizi · 45 minuti previsti</p><div class="progress" style="--pct:33%;--shade:var(--cyan)"><i></i></div><div class="action-row" style="margin-top:21px"><button class="button primary small" data-action="fitos">Apri FitOS</button></div></div></div>' + '<div class="span4">' + sectionHead("Patrimonio", "Contesto, non distrazione") + '<div class="card"><div class="eyebrow">STIMA DEMO</div><div class="statnum" style="font-size:30px">€ 24.680</div><div class="small muted">Valore illustrativo</div><div style="margin-top:19px"><button class="button small" data-action="finance">Apri finanze</button></div></div></div>' + '</div>';
}
function viewToday() {
  let html = viewTodayBase();
  html = html.replace('<div class="grid c12">', '<div class="dashboard-tools"><span class="small muted">Priorità e task restano sempre visibili; i widget sono sotto il tuo controllo.</span><div><button class="button small" data-ux="widget-config">⚙ Personalizza widget</button> <button class="button small" data-ux="natural-open">✧ Scrivi come parli</button></div></div><div class="grid c12">');
  for (const [label, key] of [["Routine", "habits"], ["FitOS oggi", "fitos"], ["Patrimonio", "finance"]]) {
    const needle = '<div class="span4"><div class="section-head"><h2>' + label;
    const replacement = '<div class="span4" data-widget="' + key + '"' + (state.widgets[key] ? '' : ' hidden') + '><div class="section-head"><h2>' + label;
    html = html.replace(needle, replacement);
  }
  return html;
}
function openWidgetConfig() {
  dialog("Personalizza la dashboard", '<div class="eyebrow">DASHBOARD ADATTIVA</div><p class="small muted" style="line-height:1.75">Le azioni principali rimangono nello stesso posto. Puoi scegliere quali widget secondari vedere, senza riordinamenti casuali.</p>' + [["habits", "Routine e abitudini"], ["fitos", "FitOS oggi"], ["finance", "Patrimonio"]].map(([key, label]) => '<label class="list-item" style="cursor:pointer"><input type="checkbox" data-widget-toggle="' + key + '" ' + (state.widgets[key] ? 'checked' : '') + '><span class="body">' + label + '</span></label>').join("") + '<div class="modal-actions"><button class="button primary" data-close>Fatto</button></div><p class="xs muted">Solo demo: le preferenze non sono salvate dopo il refresh.</p>');
}
export { viewTodayBase, viewToday, openWidgetConfig };
