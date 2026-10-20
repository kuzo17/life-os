export function installDrawerAccessibility() {
  "use strict";

  const sidebar = document.querySelector("#primary-sidebar");
  const workspace = document.querySelector(".workspace");
  const mobileBar = document.querySelector(".mobile-bar");
  const menuButton = document.querySelector("#mobile-menu");
  if (!sidebar) return;
  const sectionNames = {
    today: "Oggi",
    projects: "Progetti",
    agenda: "Agenda",
    fitos: "FitOS",
    finance: "Finanze",
    collections: "Collezioni",
    inbox: "Inbox",
    review: "Review"
  };
  for (const button of sidebar.querySelectorAll("[data-nav]")) {
    const label = sectionNames[button.dataset.nav];
    if (!label) continue;
    button.setAttribute("aria-label", label);
    button.title = label;
    button.dataset.label = label;
    button.querySelector(".nav-icon")?.setAttribute("aria-hidden", "true");
  }
  const focusableSelector = ["button:not([disabled])", "a[href]", "input:not([disabled])", "select:not([disabled])", "textarea:not([disabled])", "[tabindex]:not([tabindex='-1'])"].join(",");
  function drawerOpen() {
    return matchMedia("(max-width:720px)").matches && sidebar.dataset.mobileOpen === "true";
  }
  function syncDrawerBoundary() {
    const open = drawerOpen();
    document.body.classList.toggle("nav-drawer-open", open);
    if (workspace) workspace.inert = open;
    if (mobileBar) mobileBar.inert = open;
  }
  new MutationObserver(syncDrawerBoundary).observe(sidebar, {
    attributes: true,
    attributeFilter: ["data-mobile-open"]
  });
  syncDrawerBoundary();
  document.addEventListener("keydown", event => {
    if (event.key !== "Tab" || !drawerOpen()) return;
    const focusable = [...sidebar.querySelectorAll(focusableSelector)].filter(element => {
      const box = element.getBoundingClientRect();
      return box.width > 0 && box.height > 0;
    });
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  document.addEventListener("click", event => {
    if (!event.target.closest("[data-nav-close],#nav-scrim")) return;
    setTimeout(() => menuButton?.focus(), 0);
  });
  window.addEventListener("resize", syncDrawerBoundary);
}
