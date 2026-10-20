import { $ } from "../../shared/dom.mjs";
import { notify } from "../../shared/feedback.mjs";
import { fitosDays, exerciseById } from "./catalog.mjs";
import { render } from "../../app/render-request.mjs";
let sessionTick = null;
const workoutSession = {
  id: "session-demo-01",
  templateId: "upper-a",
  dayIndex: 0,
  status: "ready",
  exerciseIndex: 0,
  phase: "work",
  logs: {},
  skipped: {},
  draft: {
    kg: 50,
    reps: 8,
    rir: 2,
    note: ""
  },
  rest: {
    total: 0,
    remaining: 0,
    deadline: null,
    paused: false
  },
  startedAt: null,
  endedAt: null,
  elapsed: 0,
  lastSet: null,
  templateUpdated: false
};
function sessionExercises() {
  return fitosDays[workoutSession.dayIndex].items.map(exerciseById).filter(Boolean);
}
function sessionExercise() {
  return sessionExercises()[workoutSession.exerciseIndex] || sessionExercises()[0];
}
function sessionFmt(seconds) {
  seconds = Math.max(0, Math.floor(seconds || 0));
  return Math.floor(seconds / 60) + ":" + String(seconds % 60).padStart(2, "0");
}
function sessionElapsed() {
  if (workoutSession.status === "finished") return workoutSession.elapsed;
  if (!workoutSession.startedAt) return 0;
  return Math.floor((Date.now() - workoutSession.startedAt) / 1000);
}
function sessionCompletedSets() {
  return Object.values(workoutSession.logs).reduce((n, rows) => n + rows.length, 0);
}
function sessionTotalSets() {
  return sessionExercises().reduce((n, x) => n + x.sets, 0);
}
function sessionProgress() {
  return Math.round(sessionCompletedSets() / sessionTotalSets() * 100) || 0;
}
function sessionLoggedSets() {
  return Object.values(workoutSession.logs).flat();
}
function sessionAverageRir() {
  const rows = sessionLoggedSets();
  return rows.length ? Math.round(rows.reduce((n, s) => n + (s.rir ?? 2), 0) / rows.length * 10) / 10 : null;
}
function stopSessionTick() {
  if (sessionTick) clearInterval(sessionTick);
  sessionTick = null;
}
function ensureSessionTick() {
  if (sessionTick) return;
  sessionTick = setInterval(() => {
    if (workoutSession.status !== "running") {
      stopSessionTick();
      return;
    }
    if (workoutSession.phase === "rest" && !workoutSession.rest.paused) {
      workoutSession.rest.remaining = Math.max(0, Math.ceil((workoutSession.rest.deadline - Date.now()) / 1000));
      if (workoutSession.rest.remaining <= 0) {
        completeSessionRest(false);
        return;
      }
    }
    const elapsed = $("#session-elapsed");
    if (elapsed) elapsed.textContent = sessionFmt(sessionElapsed());
    const display = $("#session-rest-display");
    if (display) display.textContent = sessionFmt(workoutSession.rest.remaining);
    const ring = $("#session-rest-ring");
    if (ring && workoutSession.rest.total) ring.style.setProperty("--pct", Math.max(0, workoutSession.rest.remaining / workoutSession.rest.total * 100) + "%");
  }, 1000);
}
function resetWorkoutSession(dayIndex = 0) {
  stopSessionTick();
  workoutSession.dayIndex = dayIndex;
  const first = sessionExercises()[0];
  Object.assign(workoutSession, {
    dayIndex,
    status: "ready",
    exerciseIndex: 0,
    phase: "work",
    logs: {},
    skipped: {},
    draft: {
      kg: first?.kg || 0,
      reps: first?.reps || 0,
      rir: 2,
      note: ""
    },
    rest: {
      total: 0,
      remaining: 0,
      deadline: null,
      paused: false
    },
    startedAt: null,
    endedAt: null,
    elapsed: 0,
    lastSet: null,
    templateUpdated: false
  });
}
function startWorkoutSession() {
  if (workoutSession.status !== "ready") return;
  workoutSession.status = "running";
  workoutSession.startedAt = Date.now();
  const x = sessionExercise();
  workoutSession.draft = {
    kg: x.kg,
    reps: x.reps,
    rir: 2,
    note: ""
  };
  ensureSessionTick();
  render();
}
function selectSessionExercise(next) {
  const list = sessionExercises(),
    x = list[next];
  if (!x || workoutSession.status !== "running" || workoutSession.phase !== "work" || workoutSession.skipped[x.id] || (workoutSession.logs[x.id] || []).length >= x.sets) return;
  workoutSession.exerciseIndex = next;
  workoutSession.draft = {
    kg: x.kg,
    reps: x.reps,
    rir: 2,
    note: ""
  };
  render();
}
function beginSessionRest(seconds) {
  workoutSession.phase = "rest";
  workoutSession.rest = {
    total: seconds,
    remaining: seconds,
    deadline: Date.now() + seconds * 1000,
    paused: false
  };
  ensureSessionTick();
  render();
}
function completeSessionRest(show = true) {
  workoutSession.phase = "work";
  workoutSession.rest = {
    total: 0,
    remaining: 0,
    deadline: null,
    paused: false
  };
  if (show) notify("Recupero terminato · prossima serie pronta");
  render();
}
function advanceSessionExercise() {
  const list = sessionExercises();
  let next = workoutSession.exerciseIndex + 1;
  while (next < list.length && (workoutSession.skipped[list[next].id] || (workoutSession.logs[list[next].id] || []).length >= list[next].sets)) next++;
  if (next >= list.length) next = list.findIndex(x => !workoutSession.skipped[x.id] && (workoutSession.logs[x.id] || []).length < x.sets);
  if (next < 0) {
    finishWorkoutSession();
    return;
  }
  workoutSession.exerciseIndex = next;
  workoutSession.phase = "work";
  const x = list[next];
  workoutSession.draft = {
    kg: x.kg,
    reps: x.reps,
    rir: 2,
    note: ""
  };
  render();
}
function logSessionSet() {
  if (workoutSession.status !== "running" || workoutSession.phase !== "work") return;
  const x = sessionExercise(),
    rows = workoutSession.logs[x.id] || (workoutSession.logs[x.id] = []);
  const entry = {
    index: rows.length + 1,
    kg: workoutSession.draft.kg,
    reps: workoutSession.draft.reps,
    rir: workoutSession.draft.rir,
    note: workoutSession.draft.note.trim(),
    at: new Date().toISOString()
  };
  rows.push(entry);
  workoutSession.lastSet = {
    exerciseId: x.id,
    exerciseIndex: workoutSession.exerciseIndex,
    entry
  };
  workoutSession.draft.note = "";
  if (rows.length >= x.sets) advanceSessionExercise();else beginSessionRest(x.rest);
}
function skipSessionExercise() {
  if (workoutSession.status !== "running" || workoutSession.phase !== "work") return;
  workoutSession.skipped[sessionExercise().id] = true;
  workoutSession.lastSet = null;
  advanceSessionExercise();
}
function undoSessionSet() {
  const u = workoutSession.lastSet;
  if (!u) return;
  const rows = workoutSession.logs[u.exerciseId] || [];
  if (!rows.length) return;
  rows.pop();
  workoutSession.exerciseIndex = u.exerciseIndex;
  workoutSession.phase = "work";
  workoutSession.draft = {
    kg: u.entry.kg,
    reps: u.entry.reps,
    rir: u.entry.rir ?? 2,
    note: u.entry.note || ""
  };
  workoutSession.rest = {
    total: 0,
    remaining: 0,
    deadline: null,
    paused: false
  };
  workoutSession.lastSet = null;
  render();
  notify("Ultima serie annullata");
}
function pauseSessionRest() {
  if (workoutSession.phase !== "rest") return;
  if (workoutSession.rest.paused) {
    workoutSession.rest.paused = false;
    workoutSession.rest.deadline = Date.now() + workoutSession.rest.remaining * 1000;
  } else {
    workoutSession.rest.remaining = Math.max(0, Math.ceil((workoutSession.rest.deadline - Date.now()) / 1000));
    workoutSession.rest.paused = true;
    workoutSession.rest.deadline = null;
  }
  render();
}
function adjustSessionRest(delta) {
  if (workoutSession.phase !== "rest") return;
  workoutSession.rest.remaining = Math.max(0, workoutSession.rest.remaining + delta);
  workoutSession.rest.total = Math.max(workoutSession.rest.total, workoutSession.rest.remaining);
  if (!workoutSession.rest.paused) workoutSession.rest.deadline = Date.now() + workoutSession.rest.remaining * 1000;
  if (workoutSession.rest.remaining === 0) completeSessionRest();else render();
}
function finishWorkoutSession() {
  workoutSession.elapsed = sessionElapsed();
  workoutSession.endedAt = new Date().toISOString();
  workoutSession.status = "finished";
  workoutSession.phase = "finished";
  stopSessionTick();
  render();
}
export { sessionTick, workoutSession, sessionExercises, sessionExercise, sessionFmt, sessionElapsed, sessionCompletedSets, sessionTotalSets, sessionProgress, sessionLoggedSets, sessionAverageRir, stopSessionTick, ensureSessionTick, resetWorkoutSession, startWorkoutSession, selectSessionExercise, beginSessionRest, completeSessionRest, advanceSessionExercise, logSessionSet, skipSessionExercise, undoSessionSet, pauseSessionRest, adjustSessionRest, finishWorkoutSession };
