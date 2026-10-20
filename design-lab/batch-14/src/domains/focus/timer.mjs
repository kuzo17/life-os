import { $ } from "../../shared/dom.mjs";
import { dialog, notify } from "../../shared/feedback.mjs";
import { state } from "../../app/ui-state.mjs";
function focusDialog() {
  dialog("Focus Mode · Demo", '<div style="text-align:center"><div class="eyebrow">SESSIONE NON PERSISTITA</div><div class="money" id="focus-display">25:00</div><div class="small muted">Il timer è una simulazione locale.</div></div><div class="modal-actions" style="justify-content:center"><button class="button primary" data-focus="toggle" id="focus-toggle">▶ Avvia</button><button class="button" data-focus="reset">↺ Ripristina</button></div>');
  updateFocus();
}
function updateFocus() {
  const remaining = Math.max(0, 1500 - state.focus);
  const el = $("#focus-display");
  if (el) el.textContent = String(Math.floor(remaining / 60)).padStart(2, "0") + ":" + String(remaining % 60).padStart(2, "0");
  const b = $("#focus-toggle");
  if (b) b.textContent = state.focusRunning ? "Ⅱ Pausa" : "▶ Avvia";
}
function stopTimer() {
  state.focusRunning = false;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  updateFocus();
}
let timer = null;
function toggleFocus() {
  if (state.focusRunning) {
    stopTimer();
    return;
  }
  state.focusRunning = true;
  timer = setInterval(() => {
    state.focus++;
    updateFocus();
    if (state.focus >= 1500) {
      stopTimer();
      notify('Focus completato · Demo');
    }
  }, 1000);
  updateFocus();
}
export { focusDialog, updateFocus, stopTimer, toggleFocus };
