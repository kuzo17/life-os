import { fitosDays, fitosSyntheticHistory } from "./catalog.mjs";
import { workoutSession, sessionExercises } from "./session.mjs";
function historyCurrentSession() {
  if (workoutSession.status !== "finished") return null;
  return {
    id: "current-session",
    date: workoutSession.endedAt?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    name: fitosDays[workoutSession.dayIndex].name,
    duration: workoutSession.elapsed,
    source: "current",
    exercises: sessionExercises().map(x => ({
      id: x.id,
      sets: (workoutSession.logs[x.id] || []).map(s => [s.kg, s.reps, s.rir, s.note])
    })).filter(x => x.sets.length)
  };
}
function historySessions() {
  const current = historyCurrentSession();
  return current ? [current, ...fitosSyntheticHistory] : fitosSyntheticHistory.slice();
}
function historySessionVolume(s) {
  return s.exercises.reduce((total, x) => total + x.sets.reduce((n, set) => n + set[0] * set[1], 0), 0);
}
function historySessionSets(s) {
  return s.exercises.reduce((total, x) => total + x.sets.length, 0);
}
function estimateE1rm(kg, reps) {
  return Math.round(kg * (1 + reps / 30) * 10) / 10;
}
function historySetRir(set) {
  return Number.isFinite(set[2]) ? set[2] : null;
}
function historyExerciseE1rm(s, id) {
  const x = s.exercises.find(e => e.id === id);
  return x ? Math.max(...x.sets.map(set => estimateE1rm(set[0], set[1]))) : 0;
}
function historyDate(date) {
  return new Date(date + "T12:00:00").toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short"
  });
}
function historySessionById(id) {
  return historySessions().find(s => s.id === id);
}
export { historyCurrentSession, historySessions, historySessionVolume, historySessionSets, estimateE1rm, historySetRir, historyExerciseE1rm, historyDate, historySessionById };
