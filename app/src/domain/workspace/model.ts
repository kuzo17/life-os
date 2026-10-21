export interface Project {
  id: string;
  name: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  projectId: string | null;
  scheduledOn: string | null;
  completed: boolean;
}

// Primo contratto sintetico F1. Mapping e semantica V1 vengono verificati in F2.
export interface Workspace {
  schemaVersion: 1;
  projects: Project[];
  tasks: Task[];
}

export type WorkspaceCommand =
  | Readonly<{ type: 'task.setCompleted'; id: string; completed: boolean }>
  | Readonly<{ type: 'project.rename'; id: string; name: string }>;
