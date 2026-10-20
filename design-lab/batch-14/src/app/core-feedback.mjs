import { $ } from "../shared/dom.mjs";
import { notifyUndo, notify } from "../shared/feedback.mjs";
import { render } from "./render-request.mjs";
import { operationalCore } from "../domains/commands/runtime.mjs";
function syncCoreChrome() {
  const b = $("#core-undo");
  if (!b) return;
  const label = operationalCore.pendingUndoLabel();
  b.hidden = !label;
  b.title = label ? "Annulla: " + label : "Nessuna operazione da annullare";
}
function finishCoreAction(result, message) {
  if (!result?.ok) {
    notify(result?.error || "Operazione non riuscita");
    return false;
  }
  render();
  notifyUndo(message || result.label, () => {
    const undone = operationalCore.undo();
    render();
    notify(undone.ok ? "Operazione annullata · Demo" : undone.error);
  });
  return true;
}
export { syncCoreChrome, finishCoreAction };
