import { createHashRouter, createMemoryRouter, redirect, type RouteObject } from 'react-router';
import type { Runtime } from './runtime';
import { Shell } from './shell';
import { RouteFailure, NotFoundPage } from './route-failure';

function routes(runtime: Runtime): RouteObject[] {
  return [{
    Component: Shell,
    hydrateFallbackElement: <p className="fatal-error" role="status">Apertura LifeOS…</p>,
    errorElement: <div className="fatal-error"><RouteFailure /></div>,
    children: [
      { index: true, loader: () => redirect('/today') },
      { path: 'today', lazy: async () => ({ Component: (await import('../modules/workspace/today-page')).TodayPage }), errorElement: <RouteFailure /> },
      { path: 'projects', lazy: async () => ({ Component: (await import('../modules/workspace/projects-page')).ProjectsPage }), errorElement: <RouteFailure /> },
      {
        path: 'projects/:projectId',
        loader: async ({ params }) => {
          const current = await runtime.repository.read();
          if (!current.data.projects.some(project => project.id === params.projectId)) throw new Response(null, { status: 404 });
          return null;
        },
        lazy: async () => ({ Component: (await import('../modules/workspace/project-page')).ProjectPage }),
        errorElement: <RouteFailure />,
      },
      { path: 'agenda', lazy: async () => ({ Component: (await import('../modules/workspace/agenda-page')).AgendaPage }), errorElement: <RouteFailure /> },
      ...['fitos', 'finance', 'inbox', 'settings'].map(path => ({
        path,
        lazy: async () => ({ Component: (await import('../modules/delivery/module-status-page')).ModuleStatusPage }),
        errorElement: <RouteFailure />,
      })),
      { path: '*', Component: NotFoundPage },
    ],
  }];
}

export function createAppRouter(runtime: Runtime) { return createHashRouter(routes(runtime)); }
export function createTestRouter(runtime: Runtime, initialEntries = ['/today']) { return createMemoryRouter(routes(runtime), { initialEntries }); }
