import { $ } from "../../shared/dom.mjs";
import { safe } from "../../shared/patterns.mjs";
import { dialog } from "../../shared/feedback.mjs";
import { folderOptions } from "../projects/views.mjs";
import { state } from "../../app/ui-state.mjs";
import { projects } from "../../data/runtime.mjs";
function quick(initialMode = "natural", seed = "") {
  state.triageId = null;
  const natural = initialMode !== "fast";
  dialog("Cattura", '<div class="capture-contract" aria-label="Flusso di cattura"><span><b>1</b> Cattura</span><i aria-hidden="true">→</i><span><b>2</b> Controlla</span><i aria-hidden="true">→</i><span><b>3</b> Destina</span></div>' + '<p class="small muted capture-copy">Un solo ingresso, due velocità: usa il linguaggio naturale per un recap oppure scegli subito il tipo di elemento. Nulla viene creato senza la tua conferma.</p>' + '<div class="quick-modes" role="group" aria-label="Modalità di cattura"><button class="tab ' + (natural ? 'active' : '') + '" data-ux="quick-mode" data-mode="natural" aria-pressed="' + natural + '">✧ Recap libero</button><button class="tab ' + (!natural ? 'active' : '') + '" data-ux="quick-mode" data-mode="fast" aria-pressed="' + !natural + '">＋ Tipo preciso</button></div>' + '<div id="quick-natural" ' + (natural ? '' : 'hidden') + '><form id="spoken-form"><label class="field-label" for="spoken-input">Scrivi come parleresti</label><textarea class="field" id="spoken-input" rows="5" placeholder="Domani controllare le royalty KDP; lunedì chiamare il fornitore; venerdì rivedere la rata..." required>' + safe(seed) + '</textarea><div class="capture-hint">Puoi scrivere più frasi. Questa demo riconosce soltanto date ed espressioni semplici: non utilizza un modello linguistico.</div><div class="modal-actions"><button type="submit" class="button primary">Rivedi prima di creare →</button></div></form></div>' + '<div id="quick-fast" ' + (natural ? 'hidden' : '') + '><form id="fast-form"><label class="field-label" for="fast-kind">Tipo di elemento</label><select class="field" id="fast-kind">' + [["task", "Task"], ["goal", "Obiettivo"], ["weekly_goal", "Obiettivo settimanale"], ["recurring", "Ricorrente"], ["project", "Progetto"], ["expense", "Spesa pianificata"], ["note", "Nota"], ["link", "Link / risorsa"], ["food", "Alimento"], ["exercise", "Esercizio allenamento"], ["stretch", "Stretching"], ["recipe", "Ricetta"], ["habit", "Abitudine"], ["weight", "Peso"], ["movement", "Movimento finanziario"], ["asset", "Asset"], ["card", "Carta"], ["vinted", "Articolo Vinted"]].map(([id, label]) => '<option value="' + id + '">' + label + '</option>').join("") + '</select><div id="fast-fields"></div><div class="modal-actions"><button type="submit" class="button primary">Conferma nella demo</button></div><p class="xs muted" style="margin-top:14px;line-height:1.7">Le entità già navigabili aggiornano la vista di destinazione. Le categorie non ancora implementate diventano bozze esplicite in Inbox. Tutto si azzera al reload.</p></form></div>');
  renderFastFields();
  setTimeout(() => $(natural ? "#spoken-input" : "#fast-kind")?.focus(), 0);
}
function renderFastFields() {
  const specs = {
    task: [["title", "Titolo", "text"], ["date", "Quando (oggi, domani, lunedì...)", "text"]],
    goal: [["title", "Titolo obiettivo", "text"]],
    weekly_goal: [["title", "Titolo obiettivo settimanale", "text"]],
    recurring: [["title", "Attività ricorrente", "text"], ["extra", "Frequenza (es. ogni lunedì)", "text"]],
    project: [["title", "Nome progetto", "text"], ["extra", "Categoria", "text"]],
    food: [["title", "Nome alimento", "text"], ["amount", "Calorie / 100 g", "number"], ["extra", "Proteine / 100 g", "number"]],
    exercise: [["title", "Nome esercizio", "text"], ["amount", "Serie", "number"], ["extra", "Ripetizioni", "number"]],
    stretch: [["title", "Nome esercizio", "text"], ["amount", "Durata minuti", "number"]],
    recipe: [["title", "Nome ricetta", "text"], ["extra", "Categoria", "text"]],
    habit: [["title", "Nome abitudine", "text"], ["amount", "Target (facoltativo)", "number"]],
    weight: [["title", "Peso in kg", "number"], ["date", "Data (facoltativa)", "text"]],
    movement: [["title", "Descrizione", "text"], ["amount", "Importo €", "number"], ["extra", "Asset", "text"]],
    asset: [["title", "Nome asset", "text"], ["amount", "Saldo iniziale €", "number"]],
    expense: [["title", "Nome spesa", "text"], ["amount", "Importo €", "number"], ["date", "Scadenza", "text"]],
    card: [["title", "Carta", "text"], ["extra", "Serie / set", "text"], ["amount", "Prezzo acquisto €", "number"]],
    vinted: [["title", "Articolo", "text"], ["amount", "Prezzo €", "number"]],
    note: [["title", "Titolo nota", "text"], ["extra", "Dettagli", "text"]],
    link: [["title", "Titolo risorsa", "text"], ["extra", "URL o riferimento", "text"]]
  };
  const key = $("#fast-kind").value;
  const projectKinds = new Set(["task", "goal", "weekly_goal", "recurring", "expense", "note", "link"]);
  $("#fast-fields").innerHTML = (specs[key] || specs.task).map(([id, label, type], idx) => '<label class="field-label" for="fast-' + id + '">' + label + '</label><input class="field" id="fast-' + id + '" type="' + type + '" ' + (idx === 0 ? "required" : "") + ' ' + (type === "number" ? 'min="0" step="any"' : '') + ' placeholder="' + label + '">').join("") + (projectKinds.has(key) ? '<label class="field-label" for="fast-project">Progetto ' + (key === "task" ? '(obbligatorio)' : '') + '</label><select class="field" id="fast-project" ' + (key === "task" ? 'required' : '') + '>' + projectOptions(state.projectId || "", key === "task") + '</select>' : "") + (key === "task" ? '<label class="field-label" for="fast-priority">Priorità</label><select class="field" id="fast-priority"><option>alta</option><option selected>media</option><option>bassa</option></select>' : "") + (key === "project" ? '<label class="field-label" for="fast-folder">Cartella</label><select class="field" id="fast-folder">' + folderOptions(state.folderId || "altro") + '</select>' : "");
}
function interpretSimpleRecap(raw) {
  const parts = raw.split(/\n|;|(?<=\.)\s+|\s+e\s+(?=(?:oggi|domani|lunedi|lunedì|martedi|martedì|mercoledi|mercoledì|giovedi|giovedì|venerdi|venerdì|sabato|domenica)(?=\W|$))|,\s*(?=(?:oggi|domani|lunedi|lunedì|martedi|martedì|mercoledi|mercoledì|giovedi|giovedì|venerdi|venerdì|sabato|domenica|poi|ricordami)(?=\W|$))/i).map(x => x.trim()).filter(Boolean).slice(0, 15);
  const matches = [["kdp", /\b(kdp|royalt(?:y|ies)|amazon libri|trova la calma)\b/i], ["stosa", /\b(stosa|negozio|showroom|fornitore|cucine)\b/i], ["vinted", /\b(vinted|reselling abiti)\b/i], ["carte", /\b(carte|pok[eé]mon|ebay)\b/i], ["quartzica", /\b(quartzica)\b/i], ["aimade", /\b(ai made|gumroad)\b/i], ["nami", /\b(nami)\b/i], ["youtube", /\b(youtube)\b/i], ["risparmio", /\b(risparmio|conto risparmio)\b/i], ["crypto", /\b(crypto|bitcoin)\b/i], ["trading", /\b(trading)\b/i], ["allenamento", /\b(allenamento|palestra|scheda pesi)\b/i], ["alimentazione", /\b(alimentazione|macro|ricetta|alimento)\b/i], ["stretching", /\b(stretching|mobilit[aà])\b/i]];
  return parts.map(text => {
    const day = text.match(/\b(oggi|domani|dopodomani|luned[iì]|marted[iì]|mercoled[iì]|gioved[iì]|venerd[iì]|sabato|domenica)(?=\W|$)/i)?.[0].toLocaleLowerCase("it") || "Da pianificare";
    const explicit = [...matches].filter(([, re]) => re.test(text)).map(([id]) => id);
    const projectId = explicit.length === 1 ? explicit[0] : "";
    let priority = /\b(urgente|urgentissima?|priorit[aà]\s*alta|alta priorità)\b/i.test(text) ? "alta" : /\b(priorit[aà]\s*bassa|bassa priorità|non urgente)\b/i.test(text) ? "bassa" : "media";
    let kind = "task";
    if (/\b(idea|nota|appunto)\b/i.test(text)) kind = "note";else if (/\b(pagare|bonifico|incassare|transazione)\b/i.test(text)) kind = "reminder";
    return {
      text,
      day,
      priority,
      projectId,
      kind,
      ambiguous: explicit.length > 1
    };
  });
}
function projectOptions(selected, required = false) {
  return '<option value="">' + (required ? "— Scegli un progetto —" : "Nessuna destinazione") + '</option>' + projects.map(p => '<option value="' + p.id + '" ' + (selected === p.id ? "selected" : "") + '>' + safe(p.name) + '</option>').join("");
}
function showRecapPreview(items) {
  dialog("Rivedi il recap", '<div class="eyebrow">CONFERMA · PROGETTO + PRIORITÀ + QUANDO</div>' + '<p class="small muted" style="line-height:1.7">Le task devono essere assegnate a un progetto. Se non lo riconosco, scegli tu prima di confermare. Il testo è interpretato con regole demo, non tramite AI.</p>' + '<div id="spoken-preview" class="preview-rows">' + items.map((item, i) => '<div class="preview-row" data-row="' + i + '">' + '<input class="field" data-row-text="' + i + '" value="' + safe(item.text) + '" aria-label="Testo elemento ' + (i + 1) + '">' + '<div class="preview-fields">' + '<select data-row-kind="' + i + '" aria-label="Tipo elemento">' + [["task", "Task"], ["fitos", "FitOS"], ["reminder", "Promemoria"], ["note", "Nota"]].map(([id, label]) => '<option value="' + id + '" ' + (item.kind === id ? "selected" : "") + '>' + label + '</option>').join("") + '</select>' + '<select data-row-day="' + i + '" aria-label="Quando">' + ["Da pianificare", "oggi", "domani", "dopodomani", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"].map(day => '<option ' + (item.day === day ? "selected" : "") + '>' + day + '</option>').join("") + '</select>' + '<button class="button small" type="button" data-ux="remove-recap" data-row="' + i + '" aria-label="Escludi elemento">×</button></div>' + '<div class="preview-fields project-fields"><select data-row-project="' + i + '" aria-label="Progetto">' + projectOptions(item.projectId, true) + '</select>' + '<select data-row-priority="' + i + '" aria-label="Priorità">' + ["alta", "media", "bassa"].map(p => '<option ' + (item.priority === p ? "selected" : "") + '>' + p + '</option>').join("") + '</select>' + '<span class="tiny muted">' + (item.ambiguous ? "Più progetti possibili: controlla" : "Controlla e conferma") + '</span></div>' + '</div>').join("") + '</div><div class="modal-actions"><button class="button" data-ux="recap-back" type="button">Indietro</button><button class="button primary" data-ux="recap-confirm" type="button">Conferma nella demo</button></div>' + '<p class="xs muted" style="margin-top:13px;line-height:1.7">Le task diventano un unico record e vengono mostrate nel progetto e, secondo la data, in Oggi o Agenda. Nessun dato è salvato su server.</p>');
}
export { quick, renderFastFields, interpretSimpleRecap, projectOptions, showRecapPreview };
