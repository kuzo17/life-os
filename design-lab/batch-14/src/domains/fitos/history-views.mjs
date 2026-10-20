import { safe, sectionHead } from "../../shared/patterns.mjs";
import { historySessions, historySessionVolume, historySessionSets, estimateE1rm, historySetRir, historyExerciseE1rm, historyDate, historySessionById } from "./history.mjs";
import { exerciseById } from './catalog.mjs';
import { sessionFmt } from "./session.mjs";
import { state } from "../../app/ui-state.mjs";
function fitosHistoryDetail(session) {
  const volume = historySessionVolume(session),
    sets = historySessionSets(session),
    best = Math.max(0, ...session.exercises.flatMap(x => x.sets.map(set => estimateE1rm(set[0], set[1]))));
  return '<div class="workspace-breadcrumb"><button class="crumb-link" data-history-back>Storico allenamenti</button><span>›</span><b>' + safe(session.name) + '</b></div><div class="history-list"><div class="history-detail-head"><div><div class="eyebrow">' + (session.source === "current" ? 'SESSIONE CORRENTE · TEMPORANEA' : 'SESSIONE SINTETICA · DEMO') + '</div><h2 style="margin-top:6px">' + safe(session.name) + '</h2><p class="small muted" style="margin-top:8px">' + historyDate(session.date) + ' · ' + sessionFmt(session.duration) + '</p></div><button class="button" data-history-back>← Torna allo storico</button></div><div class="history-detail-grid"><div class="history-kpi"><span class="xs muted">Serie</span><strong>' + sets + '</strong></div><div class="history-kpi"><span class="xs muted">Volume</span><strong>' + Math.round(volume) + ' kg</strong></div><div class="history-kpi"><span class="xs muted">Miglior e1RM</span><strong>' + best + ' kg</strong></div></div>' + session.exercises.map(row => {
    const x = exerciseById(row.id),
      bestSet = Math.max(...row.sets.map(set => estimateE1rm(set[0], set[1])));
    return '<div class="history-detail-exercise"><div class="history-detail-exercise-head"><div><div class="eyebrow">' + safe(x?.group || "ESERCIZIO") + '</div><h3>' + safe(x?.name || row.id) + '</h3></div><span class="pill">e1RM ' + bestSet + ' kg</span></div><div class="history-set-row muted"><span>Serie</span><span>Carico</span><span>Rip.</span><span>RIR</span><span>e1RM</span></div>' + row.sets.map((set, i) => {
      const rir = historySetRir(set);
      return '<div class="history-set-row"><b>#' + (i + 1) + '</b><span>' + set[0] + ' kg</span><span>' + set[1] + '</span><span>' + (rir === null ? '—' : rir + ' · RPE ' + (10 - rir)) + '</span><span>' + estimateE1rm(set[0], set[1]) + ' kg</span>' + (set[3] ? '<span class="history-set-note">“' + safe(set[3]) + '”</span>' : '') + '</div>';
    }).join('') + '</div>';
  }).join('') + '<div class="history-source-note small"><b>Trasparenza dati:</b> ' + (session.source === "current" ? 'questa riga deriva soltanto dalla sessione in memoria e scompare al reload.' : 'questi valori sono sintetici, costruiti unicamente per testare la UX dello storico.') + ' RIR e note sono autovalutazioni; l’e1RM è una stima illustrativa, non un test massimale.</div></div>';
}
function fitosHistoryView() {
  const selected = state.fitosHistoryExercise,
    all = historySessions(),
    session = state.fitosHistorySession ? historySessionById(state.fitosHistorySession) : null;
  if (session) return fitosHistoryDetail(session);
  const filtered = selected === "all" ? all : all.filter(s => s.exercises.some(x => x.id === selected));
  const totalVolume = filtered.reduce((n, s) => n + historySessionVolume(s), 0),
    totalSets = filtered.reduce((n, s) => n + historySessionSets(s), 0);
  const usedIds = [...new Set(all.flatMap(s => s.exercises.map(x => x.id)))],
    trend = filtered.slice().reverse();
  const values = trend.map(s => selected === "all" ? historySessionVolume(s) : historyExerciseE1rm(s, selected)),
    max = Math.max(1, ...values);
  const chosen = selected === "all" ? null : exerciseById(selected);
  const records = usedIds.map(id => {
    const x = exerciseById(id),
      best = Math.max(...all.map(s => historyExerciseE1rm(s, id)));
    return {
      id,
      name: x?.name || id,
      best
    };
  }).sort((a, b) => b.best - a.best).slice(0, 4);
  return '<div class="history-hero"><div class="history-copy"><div class="eyebrow">STORICO FITOS · DATI SINTETICI</div><h2>Progressione leggibile, senza promesse false.</h2><p class="small muted" style="line-height:1.75">Sessioni, serie e carichi diventano navigabili. Volume ed e1RM sono calcolati sui valori demo qui sotto; nessun dato personale, backup o sincronizzazione è collegato.</p></div><div class="history-kpis"><div class="history-kpi"><span class="xs muted">Sessioni</span><strong>' + filtered.length + '</strong></div><div class="history-kpi"><span class="xs muted">Serie</span><strong>' + totalSets + '</strong></div><div class="history-kpi"><span class="xs muted">Volume</span><strong>' + Math.round(totalVolume / 100) / 10 + ' t</strong></div><div class="history-kpi"><span class="xs muted">Origine</span><strong>Demo</strong></div></div></div>' + sectionHead("Filtra progressione", chosen ? chosen.name : "Tutte le sessioni") + '<div class="history-filter"><button class="tab ' + (selected === "all" ? 'active' : '') + '" data-history-exercise="all">Tutto</button>' + usedIds.map(id => {
    const x = exerciseById(id);
    return '<button class="tab ' + (selected === id ? 'active' : '') + '" data-history-exercise="' + id + '">' + safe(x?.name || id) + '</button>';
  }).join('') + '</div><div class="history-grid"><div class="history-list"><div class="eyebrow">SESSIONI · APRI IL REGISTRO</div>' + (filtered.length ? filtered.map(s => '<button class="history-session" data-history-session="' + s.id + '"><span class="history-session-date">' + historyDate(s.date) + '</span><span><h3>' + safe(s.name) + (s.source === "current" ? ' · corrente' : '') + '</h3><span class="history-session-metrics"><span class="pill">' + historySessionSets(s) + ' serie</span><span class="pill">' + Math.round(historySessionVolume(s)) + ' kg</span>' + (selected !== "all" ? '<span class="pill">e1RM ' + historyExerciseE1rm(s, selected) + ' kg</span>' : '') + '</span></span><span class="history-session-arrow">↗</span></button>').join('') : '<div class="history-empty">Nessuna sessione demo per questo esercizio.</div>') + '</div><aside class="history-progress"><div class="eyebrow">' + (selected === "all" ? 'VOLUME PER SESSIONE' : 'e1RM STIMATO · ' + safe(chosen?.name || "")) + '</div><div class="history-chart" role="img" aria-label="' + (selected === "all" ? 'Andamento del volume per sessione demo' : 'Andamento e1RM stimato per ' + safe(chosen?.name || "esercizio")) + '">' + trend.map((s, i) => '<div class="history-bar" style="--h:' + Math.max(16, Math.round(values[i] / max * 100)) + '%"><span>' + Math.round(values[i]) + (selected === "all" ? ' kg' : '') + '</span><i>' + historyDate(s.date) + '</i></div>').join('') + '</div><p class="xs muted" style="line-height:1.6;margin:28px 0 17px">' + (selected === "all" ? 'Il volume somma carico × ripetizioni di ogni serie. Confronta solo sessioni simili.' : 'Formula Epley: carico × (1 + ripetizioni / 30). È un indicatore stimato e non una prescrizione.') + '</p><div class="eyebrow">MIGLIORI STIME DEMO</div>' + records.map((r, i) => '<div class="history-pr"><span><strong>' + safe(r.name) + '</strong><span class="xs muted">Record nel dataset sintetico</span></span><span class="pill">' + r.best + ' kg' + (i === 0 ? ' · TOP' : '') + '</span></div>').join('') + '</aside></div><div class="history-source-note small"><b>Confine della demo:</b> il dataset storico è sintetico e resta immutabile. Solo una sessione completata durante questa visita può comparire temporaneamente in cima; un reload la rimuove.</div>';
}
export { fitosHistoryDetail, fitosHistoryView };
