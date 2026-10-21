import { useWorkspace } from '../../app/workspace-context';
import { PageHeading } from '../../ui/page-heading';
import { TaskList } from './task-list';
import { scheduledDays, tasksOn, unscheduledTasks } from '../../domain/workspace/selectors';

export function AgendaPage() {
  const { data } = useWorkspace();
  const days = scheduledDays(data);
  return <><PageHeading title="Agenda" description="La stessa attività, vista nel tempo. Date del dataset sintetico; la migrazione del calendario V1 segue in F2." />
    <div className="agenda-grid">{days.map(day => <section className="card" key={day}>
      <h2>{new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${day}T00:00:00Z`))}</h2>
      <TaskList tasks={tasksOn(data, day)} />
    </section>)}</div>
    <section className="card"><h2>Non pianificate</h2><TaskList tasks={unscheduledTasks(data)} /></section>
  </>;
}
