import { Link } from 'react-router';
import { useWorkspace } from '../../app/workspace-context';
import { PageHeading } from '../../ui/page-heading';
import { tasksForProject, completion } from '../../domain/workspace/selectors';

export function ProjectsPage() {
  const { data } = useWorkspace();
  return <><PageHeading title="Progetti" description="Un posto per ogni direzione. Questi progetti sono interamente sintetici." />
    <div className="project-grid">{data.projects.map((project, index) => {
      const tasks = tasksForProject(data, project.id);
      const { total, completed } = completion(tasks);
      return <Link className="card project-card" key={project.id} to={`/projects/${project.id}`}>
        <span className="project-mark" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h2>{project.name}</h2><p>{project.description}</p>
        <span>{total - completed} attività aperte <span aria-hidden="true">↗</span></span>
      </Link>;
    })}</div>
  </>;
}
