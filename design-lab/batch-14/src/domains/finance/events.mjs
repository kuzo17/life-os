import { $ } from "../../shared/dom.mjs";
import { safe, eur } from "../../shared/patterns.mjs";
import { dialog } from "../../shared/feedback.mjs";
import { incomeRecordLeaf, openSourceSheet } from "./views.mjs";
import { navigate } from "../../app/router.mjs";
import { state } from "../../app/ui-state.mjs";
import { operationalCore } from '../commands/runtime.mjs';
import { finishCoreAction } from '../../app/core-feedback.mjs';
function handleFinanceClick(e, b) {
  if (b.dataset.ux === "finance-tab") {
    navigate(() => {
      state.screen = "finance";
      state.financeSource = null;
      state.financeTab = b.dataset.tab;
    });
    return true;
  }
  if (b.dataset.ux === "source-detail") {
    navigate(() => {
      state.screen = "finance";
      state.financeSource = b.dataset.source;
      state.financeTab = "income";
    }, {
      scroll: true
    });
    return true;
  }
  if (b.hasAttribute("data-finance-back")) {
    navigate(() => {
      state.financeSource = null;
      state.financeTab = "income";
    });
    return true;
  }
  if (b.hasAttribute("data-finance-home")) {
    navigate(() => {
      state.financeSource = null;
      state.financeTab = "overview";
    });
    return true;
  }
  if (b.dataset.incomeEntry) {
    incomeRecordLeaf(b.dataset.incomeSource, b.dataset.incomeEntry);
    return true;
  }
  if (b.hasAttribute("data-finance-shop-toggle")) {
    finishCoreAction(operationalCore.execute('finance.sourceMode', {
      id: 'shop'
    }, 'Modalità fonte aggiornata'));
    return true;
  }
  if (b.dataset.ux === "toggle-shop") {
    const result = operationalCore.execute('finance.sourceMode', {
      id: 'shop'
    }, 'Modalità fonte aggiornata');
    if (finishCoreAction(result)) openSourceSheet("shop");
    return true;
  }
  return false;
}
function handleFinanceSubmit(e) {
  if (e.target.id === "tx-form") {
    e.preventDefault();
    const title = $("#tx-name").value.trim(),
      amount = Number($("#tx-amount").value),
      type = $("#tx-type").value;
    if (!title || !Number.isFinite(amount) || amount <= 0) return true;
    $("#dlg").close();
    dialog("Conferma effetto · Demo", '<p class="small muted">Registra nella lista di esempio: <b>' + safe(title) + '</b>, ' + eur(amount) + '. I saldi restano dimostrativi.</p><div class="modal-actions"><button class="button" data-close>Annulla</button><button class="button primary" id="confirm-demo-tx">Conferma nella demo</button></div>');
    $("#confirm-demo-tx").addEventListener("click", () => {
      const result = operationalCore.execute('finance.transaction', {
        name: title,
        amount,
        type
      }, 'Movimento registrato');
      if (result.ok) $("#dlg").close();
      finishCoreAction(result);
    });
  }
}
export { handleFinanceClick, handleFinanceSubmit };
