import { $ } from "../../shared/dom.mjs";
import { safe, eur, sectionHead, headline, miniStat } from "../../shared/patterns.mjs";
import { dialog } from "../../shared/feedback.mjs";
import { state } from "../../app/ui-state.mjs";
import { tx, incomeSources } from "../../data/runtime.mjs";
function financeRows() {
  return tx.map(t => '<div class="list-item"><span class="chip ' + (t.type === "in" ? "cyan" : "coral") + '">' + (t.type === "in" ? "↗" : "↘") + '</span><div class="body">' + safe(t.name) + '<div class="sub">' + safe(t.date) + '</div></div><b style="color:var(' + (t.type === "in" ? "--good" : "--coral") + ')">' + (t.type === "in" ? "+" : "−") + " " + eur(t.amount) + '</b></div>').join("");
}
function viewFinanceBase() {
  return headline("Finanze", "Controllo completo senza doppi conteggi o passaggi inutili.", "PATRIMONIO & FLUSSI", '<button class="button primary title-action" data-action="tx-new">+ Movimento</button>') + '<div class="grid c12"><div class="card fin-hero colored-fin"><div class="eyebrow" style="color:var(--cyan)">PATRIMONIO NETTO · DEMO</div><div class="money">€ 24.680</div><div class="small muted">↗ + € 860 negli ultimi 30 giorni · Solo illustrazione</div><svg class="chart" viewBox="0 0 740 160" preserveAspectRatio="none" role="img" aria-label="Grafico patrimonio simulato"><defs><linearGradient id="gfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4adad2" stop-opacity=".25"/><stop offset="1" stop-color="#4adad2" stop-opacity="0"/></linearGradient></defs><line class="chart-grid" x1="0" y1="148" x2="740" y2="148"/><path class="chart-fill" d="M0 135 Q70 128 120 116 T250 106 T370 87 T500 65 T620 50 T740 17 L740 160 L0 160Z"/><path class="chart-line" d="M0 135 Q70 128 120 116 T250 106 T370 87 T500 65 T620 50 T740 17"/></svg></div>' + '<div class="fin-metrics">' + miniStat("Entrate mese", "€ 3.420", "Esempio", "cyan", "↗") + miniStat("Uscite mese", "€ 1.180", "Esempio", "coral", "↘") + miniStat("Asset", "6", "Categorie", "blue", "◈") + miniStat("Scadenze", "3", "Previste", "violet", "◷") + '</div>' + '<div class="span6">' + sectionHead("Asset", "Apri un asset nel prodotto definitivo") + '<div class="card"><div class="account" style="--shade:var(--cyan)"><span class="account-icon">€</span><div><h3>Liquidità</h3><span class="xs muted">Conti</span></div><b class="money-value">€ 12.640</b></div><div class="account" style="--shade:var(--blue)"><span class="account-icon">◈</span><div><h3>Investimenti</h3><span class="xs muted">Valore stimato</span></div><b class="money-value">€ 7.830</b></div><div class="account" style="--shade:var(--violet)"><span class="account-icon">◇</span><div><h3>Collezioni</h3><span class="xs muted">Valore stimato</span></div><b class="money-value">€ 4.210</b></div></div></div>' + '<div class="span6">' + sectionHead("Movimenti", "Registrazione disponibile come demo") + '<div class="card" id="tx-list">' + financeRows() + '</div></div>' + '<div class="span12 hint-box"><b>Flusso V2 proposto:</b> registrare un movimento richiederà l’asset, l’importo e una conferma dell’effetto. Pagare una spesa pianificata dovrà creare la transazione e aggiornarne lo stato senza duplicazioni. Questa demo non modifica alcun saldo reale.</div></div>';
}
function sourceCards() {
  return '<div class="sources">' + incomeSources.map(x => '<button class="card source-card" style="--source:' + x.color + '" data-ux="source-detail" data-source="' + x.id + '"><div class="source-top"><span class="source-logo">' + x.symbol + '</span><span class="pill">' + (x.id === "shop" ? x.mode === "fixed" ? "Fissa" : "Variabile" : "Fonte reddito") + '</span></div><div><h3>' + safe(x.name) + '</h3><div class="statnum">' + eur(x.earned) + '</div><div class="xs muted">Ricavi maturati · Demo</div></div><div class="source-bottom"><span>Incassati ' + eur(x.paid) + '</span><span>Dettagli ↗</span></div></button>').join("") + '</div>';
}
function financeTabMenu() {
  const options = [["overview", "Riepilogo"], ["income", "Fonti di reddito"], ["assets", "Asset"], ["scheduled", "Scadenze"]];
  return '<div class="finance-tabs">' + options.map(([id, label]) => '<button class="tab ' + (state.financeTab === id ? "active" : "") + '" data-ux="finance-tab" data-tab="' + id + '">' + label + '</button>').join("") + '</div>';
}
function financeSourcePage() {
  const src = incomeSources.find(x => x.id === state.financeSource);
  if (!src) {
    state.financeSource = null;
    return viewFinance();
  }
  const received = src.paid,
    pending = src.pending;
  const note = src.id === "kdp" ? "Le royalty maturate possono essere incassate in un periodo successivo. Le analisi per libro/mercato saranno una funzione aggiuntiva, non dati già collegati." : src.id === "cards" ? "Il valore delle carte in inventario e i ricavi delle carte vendute rappresentano dimensioni diverse. I costi e le commissioni servono per il profitto." : src.id === "vinted" ? "Il ricavo della vendita non equivale al profitto e il valore delle giacenze non è liquidità bancaria." : "Una previsione ricorrente può passare da importo fisso a variabile. Previsione e incasso registrato restano entità diverse.";
  const records = [{
    label: "Importi ricevuti · demo",
    status: "Incassato",
    amount: received,
    type: "paid"
  }, {
    label: "Importi non ancora ricevuti · demo",
    status: "Da incassare",
    amount: pending,
    type: "pending"
  }];
  return '<div class="workspace-breadcrumb"><button class="crumb-link" data-finance-home>Finanze</button><span>›</span><button class="crumb-link" data-finance-back>Fonti di reddito</button><span>›</span><b>' + safe(src.name) + '</b></div>' + '<div class="finance-source-head"><div class="finance-source-brand" style="background:' + src.color + '">' + safe(src.symbol) + '</div>' + '<div class="finance-source-title"><div class="eyebrow">PAGINA FONTE ECONOMICA · DATI ESEMPLIFICATIVI</div><h1>' + safe(src.name) + '</h1><p class="small muted">Riepilogo, riconciliazione e approfondimenti nella stessa pagina. Le operazioni singole aprono pannelli finali.</p></div>' + '<button class="button small" data-finance-back>← Torna alle fonti</button></div>' + '<div class="finance-source-kpis">' + '<div class="card"><div class="stat-label">Ricavi maturati</div><div class="statnum">' + eur(src.earned) + '</div><div class="xs muted">Non equivalgono necessariamente alla liquidità</div></div>' + '<div class="card"><div class="stat-label">Già incassati</div><div class="statnum">' + eur(received) + '</div><div class="xs muted">Pagamenti ricevuti, demo</div></div>' + '<div class="card"><div class="stat-label">Da incassare</div><div class="statnum">' + eur(pending) + '</div><div class="xs muted">Residuo non ancora liquidato</div></div>' + '</div>' + '<div class="finance-source-grid"><div>' + sectionHead("Movimenti della fonte", "Clicca una riga per il dettaglio finale") + '<div class="card">' + records.map(rec => '<button class="finance-ledger-row" data-income-entry="' + rec.type + '" data-income-source="' + src.id + '"><span class="chip ' + (rec.type === 'paid' ? 'cyan' : 'orange') + '">' + rec.status + '</span>' + '<div class="body"><b>' + rec.label + '</b><div class="sub">' + (rec.type === 'paid' ? 'Pagamento registrato nella demo' : 'Credito dimostrativo in attesa') + '</div></div>' + '<strong>' + eur(rec.amount) + '</strong><span class="muted">↗</span></button>').join("") + '</div>' + '<div class="finance-note" style="margin-top:15px"><b>Riconciliazione:</b> gli importi qui sotto sono aggregati dimostrativi, non vere transazioni. Non vanno sommati di nuovo al saldo del conto.</div></div>' + '<div>' + sectionHead("Contesto e regole", "Distinzione dei dati finanziari") + '<div class="card"><div class="eyebrow">DA SAPERE</div><p class="small muted" style="line-height:1.85;margin:12px 0 17px">' + safe(note) + '</p>' + (src.stock ? '<div class="finance-stock-metric"><span>Valore inventario stimato</span><b>' + eur(src.stock) + '</b><small>Non liquidità disponibile</small></div>' : '') + (src.id === 'shop' ? '<div class="finance-stock-metric"><span>Previsione ricorrente</span><b>' + (src.mode === 'fixed' ? 'Importo fisso' : 'Importo variabile') + '</b><small>Nessun dato storico modificato</small><button class="button small" style="margin-top:12px" data-finance-shop-toggle>Cambia modalità (demo)</button></div>' : '') + '<button class="button small" style="margin-top:21px" data-finance-back>Vedi tutte le fonti →</button></div></div></div>';
}
function incomeRecordLeaf(sourceId, type) {
  const src = incomeSources.find(x => x.id === sourceId);
  if (!src) return;
  const paid = type === 'paid',
    amount = paid ? src.paid : src.pending;
  dialog("Dettaglio " + (paid ? "incasso" : "credito"), '<div class="eyebrow">ULTIMO LIVELLO / OPERAZIONE · DEMO</div>' + '<h2>' + safe(src.name) + '</h2><div class="statnum" style="font-size:35px">' + eur(amount) + '</div>' + '<div class="finance-note" style="margin-top:12px">Questa è una voce aggregata fittizia. Nella V2 reale la scheda mostrerà ID, data, asset collegato, ricevuta, note e collegamento alla fattura o royalty. Non registra né modifica alcun movimento.</div>' + '<div class="modal-actions"><button class="button primary" data-close>Chiudi</button></div>');
  $("#dlg").classList.add("sheet");
}
function viewFinance() {
  if (state.financeSource) return financeSourcePage();
  const header = headline("Finanze", "Patrimonio, redditi, incassi e spese: tutto collegato, senza confondere i valori.", "ECONOMIA PERSONALE", '<button class="button primary title-action" data-action="tx-new">+ Movimento</button>');
  let content = "";
  if (state.financeTab === "overview") {
    const legacy = viewFinanceBase(),
      pos = legacy.indexOf('<div class="grid c12">');
    content = legacy.slice(pos);
    content += sectionHead("Attività economiche", "Seleziona una fonte per vedere gli importi distinti") + sourceCards();
    content += '<div class="finance-note" style="margin-top:19px"><b>Distinzione importante:</b> una royalty maturata KDP non è necessariamente liquidità disponibile. Vendere una carta sposta valore dall’inventario verso gli incassi: non significa che il prezzo di vendita sia tutto profitto.</div>';
  } else if (state.financeTab === "income") {
    content = '<p class="small muted" style="line-height:1.7">KDP, Vinted, Carte e Negozio sono <b>fonti economiche</b>, non automaticamente conti o asset. Le cifre sono puramente dimostrative.</p>' + sourceCards();
    content += sectionHead("Flussi del periodo", "Tutti i valori sono simulati") + '<div class="grid c3">' + miniStat("Ricavi maturati", "€ 4.110", "Non tutti sono versati", "cyan", "↗") + miniStat("Già incassati", "€ 3.690", "Accreditati/versati", "blue", "✓") + miniStat("Da incassare", "€ 420", "Non sono saldo conto", "violet", "◷") + '</div>';
    content += '<div class="finance-note" style="margin-top:18px">Negozio: la previsione può essere fissa inizialmente e diventare variabile senza sovrascrivere le vecchie registrazioni. La previsione futura non è un incasso.</div>';
  } else if (state.financeTab === "assets") {
    content = sectionHead("Asset patrimoniali", "Ciò che possiedi, distinto dalle fonti di reddito") + '<div class="grid c2"><div class="card"><div class="account" style="--shade:var(--cyan)"><span class="account-icon">€</span><div><h3>Liquidità</h3><span class="xs muted">Conti e contanti</span></div><b class="money-value">€ 12.640</b></div><div class="account" style="--shade:var(--blue)"><span class="account-icon">◈</span><div><h3>Investimenti</h3><span class="xs muted">Valutazioni</span></div><b class="money-value">€ 7.830</b></div><div class="account" style="--shade:var(--violet)"><span class="account-icon">◇</span><div><h3>Carte possedute</h3><span class="xs muted">Inventario stimato</span></div><b class="money-value">€ 4.210</b></div></div><div class="card"><div class="eyebrow">PATRIMONIO NETTO · DEMO</div><div class="money">€ 24.680</div><p class="small muted" style="line-height:1.7">In questa simulazione gli importi ancora da incassare non sono inclusi nel patrimonio. La V2 definirà una politica esplicita per crediti, valutazioni e riconciliazione.</p></div></div>';
  } else {
    content = sectionHead("Spese pianificate", "Previste, non ancora pagate") + '<div class="grid c2"><div class="card"><div class="list-item"><span class="chip coral">Domani</span><div class="body">Rata prevista<div class="sub">Da associare a un asset al pagamento</div></div><b>€ 85</b></div><div class="list-item"><span class="chip blue">15 ott</span><div class="body">Software<div class="sub">Ricorrente</div></div><b>€ 29</b></div></div><div class="card"><div class="eyebrow">NEGOZIO</div><h2>Entrata attesa</h2><div class="statnum">€ 1.800</div><p class="small muted">Previsione fissa nella demo, non ancora un movimento finanziario.</p><button class="button small" data-ux="source-detail" data-source="shop">Gestisci previsione →</button></div></div>';
  }
  return header + financeTabMenu() + content;
}
function txNew() {
  dialog("Registra movimento", '<form id="tx-form"><label class="field-label" for="tx-name">Descrizione</label><input id="tx-name" class="field" placeholder="Es. Acquisto materiale" required maxlength="100"><label class="field-label" for="tx-amount">Importo (€)</label><input id="tx-amount" class="field" type="number" min="0.01" step="0.01" required placeholder="25,00"><label class="field-label" for="tx-type">Direzione</label><select id="tx-type" class="field"><option value="out">Uscita</option><option value="in">Entrata</option></select><label class="field-label" for="tx-asset">Asset</label><select id="tx-asset" class="field"><option>Conto principale (demo)</option><option>Contanti (demo)</option></select><div class="hint-box" style="margin-top:18px">La V2 vera dovrà mostrare una conferma esplicita dell’effetto su saldo e storico. Questa demo non aggiorna il patrimonio.</div><div class="modal-actions"><button class="button ghost" type="button" data-close>Chiudi</button><button class="button primary" type="submit">Anteprima operazione</button></div></form>');
}
function openSourceSheet(id) {
  const x = incomeSources.find(s => s.id === id);
  if (!x) return;
  dialog(safe(x.name), '<div class="eyebrow">FONTE DI REDDITO · DEMO</div><div class="card" style="margin-bottom:16px"><div class="stat-label">Ricavi maturati</div><div class="statnum">' + eur(x.earned) + '</div><div class="stat-row"><span class="muted">Incassati</span><b>' + eur(x.paid) + '</b></div><div class="stat-row"><span class="muted">Da incassare</span><b>' + eur(x.pending) + '</b></div></div>' + (x.stock ? '<div class="stat-row"><span class="muted">Valore inventario posseduto</span><b>' + eur(x.stock) + '</b></div>' : '') + '<p class="small muted" style="line-height:1.8;margin-top:20px">' + safe(x.note) + '</p>' + (x.id === "shop" ? '<div class="card" style="margin-top:14px"><div class="eyebrow">ENTRATA ATTESA</div><h2>Modalità ' + (x.mode === "fixed" ? "fissa" : "variabile") + '</h2><p class="small muted" style="margin:13px 0">Impostazione dimostrativa, senza modificare movimenti già registrati.</p><button class="button" data-ux="toggle-shop">Passa a ' + (x.mode === "fixed" ? "variabile" : "fissa") + '</button></div>' : '') + '<div class="finance-note" style="margin-top:18px">L’inventario non è un incasso; il ricavo maturato non è automaticamente denaro disponibile. Nessun dato reale viene consultato.</div>');
  $("#dlg").classList.add("sheet");
}
export { financeRows, viewFinanceBase, sourceCards, financeTabMenu, financeSourcePage, incomeRecordLeaf, viewFinance, txNew, openSourceSheet };
