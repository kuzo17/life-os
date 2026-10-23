import { useEffect, useState } from 'react';
import { useRuntime, useWorkspace } from './workspace-context';

export function StorageNotice() {
  const { workspace } = useRuntime();
  const { durability } = useWorkspace();
  const [error, setError] = useState('');
  useEffect(() => {
    async function refresh() {
      const result = await workspace.refresh();
      setError(result.ok ? '' : 'Impossibile rileggere l’archivio. Le modifiche non confermate non sono salvate. Ricarica per riaprirlo.');
    }
    function visible() { if (document.visibilityState === 'visible') void refresh(); }
    window.addEventListener('focus', visible);
    document.addEventListener('visibilitychange', visible);
    return () => { window.removeEventListener('focus', visible); document.removeEventListener('visibilitychange', visible); };
  }, [workspace]);
  return <div className="environment-notice">
    <strong>{durability === 'local' ? 'Dati sintetici · salvataggio locale' : 'Dati sintetici · solo memoria'}</strong>
    <span>{durability === 'local'
      ? 'Le modifiche confermate restano in questo browser. Non è un backup: nessun account o servizio collegato.'
      : 'Le modifiche si perdono ricaricando. Nessun account o servizio collegato.'}</span>
    {error && <span role="alert">{error}</span>}
  </div>;
}
