import { $ } from "../../shared/dom.mjs";
import { safe, sectionHead, headline } from "../../shared/patterns.mjs";
import { dialog } from "../../shared/feedback.mjs";
import { fitosDays, fitosExercises } from "./catalog.mjs";
import { exerciseById } from "./catalog.mjs";
import { workoutSession } from "./session.mjs";
import { state } from "../../app/ui-state.mjs";
function fitosTrainingHeader() {
  const tabs = [["today", "Oggi"], ["train", "Allenamento"], ["food", "Alimentazione"], ["stretch", "Stretching"], ["weight", "Peso"]];
  return headline("FitOS", "Schede complete, catalogo esercizi, allenamenti e storico: naviga nel programma senza perdere dettagli.", "SALUTE & PERFORMANCE") + '<div class="screen-tabs">' + tabs.map(([id, label]) => '<button class="tab ' + (state.fitosTab === id ? "active" : "") + '" data-fitos="' + id + '">' + label + '</button>').join("") + '</div>';
}
function fitosDayView(idx) {
  const day = fitosDays[idx];
  if (!day) return "";
  const exercises = day.items.map(id => exerciseById(id)).filter(Boolean);
  return '<div class="workspace-breadcrumb"><button class="crumb-link" data-fitos-week-back>Settimana allenamento</button><span>›</span><b>' + day.day + '</b></div>' + '<div class="fitos-day-hero"><div class="eyebrow">SCHEDA DEL ' + safe(day.day.toUpperCase()) + ' · DATI DEMO</div><h2>' + safe(day.name) + '</h2><p>Serie, ripetizioni, carichi e recuperi per esercizio. Le note tecniche si aprono solo cliccando sull’esercizio finale.</p>' + (exercises.length ? '<button class="button primary ' + (workoutSession.status !== "ready" && workoutSession.dayIndex === idx ? 'focus-resume' : '') + '" data-action="fitos-focus-start" data-session-day="' + idx + '">' + (workoutSession.status !== "ready" && workoutSession.dayIndex === idx ? '↗ Riprendi sessione' : '▶ Avvia questa scheda') + '</button>' : '<span class="pill">Recupero / mobilità</span>') + '</div>' + sectionHead("Programma completo", exercises.length + ' esercizi · valori dimostrativi') + '<div class="card">' + (exercises.length ? exercises.map((x, i) => '<button class="fitos-exercise-line" data-fitos-exercise="' + x.id + '"><span class="fitos-ex-num">' + (i + 1) + '</span><div><b>' + safe(x.name) + '</b><div class="small muted">' + x.sets + ' serie × ' + x.reps + ' ripetizioni · ' + x.kg + ' kg · recupero ' + x.rest + 's</div></div><span class="fitos-ex-link">Dettagli ↗</span></button>').join("") : '<div class="empty">Giornata senza scheda pesi in questa simulazione. La V2 manterrà anche stretching e recupero.</div>') + '</div>' + '<div class="hint-box" style="margin-top:15px">Il tasto Focus apre uno studio interattivo indipendente con programma fittizio “Upper Body A”. La V2 reale avvierà esattamente questa scheda e registrerà le serie effettive senza sovrascrivere il template.</div>';
}
function fitosWeekView() {
  const sessions = fitosDays.filter(x => x.status === "training").length;
  return '<div class="fitos-week-summary"><div><div class="eyebrow">SCHEDE SETTIMANALI</div><h2>Il tuo programma di allenamento</h2><p class="small muted">Sette giorni, schede e recuperi distinti. Qui navigazione prima, dettaglio solo in fondo.</p></div><div class="fitos-summary-tags"><span class="pill">' + sessions + ' allenamenti demo</span><span class="pill">8 esercizi catalogo</span></div></div>' + '<div class="fitos-week-cards">' + fitosDays.map((d, i) => '<button class="fitos-day-card" data-fitos-day="' + i + '"><div class="eyebrow">' + safe(d.day.toUpperCase()) + '</div><h3>' + safe(d.name) + '</h3><div class="fitos-day-meta">' + (d.items.length ? d.items.length + ' esercizi · scheda demo' : d.status === "stretch" ? 'Routine mobilità' : 'Nessuna scheda pesi') + '</div><span class="fitos-go">Apri scheda ↗</span></button>').join("") + '</div>';
}
function fitosCatalogView() {
  return sectionHead("Catalogo esercizi", "Ricerca, schede tecniche e cronologia — livelli separati") + '<div class="fitos-catalog-grid">' + fitosExercises.map(x => '<button class="card fitos-catalog-card" data-fitos-exercise="' + x.id + '"><div class="eyebrow">' + safe(x.group.toUpperCase()) + '</div><h3>' + safe(x.name) + '</h3><div class="small muted">' + x.sets + '×' + x.reps + ' · Recupero ' + x.rest + 's</div><span>Apri scheda tecnica ↗</span></button>').join("") + '</div>';
}
function openExerciseSheet(id) {
  const x = exerciseById(id);
  if (!x) return;
  dialog(safe(x.name), '<div class="eyebrow">CATALOGO ESERCIZI · DETTAGLIO FINALE</div>' + '<div class="fitos-ex-stats"><div><span>Serie</span><b>' + x.sets + '</b></div><div><span>Ripetizioni</span><b>' + x.reps + '</b></div><div><span>Carico demo</span><b>' + x.kg + ' kg</b></div><div><span>Recupero</span><b>' + x.rest + ' s</b></div></div>' + '<h3 style="margin:24px 0 12px">Indicazioni tecniche</h3><div class="hint-box">' + safe(x.cue) + '</div>' + '<h3 style="margin:24px 0 12px">Storico e progressione</h3><p class="small muted" style="line-height:1.8">Nella V2 reale: grafico carichi e ripetizioni, storico delle sessioni, note personali, riposo personalizzato e confronto tra set. Qui non sono importati dati dal backup.</p>' + '<div class="modal-actions"><button class="button primary" type="button" data-close>Chiudi</button></div>');
  $("#dlg").classList.add("sheet");
}
export { fitosTrainingHeader, fitosDayView, fitosWeekView, fitosCatalogView, openExerciseSheet };
