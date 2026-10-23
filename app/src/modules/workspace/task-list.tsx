import { useState } from 'react';
import { Link } from 'react-router';
import type { DeepReadonly } from '../../domain/shared/immutable';
import type { Task } from '../../domain/workspace/model';
import { useRuntime, useWorkspace } from '../../app/workspace-context';
import { saveConfirmation } from '../../application/save-confirmation';

export function TaskList({ tasks }: { tasks: readonly DeepReadonly<Task>[] }) {
  const { workspace } = useRuntime();
  const { data, durability, revision } = useWorkspace();
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  async function complete(task: DeepReadonly<Task>, completed: boolean) {
    setPending(task.id);
    setMessage('Salvataggio…');
    const result = await workspace.execute({ type: 'task.setCompleted', id: task.id, completed }, revision);
    setMessage(result.ok ? `Stato aggiornato. ${saveConfirmation(durability)}` : result.message);
    setPending(null);
  }

  if (tasks.length === 0) return <p className="empty-state">Nessuna task in questo spazio.</p>;
  return <>
    <ul className="task-list">{tasks.map(task => {
      const project = data.projects.find(item => item.id === task.projectId);
      return <li key={task.id} data-task-id={task.id}>
        <label className="task-check"><input type="checkbox" checked={task.completed} disabled={pending !== null} onChange={event => { void complete(task, event.currentTarget.checked); }} /><span className={task.completed ? 'task-completed' : ''}>{task.title}</span></label>
        {(task.time || task.priority !== 'none') && <span className="task-details">{[task.time, task.priority === 'high' ? 'Priorità alta' : task.priority === 'medium' ? 'Priorità media' : null].filter(Boolean).join(' · ')}</span>}
        {project ? <Link className="project-tag" to={`/projects/${project.id}`}>{project.name}</Link> : <span className="project-tag">Senza progetto</span>}
      </li>;
    })}</ul>
    <p className="feedback" role="status">{message}</p>
  </>;
}
