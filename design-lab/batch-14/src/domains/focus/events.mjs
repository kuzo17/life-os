import { updateFocus, stopTimer, toggleFocus } from "./timer.mjs";
import { state } from "../../app/ui-state.mjs";
function handleFocusClick(e, b) {
  if (b.dataset.focus) {
    if (b.dataset.focus === "reset") {
      stopTimer();
      state.focus = 0;
      updateFocus();
    } else toggleFocus();
    return true;
  }
  return false;
}
export { handleFocusClick };
