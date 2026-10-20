import { notify } from "../../shared/feedback.mjs";
import { workoutSession, resetWorkoutSession, startWorkoutSession, selectSessionExercise, completeSessionRest, logSessionSet, skipSessionExercise, undoSessionSet, pauseSessionRest, adjustSessionRest } from "./session.mjs";
import { openExerciseSheet } from "./training-views.mjs";
import { render } from "../../app/render-request.mjs";
import { navigate } from "../../app/router.mjs";
import { state } from "../../app/ui-state.mjs";
function handleFitosClick(e, b) {
  if (b.dataset.fitosView) {
    navigate(() => {
      state.screen = "fitos";
      state.fitosTab = "train";
      state.fitosWorkoutView = b.dataset.fitosView;
      state.fitosTrainingDay = null;
      if (b.dataset.fitosView !== "history") state.fitosHistorySession = null;
    });
    return true;
  }
  if (b.dataset.fitosDay !== undefined) {
    navigate(() => {
      state.screen = "fitos";
      state.fitosTab = "train";
      state.fitosTrainingDay = Number(b.dataset.fitosDay);
    }, {
      scroll: true
    });
    return true;
  }
  if (b.hasAttribute("data-fitos-week-back")) {
    navigate(() => {
      state.fitosTab = "train";
      state.fitosTrainingDay = null;
      state.fitosWorkoutView = "week";
    });
    return true;
  }
  if (b.dataset.fitosExercise) {
    openExerciseSheet(b.dataset.fitosExercise);
    return true;
  }
  if (b.dataset.historyExercise) {
    state.fitosHistoryExercise = b.dataset.historyExercise;
    state.fitosHistorySession = null;
    render();
    return true;
  }
  if (b.dataset.historySession) {
    navigate(() => {
      state.screen = "fitos";
      state.fitosTab = "train";
      state.fitosWorkoutView = "history";
      state.fitosHistorySession = b.dataset.historySession;
    }, {
      scroll: true
    });
    return true;
  }
  if (b.hasAttribute("data-history-back")) {
    navigate(() => {
      state.screen = "fitos";
      state.fitosTab = "train";
      state.fitosWorkoutView = "history";
      state.fitosHistorySession = null;
    }, {
      scroll: true
    });
    return true;
  }
  if (b.dataset.progressionRule) {
    state.progressionRule = b.dataset.progressionRule;
    render();
    return true;
  }
  if (b.dataset.sessionSelect !== undefined) {
    selectSessionExercise(Number(b.dataset.sessionSelect));
    return true;
  }
  if (b.dataset.sessionAction) {
    const a = b.dataset.sessionAction;
    if (a === "start") startWorkoutSession();else if (a === "complete") logSessionSet();else if (a === "skip") skipSessionExercise();else if (a === "undo") undoSessionSet();else if (a === "pause") pauseSessionRest();else if (a === "rest-minus") adjustSessionRest(-15);else if (a === "rest-plus") adjustSessionRest(15);else if (a === "rest-skip") completeSessionRest();else if (a === "kg-minus") {
      workoutSession.draft.kg = Math.max(0, workoutSession.draft.kg - 2.5);
      render();
    } else if (a === "kg-plus") {
      workoutSession.draft.kg += 2.5;
      render();
    } else if (a === "reps-minus") {
      workoutSession.draft.reps = Math.max(0, workoutSession.draft.reps - 1);
      render();
    } else if (a === "reps-plus") {
      workoutSession.draft.reps += 1;
      render();
    } else if (a === "rir-minus") {
      workoutSession.draft.rir = Math.max(0, workoutSession.draft.rir - 1);
      render();
    } else if (a === "rir-plus") {
      workoutSession.draft.rir = Math.min(5, workoutSession.draft.rir + 1);
      render();
    } else if (a === "template") {
      workoutSession.templateUpdated = true;
      render();
      notify("Aggiornamento template simulato · nessun dato persistito");
    } else if (a === "reset") {
      const day = workoutSession.dayIndex;
      resetWorkoutSession(day);
      render();
    } else if (a === "exit") {
      navigate(() => {
        state.screen = "fitos";
        state.fitosTab = "train";
        state.fitosWorkoutView = "week";
        state.fitosTrainingDay = workoutSession.dayIndex;
      }, {
        scroll: true
      });
    }
    return true;
  }
  if (b.dataset.fitos) {
    navigate(() => {
      state.screen = "fitos";
      state.fitosTab = b.dataset.fitos;
      state.fitosTrainingDay = null;
    });
    return true;
  }
  return false;
}
export { handleFitosClick };
