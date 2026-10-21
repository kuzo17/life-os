import { isRouteErrorResponse, Link, useRouteError } from 'react-router';
import { PageHeading } from '../ui/page-heading';

export function RouteFailure() {
  const error: unknown = useRouteError();
  const missing = isRouteErrorResponse(error) && error.status === 404;
  return <section className="card" role="alert">
    <PageHeading title={missing ? 'Progetto non trovato' : 'Pagina non disponibile'} description="I dati in memoria non sono stati azzerati. Puoi tornare ai progetti e riprovare." eyebrow="Qualcosa non torna" />
    <Link className="button" to="/projects">Vai ai progetti</Link>
  </section>;
}

export function NotFoundPage() {
  return <><PageHeading title="Pagina non trovata" description="Questo indirizzo non esiste nella nuova applicazione." /><Link className="button" to="/today">Torna a Oggi</Link></>;
}
