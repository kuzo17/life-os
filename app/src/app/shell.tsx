import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigation } from 'react-router';
import { Navigation } from './navigation';
import { MobileNavigation } from './mobile-navigation';
import { useRuntime, useWorkspace } from './workspace-context';
import { StorageNotice } from './storage-notice';
import { saveConfirmation } from '../application/save-confirmation';

export function Shell() {
  const [pinned, setPinned] = useState(false);
  const [hoverEnabled, setHoverEnabled] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [message, setMessage] = useState('');
  const [undoing, setUndoing] = useState(false);
  const { workspace } = useRuntime();
  const version = useWorkspace();
  const navigation = useNavigation();
  const location = useLocation();
  const main = useRef<HTMLElement>(null);
  const lastPath = useRef(location.pathname);
  useEffect(() => {
    if (lastPath.current !== location.pathname) main.current?.querySelector('h1')?.focus();
    lastPath.current = location.pathname;
  }, [location.pathname, navigation.state]);

  async function undo() {
    setUndoing(true);
    const result = await workspace.undo();
    setMessage(result.ok ? `Operazione annullata. ${saveConfirmation(version.durability)}` : result.message);
    setUndoing(false);
  }

  return <div className="app" data-theme={theme} data-pinned={pinned}>
    <a className="skip-link" tabIndex={0} href="#main-content" onClick={event => { event.preventDefault(); main.current?.focus(); }}>Salta al contenuto</a>
    <aside className="navigation-rail" aria-label="Barra laterale" data-hover-enabled={hoverEnabled}
      onPointerMove={event => { if (event.pointerType === 'mouse') setHoverEnabled(true); }}
      onPointerLeave={() => setHoverEnabled(false)}>
      <div className="brand"><span className="brand-symbol" aria-hidden="true">L</span><span className="nav-text">Life<span>OS</span></span></div>
      <Navigation onNavigate={() => { setHoverEnabled(false); main.current?.focus(); }} />
      <button className="pin-button" type="button" aria-pressed={pinned} aria-label={pinned ? 'Sgancia la navigazione' : 'Fissa la navigazione'}
        onPointerDown={event => event.currentTarget.focus()} onMouseDown={event => event.preventDefault()} onClick={() => setPinned(value => !value)}>
        <span className="nav-glyph" aria-hidden="true">⌁</span><span className="nav-text">{pinned ? 'Sgancia' : 'Fissa navigazione'}</span>
      </button>
    </aside>
    <div className="workspace-frame">
      <header className="topbar">
        <div className="topbar-brand"><MobileNavigation /><span>LifeOS <span className="development-label">SVILUPPO</span></span></div>
        <div className="topbar-actions">
          <button className="button" disabled={!version.undoLabel || undoing} onClick={() => { void undo(); }} aria-label="Annulla ultima operazione">Annulla</button>
          <button className="button" aria-label={theme === 'dark' ? 'Attiva tema chiaro' : 'Attiva tema scuro'} onClick={() => setTheme(value => value === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? 'Prism · chiaro' : 'Aurora · scuro'}</button>
        </div>
      </header>
      <StorageNotice />
      <p className="sr-only" role="status">{message}</p>
      <div className="route-pending" role="status">{navigation.state !== 'idle' ? 'Apertura pagina…' : ''}</div>
      <main id="main-content" ref={main} tabIndex={-1} aria-busy={navigation.state !== 'idle'}><Outlet /></main>
      <footer className="app-footer">Base applicativa · archivio locale sintetico · parità V1 parziale, nessun dato personale migrato</footer>
    </div>
  </div>;
}
