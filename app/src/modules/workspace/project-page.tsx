import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { useRuntime, useWorkspace } from '../../app/workspace-context';
import type { DeepReadonly } from '../../domain/shared/immutable';
import type { Project } from '../../domain/workspace/model';
import { PageHeading } from '../../ui/page-heading';
import { TaskList } from './task-list';
import { tasksForProject } from '../../domain/workspace/selectors';

function RenameProject({ project }: { project: DeepReadonly<Project> }) {
  const { workspace } = useRuntime();
  const [name, setName] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);
  async function save() {
    setPending(true);
    const result = await workspace.execute({ type: 'project.rename', id: project.id, name: name ?? project.name });
    if (result.ok) setName(null);
    setMessage(result.ok ? 'Nome aggiornato solo in memoria. Le task conservano il collegamento.' : result.message);
    setPending(false);
  }
  return <form className="rename-form" onSubmit={event => { event.preventDefault(); void save(); }}>
    <label htmlFor="project-name">Nome del progetto</label>
    <div className="form-row"><input id="project-name" value={name ?? project.name} maxLength={100} required onChange={event => setName(event.currentTarget.value)} disabled={pending} /><button className="button" disabled={pending}>Aggiorna nome</button></div>
    <p className="feedback" role="status">{message}</p>
  </form>;
}

export function ProjectPage() {
  const { projectId } = useParams();
  const { data } = useWorkspace();
  const project = data.projects.find(item => item.id === projectId);
  if (!project) return <PageHeading title="Progetto non trovato" description="Torna all’elenco dei progetti." />;
  return <>
    <Link className="back-link" to="/projects">← Tutti i progetti</Link>
    <PageHeading title={project.name} description={project.description} eyebrow="Progetto · attività collegate" />
    <section className="card"><h2>Attività</h2><TaskList tasks={tasksForProject(data, project.id)} /></section>
    <section className="card"><h2>Dettagli del progetto</h2><RenameProject key={project.id} project={project} /></section>
  </>;
}
