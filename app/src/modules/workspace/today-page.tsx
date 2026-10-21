import { Link } from 'react-router';
import { useRuntime, useWorkspace } from '../../app/workspace-context';
import { PageHeading } from '../../ui/page-heading';
import { TaskList } from './task-list';
import { tasksOn, completion } from '../../domain/workspace/selectors';

export function TodayPage() {
  const { referenceDay } = useRuntime();
  const { data } = useWorkspace();
  const tasks = tasksOn(data, referenceDay);
  const { completed } = completion(tasks);
  return <>
    <PageHeading title="Oggi" description="Una cosa alla volta. Ritrova le stesse attività nei progetti e in Agenda." eyebrow="Mercoledì · 21 ottobre 2026 · dataset sintetico" />
    <div className="overview-grid">
      <section className="card hero"><p className="eyebrow">Spazio al prossimo passo</p><h2>Le cose importanti,<br />senza il rumore.</h2><p>Il lavoro di oggi nasce dai tuoi progetti. Qui cambia la vista, non si duplicano le attività.</p><Link className="button primary" to="/projects">Apri i progetti <span aria-hidden="true">↗</span></Link></section>
      <section className="card progress-card" aria-label="Attività del giorno"><p className="eyebrow">Il tuo ritmo</p><p className="big-number">{completed}<span> / {tasks.length}</span></p><h2>attività completate</h2><progress aria-label="Task completate oggi" max={tasks.length || 1} value={completed} /><p>Dati calcolati dalle task del dataset, non da contatori fittizi.</p></section>
    </div>
    <section className="card"><div className="section-heading"><h2>Da tenere a fuoco</h2><Link to="/agenda">Vedi Agenda →</Link></div><TaskList tasks={tasks} /></section>
  </>;
}
