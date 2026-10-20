import { $ } from "../shared/dom.mjs";
import { state } from './ui-state.mjs';
import { render } from './render-request.mjs';
import { navigate } from './router.mjs';
import { projectById } from '../domains/workspace/selectors.mjs';
import { setNavOpen, syncNav } from './shell.mjs';
import { handleShellClick } from './shell-events.mjs';
import { handleActionClick } from './actions.mjs';
import { handleProjectsClick, handleProjectsSubmit } from '../domains/projects/events.mjs';
import { handleTasksClick, handleTasksSubmit } from '../domains/tasks/events.mjs';
import { handleAgendaClick, handleAgendaSubmit } from '../domains/agenda/events.mjs';
import { handleCaptureClick, handleCaptureSubmit } from '../domains/capture/events.mjs';
import { handleCollectionsClick, handleCollectionsSubmit } from '../domains/collections/events.mjs';
import { handleFinanceClick, handleFinanceSubmit } from '../domains/finance/events.mjs';
import { handleFitosClick } from '../domains/fitos/events.mjs';
import { handleTodayClick } from '../domains/today/events.mjs';
import { handleSearchClick } from '../domains/search/events.mjs';
import { handleInboxClick } from '../domains/inbox/events.mjs';
import { handleFocusClick } from '../domains/focus/events.mjs';
import { quick, renderFastFields } from '../domains/capture/views.mjs';
import { searchDialog, renderSearch } from '../domains/search/views.mjs';
import { stopTimer } from '../domains/focus/timer.mjs';
import { workoutSession } from '../domains/fitos/session.mjs';
const clickHandlers = [handleShellClick, handleCollectionsClick, handleProjectsClick, handleFitosClick, handleAgendaClick, handleTodayClick, handleCaptureClick, handleFinanceClick, handleTasksClick, handleActionClick, handleSearchClick, handleInboxClick, handleFocusClick];
const submitHandlers = [handleAgendaSubmit, handleProjectsSubmit, handleCollectionsSubmit, handleTasksSubmit, handleCaptureSubmit, handleFinanceSubmit];
export function installEvents() {
  const controller = new AbortController();
  const options = {
    signal: controller.signal
  };
  const on = (target, name, handler) => target.addEventListener(name, handler, options);
  on(document, 'click', event => {
    const button = event.target.closest('button,[data-project]');
    if (button) clickHandlers.some(handler => handler(event, button));
  });
  on(document, 'submit', event => {
    for (const handler of submitHandlers) handler(event);
  });
  on(document, 'change', event => {
    const input = event.target;
    if (input.id === 'agenda-project') {
      state.agendaProject = input.value;
      render();
    }
    if (input.hasAttribute('data-progression-deload')) {
      state.progressionDeload = input.checked;
      render();
    }
    if (input.id === 'fast-kind') renderFastFields();
    if (input.dataset.widgetToggle) {
      state.widgets[input.dataset.widgetToggle] = input.checked;
      render();
    }
  });
  on(document, 'input', event => {
    const input = event.target;
    const key = {
      'inventory-search': 'collectionQuery',
      'project-search': 'projectQuery'
    }[input.id];
    if (key) {
      state[key] = input.value;
      const position = input.selectionStart;
      render();
      const replacement = $(`#${input.id}`);
      replacement.focus();
      replacement.setSelectionRange(position, position);
    }
    if (input.id === 'command-q') renderSearch();
    if (input.id === 'session-set-note') workoutSession.draft.note = input.value;
  });
  on(document, 'keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      searchDialog();
    }
    if (event.key === 'Escape' && state.navOpen) {
      setNavOpen(false);
    }
    if (['Enter', ' '].includes(event.key) && event.target.matches('[data-project]')) {
      event.preventDefault();
      navigate(() => {
        state.projectId = event.target.dataset.project;
        state.folderId = projectById(state.projectId)?.folderId || null;
        state.projectSection = 'tasks';
        state.screen = 'projects';
      }, {
        scroll: true
      });
    }
  });
  on($('#density-toggle'), 'click', event => {
    const active = document.body.classList.toggle('density-compact');
    event.currentTarget.setAttribute('aria-pressed', String(active));
    event.currentTarget.textContent = active ? '▤ Comoda' : '▤ Compatta';
  });
  on($('#open-search'), 'click', searchDialog);
  on($('#open-quick'), 'click', () => quick());
  on($('#mobile-quick'), 'click', () => quick());
  on($('#dlg'), 'close', stopTimer);
  on(window, 'resize', () => {
    if (!matchMedia('(max-width:720px)').matches) state.navOpen = false;
    syncNav();
  });
  return () => controller.abort();
}
