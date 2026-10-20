import { $ } from "../shared/dom.mjs";
import { notify } from "../shared/feedback.mjs";
import { finishCoreAction } from "./core-feedback.mjs";
import { workoutSession, resetWorkoutSession } from "../domains/fitos/session.mjs";
import { txNew } from "../domains/finance/views.mjs";
import { render } from "./render-request.mjs";
import { navigate, goto } from "./router.mjs";
import { quick } from "../domains/capture/views.mjs";
import { focusDialog } from "../domains/focus/timer.mjs";
import { titles, state } from "./ui-state.mjs";
import { operationalCore } from "../domains/commands/runtime.mjs";
function handleActionClick(e, b) {
  if (b.dataset.action) {
    const a = b.dataset.action;
    if (a === "quick") quick("natural");else if (a === "focus-start") focusDialog();else if (a === "fitos-focus-start") {
      const day = Number.isInteger(Number(b.dataset.sessionDay)) ? Number(b.dataset.sessionDay) : state.fitosTrainingDay ?? 0;
      if (workoutSession.status === "ready" || workoutSession.status === "finished" || workoutSession.dayIndex !== day) resetWorkoutSession(day);
      navigate(() => {
        state.screen = "fitos";
        state.fitosTab = "train";
        state.fitosWorkoutView = "session";
        state.fitosTrainingDay = null;
      }, {
        scroll: true
      });
    } else if (a === "tx-new") txNew();else if (a === "project-layout") {
      state.projectView = state.projectView === "grid" ? "list" : "grid";
      render();
    } else if (a === "inbox-add") {
      const el = $("#inbox-entry");
      finishCoreAction(operationalCore.parkInbox(el?.value), "Salvato in Inbox · Demo");
    } else if (a === "inbox-classify") {
      const el = $("#inbox-entry");
      quick("natural", el?.value.trim() || "");
    } else if (a === "review-next") {
      state.reviewStep = (state.reviewStep + 1) % 3;
      render();
    } else if (a === "sale-demo") {
      notify("Anteprima vendita: nella V2 sceglierai prezzo e metodo di incasso.");
    } else if (a === "weight-add") {
      notify("In V2: inserimento peso rapido con data e storico.");
    } else if (a === "move-overdue" || a === "keep-overdue") {
      notify(a === "move-overdue" ? "Spostamento previsto; calendario non modificato." : "Task lasciata nella data originaria · Demo");
    } else if (titles[a]) goto(a);else notify("Vista giorno: in progettazione");
    return true;
  }
  return false;
}
export { handleActionClick };
