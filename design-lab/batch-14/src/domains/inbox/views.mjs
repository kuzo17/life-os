import { safe, sectionHead, headline } from "../../shared/patterns.mjs";
import { inbox } from "../../data/runtime.mjs";
function inboxRows() {
  return inbox.length ? inbox.map(i => '<div class="list-item"><span class="chip ' + (i.type === "idea" ? "violet" : "blue") + '">' + safe(i.type) + '</span><div class="body">' + safe(i.text) + '</div><button class="button small" data-inbox-triage="' + i.id + '">Smista</button></div>').join("") : '<div class="empty">Inbox vuota. Hai smistato tutto.</div>';
}
function viewInbox() {
  return headline("Inbox", "Raccoglie ciò che non vuoi ancora classificare. Se conosci già la destinazione, passa dal flusso Cattura.", "CONTRATTO UNICO") + '<div class="grid c12"><div class="span8"><div class="card"><label for="inbox-entry" class="eyebrow">PARCHEGGIA SENZA CLASSIFICARE</label><div class="inbox-box"><span style="font-size:20px;color:var(--main)" aria-hidden="true">↧</span><input id="inbox-entry" placeholder="Un’idea, una task, un link, una scadenza..." maxlength="180"><button class="button small" data-action="inbox-add">Salva in Inbox</button><button class="button primary small" data-action="inbox-classify">Classifica ora</button></div><p class="xs muted" style="margin:12px 0 0">“Salva in Inbox” rimanda la decisione. “Classifica ora” apre lo stesso percorso Cattura usato in tutta LifeOS. Entrambe le azioni restano solo in memoria.</p></div></div><div class="span4"><div class="accent-block"><div class="xs">DA ORGANIZZARE</div><div class="num">' + inbox.length + '</div><div class="detail">Inbox = elementi ancora senza destinazione</div></div></div></div>' + sectionHead("Da smistare", "Scegli una destinazione, evitando copie") + '<div class="card">' + inboxRows() + '</div>';
}
export { inboxRows, viewInbox };
