import { $ } from "../../shared/dom.mjs";
import { projectName, taskPriority, folderName } from "../workspace/selectors.mjs";
import { dialog } from "../../shared/feedback.mjs";
import { titles } from "../../app/ui-state.mjs";
import { projects, tasks, homeFolders, incomeSources } from "../../data/runtime.mjs";
function searchDialog() {
  dialog("Vai dove vuoi", '<input class="field" id="command-q" placeholder="Cerca sezioni, progetti, task e azioni..." aria-label="Cerca"><div id="command-results" style="margin-top:12px"></div><div class="xs muted" style="margin-top:15px">Ctrl / ⌘ + K · Esc per chiudere</div>');
  $("#command-q").focus();
  renderSearch();
}
function renderSearch() {
  const q = ($("#command-q")?.value || "").toLocaleLowerCase("it"),
    root = $("#command-results");
  root.replaceChildren();
  const options = [...Object.entries(titles).filter(([k]) => k !== "more").map(([id, title]) => ({
    id: "nav:" + id,
    title,
    sub: "Sezione"
  })), ...homeFolders.map(f => ({
    id: "folder:" + f.id,
    title: f.name,
    sub: "Cartella"
  })), ...projects.map(p => ({
    id: "p:" + p.id,
    title: p.name,
    sub: folderName(p.folderId) + " · Progetto"
  })), ...tasks.map(t => ({
    id: "task:" + t.id,
    title: t.title,
    sub: projectName(t.projectId) + " · " + taskPriority(t)
  })), ...incomeSources.map(s => ({
    id: "source:" + s.id,
    title: s.name,
    sub: "Fonte economica"
  })), {
    id: "quick",
    title: "Quick Add / Cattura naturale",
    sub: "Azione globale"
  }];
  const filtered = options.filter(v => (v.title + " " + v.sub).toLocaleLowerCase("it").includes(q)).slice(0, 12);
  for (const item of filtered) {
    const b = document.createElement("button");
    b.className = "search-result";
    b.dataset.cmd = item.id;
    const title = document.createElement("span");
    title.textContent = item.title;
    const sub = document.createElement("small");
    sub.textContent = item.sub;
    b.append(title, sub);
    root.append(b);
  }
  if (!filtered.length) root.textContent = "Nessun risultato trovato";
}
export { searchDialog, renderSearch };
