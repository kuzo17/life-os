import { $, $$ } from "../shared/dom.mjs";
import { headline } from "../shared/patterns.mjs";
import { state } from "./ui-state.mjs";
function viewMore() {
  return headline("Altri strumenti", "Tutti i moduli restano raggiungibili anche da smartphone.", "NAVIGAZIONE") + '<div class="grid c2">' + [["fitos", "♡ FitOS", "Allenamento, nutrizione, stretching e peso"], ["finance", "◉ Finanze", "Asset, movimenti, spese e patrimonio"], ["collections", "◇ Collezioni", "Carte e Vinted"], ["inbox", "↧ Inbox", "Idee, task e link da smistare"], ["review", "◎ Review", "Revisione settimanale"], ["projects", "▦ Progetti", "Cartelle e attività"]].map(([k, l, d]) => '<button class="card" style="text-align:left;color:var(--text)" data-nav="' + k + '"><h2>' + l + '</h2><p class="small muted" style="margin:12px 0 0">' + d + '</p></button>').join("") + '</div>';
}
function syncNav() {
  const side = $("#primary-sidebar"),
    mobile = matchMedia("(max-width:720px)").matches;
  side.dataset.pinned = String(!mobile && state.navPinned);
  side.dataset.mobileOpen = String(mobile && state.navOpen);
  side.inert = mobile && !state.navOpen;
  side.setAttribute("aria-hidden", String(mobile && !state.navOpen));
  document.body.classList.toggle("nav-pinned", !mobile && state.navPinned);
  const pin = $("[data-nav-pin]");
  if (pin) {
    pin.setAttribute("aria-pressed", String(state.navPinned));
    pin.querySelector(".nav-pin-label").textContent = state.navPinned ? "Libera" : "Fissa aperta";
  }
  const menu = $("#mobile-menu"),
    scrim = $("#nav-scrim");
  if (menu) menu.setAttribute("aria-expanded", String(state.navOpen));
  if (scrim) scrim.hidden = !state.navOpen;
}
function setNavOpen(open) {
  state.navOpen = Boolean(open);
  syncNav();
  const expected = state.navOpen;
  // Wait until the drawer boundary has removed inert from the focus destination.
  setTimeout(() => {
    if (state.navOpen === expected) $(expected ? '#primary-sidebar .nav' : '#mobile-menu')?.focus();
  }, 0);
}
function setTheme(theme) {
  if (!["dark", "light"].includes(theme)) return;
  state.theme = theme;
  document.body.dataset.theme = theme;
  $$("[data-theme]").forEach(b => {
    const yes = b.dataset.theme === theme;
    b.classList.toggle("on", yes);
    b.setAttribute("aria-pressed", String(yes));
  });
}
export { viewMore, syncNav, setNavOpen, setTheme };
