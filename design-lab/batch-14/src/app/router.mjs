import { projectById } from "../domains/workspace/selectors.mjs";
import { historySessionById } from "../domains/fitos/history.mjs";
import { render } from "./render-request.mjs";
import { titles, state } from "./ui-state.mjs";
import { homeFolders, incomeSources } from "../data/runtime.mjs";
const projectTabs = new Set(["tasks", "goals", "recur", "expenses", "notes"]);
const workoutViews = new Set(["week", "catalog", "history", "progression", "session"]);
const financeTabs = new Set(["overview", "income", "assets", "scheduled"]);
function safeSegment(value) {
  return encodeURIComponent(String(value));
}
function fromSegment(value) {
  try {
    return decodeURIComponent(value || "");
  } catch {
    return "";
  }
}
function routePath() {
  switch (state.screen) {
    case "projects":
      return state.projectId ? "/projects/workspace/" + safeSegment(state.projectId) + "/" + state.projectSection : state.folderId ? "/projects/folder/" + safeSegment(state.folderId) : "/projects";
    case "finance":
      return state.financeSource ? "/finance/source/" + safeSegment(state.financeSource) : "/finance/" + state.financeTab;
    case "fitos":
      return state.fitosTab === "train" ? state.fitosTrainingDay !== null ? "/fitos/train/day/" + state.fitosTrainingDay : state.fitosWorkoutView === "history" && state.fitosHistorySession ? "/fitos/train/history/" + safeSegment(state.fitosHistorySession) : "/fitos/train/" + state.fitosWorkoutView : "/fitos/" + state.fitosTab;
    case "agenda":
      return "/agenda/" + state.agendaMode + "/" + state.agendaDay;
    case "collections":
      return "/collections/" + state.collectionTab;
    default:
      return "/" + state.screen;
  }
}
function applyRoute(raw) {
  const path = String(raw || "").replace(/^#\/?/, ""),
    p = path.split("/").filter(Boolean).map(fromSegment);
  const module = p[0] || "today";
  state.screen = titles[module] ? module : "today";
  if (state.screen === "projects") {
    state.folderId = null;
    state.projectId = null;
    if (p[1] === "folder" && homeFolders.some(f => f.id === p[2])) state.folderId = p[2];
    if (p[1] === "workspace" && projectById(p[2])) {
      state.projectId = p[2];
      state.folderId = projectById(p[2]).folderId;
      state.projectSection = projectTabs.has(p[3]) ? p[3] : "tasks";
    }
  }
  if (state.screen === "finance") {
    state.financeSource = null;
    if (p[1] === "source" && incomeSources.some(x => x.id === p[2])) {
      state.financeSource = p[2];
      state.financeTab = "income";
    } else state.financeTab = financeTabs.has(p[1]) ? p[1] : "overview";
  }
  if (state.screen === "fitos") {
    state.fitosTab = ["today", "train", "food", "stretch", "weight"].includes(p[1]) ? p[1] : "today";
    state.fitosTrainingDay = null;
    if (state.fitosTab === "train") {
      if (p[2] === "day" && /^[0-6]$/.test(p[3])) {
        state.fitosTrainingDay = Number(p[3]);
        state.fitosWorkoutView = "week";
      } else {
        state.fitosWorkoutView = workoutViews.has(p[2]) ? p[2] : "week";
        state.fitosHistorySession = p[2] === "history" && historySessionById(p[3]) ? p[3] : null;
      }
    }
  }
  if (state.screen === "agenda") {
    state.agendaMode = p[1] === "day" ? "day" : "week";
    if (/^[0-6]$/.test(p[2])) state.agendaDay = Number(p[2]);
  }
  if (state.screen === "collections") state.collectionTab = p[1] === "vinted" ? "vinted" : "cards";
}
function syncRoute(replace = false) {
  const h = "#" + routePath();
  if (location.hash === h) return;
  if (replace) history.replaceState(null, "", h);else history.pushState(null, "", h);
}
function navigate(change, {
  replace = false,
  scroll = false
} = {}) {
  change();
  syncRoute(replace);
  render();
  if (scroll) window.scrollTo(0, 0);
}
function goto(screen) {
  if (!titles[screen]) return;
  navigate(() => {
    state.screen = screen;
    if (screen === "projects") {
      state.projectId = null;
      state.folderId = null;
    }
    if (screen === "finance") {
      state.financeSource = null;
      state.financeTab = "overview";
    }
  }, {
    scroll: true
  });
}
function parseRoute() {
  applyRoute(location.hash);
}
export { projectTabs, workoutViews, financeTabs, safeSegment, fromSegment, routePath, applyRoute, syncRoute, navigate, goto, parseRoute };
