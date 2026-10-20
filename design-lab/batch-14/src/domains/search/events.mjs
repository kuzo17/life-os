import { $ } from "../../shared/dom.mjs";
import { projectById, folderById } from "../workspace/selectors.mjs";
import { taskLeaf } from "../tasks/views.mjs";
import { navigate, goto } from "../../app/router.mjs";
import { quick } from "../capture/views.mjs";
import { state } from "../../app/ui-state.mjs";
import { tasks, incomeSources } from "../../data/runtime.mjs";
function handleSearchClick(e, b) {
  if (b.dataset.cmd) {
    const value = b.dataset.cmd;
    $("#dlg").close();
    if (value === "quick") {
      quick();
      return true;
    }
    if (value.startsWith("nav:")) {
      goto(value.slice(4));
      return true;
    }
    if (value.startsWith("folder:")) {
      const id = value.slice(7);
      if (!folderById(id)) return true;
      navigate(() => {
        state.screen = "projects";
        state.folderId = id;
        state.projectId = null;
      }, {
        scroll: true
      });
      return true;
    }
    if (value.startsWith("source:")) {
      const id = value.slice(7);
      if (!incomeSources.some(x => x.id === id)) return true;
      navigate(() => {
        state.screen = "finance";
        state.financeSource = id;
        state.financeTab = "income";
      }, {
        scroll: true
      });
      return true;
    }
    if (value.startsWith("p:")) {
      const id = value.slice(2),
        p = projectById(id);
      if (!p) return true;
      navigate(() => {
        state.screen = "projects";
        state.projectId = id;
        state.folderId = p.folderId;
        state.projectSection = "tasks";
      }, {
        scroll: true
      });
      return true;
    }
    if (value.startsWith("task:")) {
      const id = value.slice(5),
        t = tasks.find(x => x.id === id);
      if (!t) return true;
      const p = projectById(t.projectId);
      navigate(() => {
        state.screen = "projects";
        state.projectId = t.projectId;
        state.folderId = p?.folderId || null;
        state.projectSection = "tasks";
      }, {
        scroll: true
      });
      taskLeaf(id);
      return true;
    }
    return true;
  }
  return false;
}
export { handleSearchClick };
