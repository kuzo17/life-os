import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { openLocalRuntime } from './app/runtime';
import { createAppRouter } from './app/router';
import { WorkspaceContext } from './app/workspace-context';
import { ErrorBoundary } from './ui/error-boundary';
import './ui/tokens.css';
import './ui/app.css';

const root = document.getElementById('root');
if (!root) throw new Error('Elemento di avvio mancante.');
const reactRoot = createRoot(root);

async function start() {
  reactRoot.render(<div className="fatal-error" role="status">Apertura archivio locale sintetico…</div>);
  try {
    const runtime = await openLocalRuntime();
    const router = createAppRouter(runtime);
    reactRoot.render(<StrictMode><ErrorBoundary><WorkspaceContext.Provider value={runtime}>
      <RouterProvider router={router} />
    </WorkspaceContext.Provider></ErrorBoundary></StrictMode>);
  } catch {
    reactRoot.render(<div className="fatal-error"><section role="alert"><h1>Archivio locale non disponibile</h1>
      <p>Nessun dato esistente è stato sostituito. Verifica che il browser consenta il salvataggio e chiudi eventuali vecchie schede LifeOS.</p>
      <p>Non cancellare l’archivio per risolvere un errore: perderesti le modifiche locali. Questa preview usa solo dati sintetici.</p>
      <button className="button" onClick={() => { void start(); }}>Riprova apertura</button>
    </section></div>);
  }
}
void start();
