import { $ } from "../../shared/dom.mjs";
import { taskLeaf } from "./views.mjs";
import { finishCoreAction } from "../../app/core-feedback.mjs";
import { quick, renderFastFields } from "../capture/views.mjs";
import { tasks } from "../../data/runtime.mjs";
import { operationalCore } from "../commands/runtime.mjs";
function handleTasksClick(e, b) {
  if (b.dataset.task) {
    const before = tasks.find(x => x.id === b.dataset.task)?.done;
    finishCoreAction(operationalCore.toggleTask(b.dataset.task), before ? "Riaperta · Demo" : "Completata · Demo");
    return true;
  }
  if (b.dataset.taskLeaf) {
    taskLeaf(b.dataset.taskLeaf);
    return true;
  }
  if (b.dataset.addProjectTask) {
    quick("fast");
    $("#fast-kind").value = "task";
    renderFastFields();
    const sel = $("#fast-project");
    if (sel) sel.value = b.dataset.addProjectTask;
    return true;
  }
  return false;
}
function handleTasksSubmit(e) {
  if (e.target.id === "task-leaf-form") {
    e.preventDefault();
    const result = operationalCore.execute('task.update', {
      id: e.target.dataset.taskId,
      patch: {
        title: $("#leaf-title").value.trim(),
        projectId: $("#leaf-project").value,
        priority: $("#leaf-priority").value,
        when: $("#leaf-when").value
      }
    }, 'Task aggiornata in tutte le viste');
    if (result.ok) $("#dlg").close();
    finishCoreAction(result);
    return true;
  }
}
export { handleTasksClick, handleTasksSubmit };
