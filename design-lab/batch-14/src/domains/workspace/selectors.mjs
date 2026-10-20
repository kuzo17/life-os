import { projects, tasks, homeFolders } from "../../data/runtime.mjs";
function projectById(id) {
  return projects.find(p => p.id === id) || null;
}
function projectName(id) {
  return projectById(id)?.name || "Progetto non assegnato";
}
function taskPriority(t) {
  return t.priority || "media";
}
function projectTasks(id) {
  return tasks.filter(t => t.projectId === id);
}
function projectMetric(p) {
  const a = projectTasks(p.id);
  return {
    n: a.length,
    done: a.filter(t => t.done).length,
    pct: a.length ? Math.round(a.filter(t => t.done).length / a.length * 100) : null
  };
}
function folderById(id) {
  return homeFolders.find(x => x.id === id) || null;
}
function folderName(id) {
  return folderById(id)?.name || (id === "fitos" ? "FitOS" : "Cartella sconosciuta");
}
function folderCount(id) {
  return projects.filter(p => p.folderId === id).length;
}
export { projectById, projectName, taskPriority, projectTasks, projectMetric, folderById, folderName, folderCount };
