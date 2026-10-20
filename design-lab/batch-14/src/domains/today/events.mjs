import { openWidgetConfig } from "./views.mjs";
function handleTodayClick(e, b) {
  if (b.dataset.ux === "widget-config") {
    openWidgetConfig();
    return true;
  }
  return false;
}
export { handleTodayClick };
