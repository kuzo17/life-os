import { $ } from "../../shared/dom.mjs";
import { taskLeaf } from "../tasks/views.mjs";
import { finishCoreAction } from "../../app/core-feedback.mjs";
import { openAgendaBulkMove } from "./views.mjs";
import { render } from "../../app/render-request.mjs";
import { navigate } from "../../app/router.mjs";
import { state, agendaSelection } from "../../app/ui-state.mjs";
import { operationalCore } from "../commands/runtime.mjs";
function handleAgendaClick(e, b) {
  if (b.dataset.agendaMode) {
    navigate(() => {
      state.agendaMode = b.dataset.agendaMode;
    });
    return true;
  }
  if (b.dataset.agendaSchedule) {
    taskLeaf(b.dataset.agendaSchedule);
    return true;
  }
  if (b.hasAttribute("data-agenda-bulk-toggle")) {
    state.agendaBulk = !state.agendaBulk;
    if (!state.agendaBulk) agendaSelection.clear();
    render();
    return true;
  }
  if (b.dataset.agendaSelect) {
    agendaSelection.has(b.dataset.agendaSelect) ? agendaSelection.delete(b.dataset.agendaSelect) : agendaSelection.add(b.dataset.agendaSelect);
    render();
    return true;
  }
  if (b.dataset.agendaBulkAction) {
    const action = b.dataset.agendaBulkAction;
    if (action === "cancel") {
      agendaSelection.clear();
      state.agendaBulk = false;
      render();
      return true;
    }
    if (action === "move") {
      openAgendaBulkMove();
      return true;
    }
    if (action === "duplicate") {
      const result = operationalCore.bulkDuplicateTasks([...agendaSelection]);
      if (result.ok) agendaSelection.clear();
      finishCoreAction(result, result.count + " task duplicate · Demo");
      return true;
    }
    if (action === "delete") {
      const result = operationalCore.bulkDeleteTasks([...agendaSelection]);
      if (result.ok) {
        agendaSelection.clear();
        state.agendaBulk = false;
      }
      finishCoreAction(result, (result.count || 0) + " task eliminate · Demo");
      return true;
    }
  }
  if (b.dataset.day) {
    navigate(() => {
      state.screen = "agenda";
      state.agendaDay = Number(b.dataset.day);
    });
    return true;
  }
  return false;
}
function handleAgendaSubmit(e) {
  if (e.target.id === "agenda-bulk-move-form") {
    e.preventDefault();
    const when = $("#agenda-bulk-day").value;
    const result = operationalCore.bulkMoveTasks([...agendaSelection], when);
    if (result.ok) {
      agendaSelection.clear();
      state.agendaBulk = false;
      $("#dlg").close();
    }
    finishCoreAction(result, (result.count || 0) + " task spostate · Demo");
    return true;
  }
}
export { handleAgendaClick, handleAgendaSubmit };
