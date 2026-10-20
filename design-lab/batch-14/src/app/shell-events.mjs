import { $ } from "../shared/dom.mjs";
import { notify } from "../shared/feedback.mjs";
import { syncNav, setNavOpen, setTheme } from "./shell.mjs";
import { render } from "./render-request.mjs";
import { goto } from "./router.mjs";
import { stopTimer } from "../domains/focus/timer.mjs";
import { state } from "./ui-state.mjs";
import { operationalCore } from "../domains/commands/runtime.mjs";
function handleShellClick(e, b) {
  if (b.id === "core-undo") {
    const result = operationalCore.undo();
    render();
    notify(result.ok ? "Operazione annullata · Demo" : result.error);
    return true;
  }
  if (b.hasAttribute("data-nav-pin")) {
    state.navPinned = !state.navPinned;
    syncNav();
    notify(state.navPinned ? "Navigazione fissata" : "Navigazione compatta: passa sopra o usa Tab");
    return true;
  }
  if (b.hasAttribute("data-nav-close")) {
    state.navPinned = false;
    setNavOpen(false);
    syncNav();
    return true;
  }
  if (b.id === "mobile-menu") {
    setNavOpen(!state.navOpen);
    return true;
  }
  if (b.id === "nav-scrim") {
    setNavOpen(false);
    return true;
  }
  if (b.dataset.theme) {
    setTheme(b.dataset.theme);
    return true;
  }
  if (b.dataset.nav) {
    goto(b.dataset.nav);
    if (matchMedia("(max-width:720px)").matches) setNavOpen(false);
    return true;
  }
  if (b.hasAttribute("data-close")) {
    $("#dlg").close();
    stopTimer();
    return true;
  }
  return false;
}
export { handleShellClick };
