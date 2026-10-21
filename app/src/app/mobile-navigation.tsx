import { useEffect, useRef } from 'react';
import { Navigation } from './navigation';

export function MobileNavigation() {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 761px)');
    const closeOnDesktop = () => { if (media.matches) dialog.current?.close(); };
    media.addEventListener('change', closeOnDesktop);
    return () => { media.removeEventListener('change', closeOnDesktop); };
  }, []);
  return <>
    <button ref={opener} className="mobile-menu button" aria-haspopup="dialog" aria-controls="mobile-navigation" onClick={() => dialog.current?.showModal()}>Menu</button>
    <dialog id="mobile-navigation" ref={dialog} className="mobile-dialog" aria-labelledby="navigation-title" onKeyDown={event => {
      if (event.key !== 'Tab') return;
      const items = dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]');
      const first = items?.[0], last = items?.[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }} onClose={() => {
      if (window.matchMedia('(max-width: 760px)').matches) opener.current?.focus();
      else document.getElementById('main-content')?.focus();
    }}>
      <div className="dialog-heading"><h2 id="navigation-title">Navigazione</h2>
        <button className="button" onClick={() => dialog.current?.close()} autoFocus>Chiudi</button>
      </div>
      <Navigation onNavigate={() => dialog.current?.close()} />
    </dialog>
  </>;
}
