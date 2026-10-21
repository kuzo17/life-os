import { Link, useLocation } from 'react-router';
import { PageHeading } from '../../ui/page-heading';

const modules: Record<string, { title: string; phase: string; description: string }> = {
  '/fitos': { title: 'FitOS', phase: 'F4', description: 'Allenamento, stretching, nutrizione e peso. Audit e prototipi esistenti saranno trasferiti per percorsi verificabili.' },
  '/finance': { title: 'Finanze', phase: 'F5', description: 'Asset, movimenti, spese, rate, fonti e collezioni. Prima regole e riconciliazione, poi riepiloghi.' },
  '/inbox': { title: 'Inbox', phase: 'F2 / F6', description: 'Cattura e smistamento useranno gli stessi comandi dei moduli di destinazione.' },
  '/settings': { title: 'Impostazioni', phase: 'F6 / F7', description: 'Preferenze, import/export, accessi e sincronizzazione. Nessun account è collegato in questa base.' },
};

export function ModuleStatusPage() {
  const { pathname } = useLocation();
  const module = modules[pathname];
  if (!module) return null;
  return <><PageHeading title={module.title} description={module.description} />
    <section className="card module-status"><span className="pill">Trasferimento previsto · {module.phase}</span><h2>Questo modulo non è ancora migrato</h2>
      <p>I prototipi rimangono conservati nel laboratorio. Questa destinazione indica il lavoro previsto e non simula funzioni, salvataggio o integrazioni.</p>
      <Link className="button" to="/today">Torna a Oggi</Link>
    </section>
  </>;
}
