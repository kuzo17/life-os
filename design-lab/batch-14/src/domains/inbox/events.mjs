import { $ } from "../../shared/dom.mjs";
import { safe } from "../../shared/patterns.mjs";
import { dialog } from "../../shared/feedback.mjs";
import { quick, renderFastFields } from "../capture/views.mjs";
import { state } from "../../app/ui-state.mjs";
import { inbox } from "../../data/runtime.mjs";
function handleInboxClick(e, b) {
  if (b.dataset.inboxTriage) {
    const item = inbox.find(x => String(x.id) === b.dataset.inboxTriage);
    if (item) {
      dialog("Smista elemento", '<p class="muted small">' + safe(item.text) + '</p><div class="grid c2"><button class="button" data-triage-to="task" data-triage-id="' + safe(item.id) + '">→ Task</button><button class="button" data-triage-to="note" data-triage-id="' + safe(item.id) + '">→ Nota</button></div><p class="xs muted" style="margin-top:15px">L’elemento lascia Inbox solo dopo la conferma della destinazione.</p>');
    }
    return true;
  }
  if (b.dataset.triageTo) {
    const item = inbox.find(x => String(x.id) === b.dataset.triageId);
    if (item) {
      $("#dlg").close();
      quick("fast");
      $("#fast-kind").value = b.dataset.triageTo;
      renderFastFields();
      $("#fast-title").value = item.text;
      state.triageId = item.id;
    }
    return true;
  }
  return false;
}
export { handleInboxClick };
