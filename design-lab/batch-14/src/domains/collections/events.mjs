import { $ } from "../../shared/dom.mjs";
import { notify } from "../../shared/feedback.mjs";
import { inventoryLeaf, inventoryNew } from "./views.mjs";
import { render } from "../../app/render-request.mjs";
import { navigate } from "../../app/router.mjs";
import { state } from "../../app/ui-state.mjs";
import { inventory } from "../../data/runtime.mjs";
import { operationalCore } from '../commands/runtime.mjs';
import { finishCoreAction } from '../../app/core-feedback.mjs';
function handleCollectionsClick(e, b) {
  if (b.dataset.inventoryFilter) {
    state.collectionFilter = b.dataset.inventoryFilter;
    render();
    return true;
  }
  if (b.dataset.inventoryItem) {
    inventoryLeaf(b.dataset.inventoryItem);
    return true;
  }
  if (b.hasAttribute("data-inventory-new")) {
    inventoryNew();
    return true;
  }
  if (b.dataset.collection) {
    navigate(() => {
      state.screen = "collections";
      state.collectionTab = b.dataset.collection;
    });
    return true;
  }
  return false;
}
function handleCollectionsSubmit(e) {
  if (e.target.id === "inventory-item-form") {
    e.preventDefault();
    const x = inventory.find(v => v.id === e.target.dataset.itemId);
    if (!x) return true;
    const q = Number($("#inventory-quantity").value),
      c = Number($("#inventory-cost").value),
      est = Number($("#inventory-estimate").value),
      ask = Number($("#inventory-ask").value);
    if (!Number.isInteger(q) || q < 1 || [c, est, ask].some(v => !Number.isFinite(v) || v < 0)) {
      notify("Controlla quantità e valori");
      return;
    }
    const result = operationalCore.execute('inventory.save', {
      id: x.id,
      title: $("#inventory-name").value.trim(),
      detail: $("#inventory-detail").value.trim(),
      quantity: q,
      acquisition: c,
      estimate: est,
      ask,
      status: $("#inventory-status").value
    }, 'Articolo aggiornato');
    if (result.ok) $("#dlg").close();
    finishCoreAction(result);
    return true;
  }
  if (e.target.id === "inventory-create-form") {
    e.preventDefault();
    const title = $("#inventory-new-name").value.trim(),
      quantity = Number($("#inventory-new-quantity").value),
      estimate = Number($("#inventory-new-estimate").value);
    if (!title || !Number.isInteger(quantity) || quantity < 1 || !Number.isFinite(estimate) || estimate < 0) {
      notify("Controlla quantità e stima");
      return;
    }
    const result = operationalCore.execute('inventory.save', {
      kind: state.collectionTab,
      title,
      detail: "Nuovo articolo demo",
      quantity,
      estimate,
      ask: estimate,
      acquisition: 0,
      status: "available"
    }, 'Articolo creato');
    if (result.ok) $("#dlg").close();
    finishCoreAction(result);
    return true;
  }
}
export { handleCollectionsClick, handleCollectionsSubmit };
