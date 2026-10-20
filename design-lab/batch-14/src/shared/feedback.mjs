import { $ } from "./dom.mjs";
function notifyUndo(message, undo) {
  const t = $("#toast");
  t.replaceChildren();
  const msg = document.createElement("span");
  msg.textContent = message;
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = "Annulla";
  b.addEventListener("click", () => {
    undo();
    t.hidden = true;
    if (toastTimeout) clearTimeout(toastTimeout);
  });
  t.append(msg, b);
  t.hidden = false;
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    t.hidden = true;
  }, 6000);
}
function notify(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    t.hidden = true;
  }, 2700);
}
function dialog(title, body) {
  $("#dlg").classList.remove("sheet");
  $("#dlg-body").innerHTML = '<div class="modal-top"><div><div class="eyebrow" style="margin-bottom:5px">LIFEOS / EXPERIENCE LAB</div><h2 id="dlg-title">' + title + '</h2></div><button class="modal-close" aria-label="Chiudi" data-close>×</button></div>' + body;
  if (!$("#dlg").open) $("#dlg").showModal();
}
let toastTimeout = null;
export { notifyUndo, notify, dialog, toastTimeout };
