import { connectRenderer } from './render-request.mjs';
import { renderScreen } from './render.mjs';
import { parseRoute } from './router.mjs';
import { syncNav } from './shell.mjs';
import { installEvents } from './events.mjs';
import { installDrawerAccessibility } from './accessibility.mjs';
import { store } from '../data/runtime.mjs';
import { syncCoreChrome } from './core-feedback.mjs';
export function startApp() {
  connectRenderer(renderScreen);
  installEvents();
  installDrawerAccessibility();
  store.subscribe(syncCoreChrome);
  const routeChanged = () => {
    parseRoute();
    renderScreen();
  };
  window.addEventListener('popstate', routeChanged);
  window.addEventListener('hashchange', routeChanged);
  routeChanged();
  syncNav();
}
