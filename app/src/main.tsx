import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { createRuntime } from './app/runtime';
import { createAppRouter } from './app/router';
import { WorkspaceContext } from './app/workspace-context';
import { ErrorBoundary } from './ui/error-boundary';
import './ui/tokens.css';
import './ui/app.css';

const root = document.getElementById('root');
if (!root) throw new Error('Elemento di avvio mancante.');
const runtime = createRuntime();
const router = createAppRouter(runtime);

createRoot(root).render(<StrictMode><ErrorBoundary><WorkspaceContext.Provider value={runtime}>
  <RouterProvider router={router} />
</WorkspaceContext.Provider></ErrorBoundary></StrictMode>);
