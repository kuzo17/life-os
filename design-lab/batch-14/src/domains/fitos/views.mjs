import { viewFitosBase } from "./overview.mjs";
import { workoutSession } from "./session.mjs";
import { viewFitosSession } from "./session-views.mjs";
import { fitosTrainingHeader, fitosDayView, fitosWeekView, fitosCatalogView } from "./training-views.mjs";
import { fitosHistoryView } from "./history-views.mjs";
import { fitosProgressionView } from "./progression.mjs";
import { state } from "../../app/ui-state.mjs";
function viewFitos() {
  if (state.fitosTab !== "train") return viewFitosBase();
  if (state.fitosWorkoutView === "session") return viewFitosSession();
  let content;
  if (state.fitosTrainingDay !== null) content = fitosDayView(state.fitosTrainingDay);else content = state.fitosWorkoutView === "catalog" ? fitosCatalogView() : state.fitosWorkoutView === "history" ? fitosHistoryView() : state.fitosWorkoutView === "progression" ? fitosProgressionView() : fitosWeekView();
  return fitosTrainingHeader() + '<div class="fitos-level-nav">' + [["week", "Settimana"], ["catalog", "Catalogo"], ["history", "Storico"], ["progression", "Progressione"], ...(workoutSession.status !== "ready" ? [["session", "Sessione " + (workoutSession.status === "finished" ? "terminata" : "in corso")]] : [])].map(([id, label]) => '<button class="tab ' + (state.fitosWorkoutView === id ? "active" : "") + '" data-fitos-view="' + id + '">' + label + '</button>').join("") + '</div>' + content;
}
export { viewFitos };
