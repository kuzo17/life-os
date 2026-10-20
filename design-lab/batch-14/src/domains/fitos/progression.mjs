import { safe } from "../../shared/patterns.mjs";
import { fitosExercises } from "./catalog.mjs";
import { historySessions, estimateE1rm, historySetRir } from "./history.mjs";
import { state } from "../../app/ui-state.mjs";
const progressionRules = {
  conservative: {
    name: "Conservativa",
    step: 1.25,
    raiseAt: 3,
    reduceAt: 0,
    detail: "Incremento piccolo solo con almeno 3 RIR medi."
  },
  standard: {
    name: "Standard",
    step: 2.5,
    raiseAt: 2,
    reduceAt: .5,
    detail: "Incremento moderato quando restano almeno 2 RIR medi."
  },
  aggressive: {
    name: "Decisa",
    step: 5,
    raiseAt: 1.5,
    reduceAt: .5,
    detail: "Anteprima più rapida: richiede controllo e non è una prescrizione."
  }
};
function progressionSnapshot(id) {
  const sessions = historySessions().filter(s => s.exercises.some(x => x.id === id)),
    session = sessions[0],
    row = session?.exercises.find(x => x.id === id);
  if (!row) return null;
  const rirValues = row.sets.map(historySetRir).filter(Number.isFinite),
    avgRir = rirValues.length ? Math.round(rirValues.reduce((n, v) => n + v, 0) / rirValues.length * 10) / 10 : null;
  return {
    session,
    row,
    avgRir,
    load: Math.max(...row.sets.map(s => s[0])),
    e1rm: Math.max(...row.sets.map(s => estimateE1rm(s[0], s[1])))
  };
}
function roundedLoad(value, step = 1.25) {
  return Math.round(value / step) * step;
}
function progressionDecision(snapshot, rule) {
  if (state.progressionDeload) return {
    label: "−10% demo",
    next: roundedLoad(snapshot.load * .9, 1.25),
    reason: "Deload manuale attivo; nessuna modifica viene applicata."
  };
  if (snapshot.avgRir === null) return {
    label: "Mantieni",
    next: snapshot.load,
    reason: "RIR assente: la demo evita di dedurre lo sforzo dai soli carichi."
  };
  if (snapshot.avgRir >= rule.raiseAt) return {
    label: "+ " + rule.step + " kg",
    next: roundedLoad(snapshot.load + rule.step, 1.25),
    reason: "RIR medio " + snapshot.avgRir + " ≥ soglia " + rule.raiseAt + "."
  };
  if (snapshot.avgRir <= rule.reduceAt) return {
    label: "Rivedi",
    next: roundedLoad(Math.max(0, snapshot.load - rule.step), 1.25),
    reason: "RIR medio " + snapshot.avgRir + " indica margine ridotto nella simulazione."
  };
  return {
    label: "Ripeti",
    next: snapshot.load,
    reason: "RIR medio " + snapshot.avgRir + " dentro la fascia di mantenimento."
  };
}
function fitosProgressionView() {
  const rule = progressionRules[state.progressionRule] || progressionRules.standard,
    rows = fitosExercises.map(x => ({
      x,
      s: progressionSnapshot(x.id)
    })).filter(v => v.s);
  return '<div class="history-hero"><div class="history-copy"><div class="eyebrow">LAB REGOLE · NESSUNA AUTOMAZIONE</div><h2>Decidi la progressione, non subirla.</h2><p class="small muted" style="line-height:1.75">Confronta scenari basati su carico e RIR sintetici. Le proposte non modificano schede, non sostituiscono un coach e spariscono al reload.</p></div><div class="history-kpis"><div class="history-kpi"><span class="xs muted">Regola</span><strong>' + safe(rule.name) + '</strong></div><div class="history-kpi"><span class="xs muted">Incremento</span><strong>' + rule.step + ' kg</strong></div><div class="history-kpi"><span class="xs muted">Deload</span><strong>' + (state.progressionDeload ? 'Attivo' : 'Off') + '</strong></div><div class="history-kpi"><span class="xs muted">Scritture</span><strong>0</strong></div></div></div><div class="progression-shell"><aside class="progression-rules"><div class="eyebrow">1 · SCEGLI SCENARIO</div>' + Object.entries(progressionRules).map(([id, r]) => '<button class="rule-card ' + (state.progressionRule === id ? 'active' : '') + '" data-progression-rule="' + id + '" aria-pressed="' + (state.progressionRule === id) + '"><strong>' + safe(r.name) + ' · ' + r.step + ' kg</strong><span>' + safe(r.detail) + '</span></button>').join('') + '<div class="deload-box"><label><span><b>Anteprima deload</b><span class="xs muted" style="display:block;margin-top:5px">Riduzione manuale del 10% su tutti i carichi.</span></span><input type="checkbox" data-progression-deload ' + (state.progressionDeload ? 'checked' : '') + ' aria-label="Attiva anteprima deload"></label></div><div class="effort-legend"><div><b>RIR 0</b><span>nessuna riserva</span></div><div><b>RIR 1</b><span>una ripetizione</span></div><div><b>RIR 2</b><span>due ripetizioni</span></div><div><b>RIR 3+</b><span>margine ampio</span></div></div></aside><section class="progression-preview"><div class="eyebrow">2 · ANTEPRIMA NON APPLICATA</div>' + rows.map(({
    x,
    s
  }) => {
    const d = progressionDecision(s, rule);
    return '<div class="progression-row"><div><h3>' + safe(x.name) + '</h3><p class="xs muted">Ultimo carico ' + s.load + ' kg · e1RM ' + s.e1rm + ' kg · RIR medio ' + (s.avgRir ?? 'n/d') + '</p><p class="xs muted" style="margin-top:6px">' + safe(d.reason) + '</p></div><div class="progression-decision"><strong>' + safe(d.label) + '</strong><span class="pill">' + d.next + ' kg</span></div></div>';
  }).join('') + '<div class="history-source-note small"><b>Gate V2:</b> applicare una proposta dovrà essere un comando esplicito, rivedibile e annullabile. In Batch 11 non esiste alcun pulsante di applicazione.</div></section></div>';
}
export { progressionRules, progressionSnapshot, roundedLoad, progressionDecision, fitosProgressionView };
