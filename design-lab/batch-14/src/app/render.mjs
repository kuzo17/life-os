import { $, $$ } from "../shared/dom.mjs";
import { projectName, folderName } from "../domains/workspace/selectors.mjs";
import { viewToday } from "../domains/today/views.mjs";
import { viewProjects } from "../domains/projects/views.mjs";
import { syncCoreChrome } from "./core-feedback.mjs";
import { viewAgenda } from "../domains/agenda/views.mjs";
import { viewFitos } from "../domains/fitos/views.mjs";
import { viewFinance } from "../domains/finance/views.mjs";
import { viewCollections } from "../domains/collections/views.mjs";
import { viewInbox } from "../domains/inbox/views.mjs";
import { viewReview } from "../domains/review/views.mjs";
import { viewMore } from "./shell.mjs";
import { titles, state } from "./ui-state.mjs";
import { inbox } from "../data/runtime.mjs";
const views = {
  today: viewToday,
  projects: viewProjects,
  agenda: viewAgenda,
  fitos: viewFitos,
  finance: viewFinance,
  collections: viewCollections,
  inbox: viewInbox,
  review: viewReview,
  more: viewMore
};
function renderScreen() {
  const el = $("#view");
  el.innerHTML = views[state.screen]();
  $("#crumb-current").textContent = state.screen === "projects" && !state.projectId && state.folderId ? folderName(state.folderId) : state.screen === "projects" && state.projectId ? projectName(state.projectId) + " / " + ({
    "tasks": "Task",
    "goals": "Obiettivi",
    "recur": "Ricorrenti",
    "expenses": "Spese",
    "notes": "Note"
  }[state.projectSection] || "") : titles[state.screen];
  $$("[data-nav]").forEach(b => {
    const on = b.dataset.nav === state.screen;
    b.classList.toggle("active", on);
    on ? b.setAttribute("aria-current", "page") : b.removeAttribute("aria-current");
  });
  const n = $("#inbox-count");
  n.textContent = inbox.length;
  n.hidden = inbox.length === 0;
  syncCoreChrome();
}
export { views, renderScreen };
