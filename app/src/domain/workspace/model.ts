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
  time: string | null;
  priority: 'none' | 'medium' | 'high';
  sortOrder: number;
}

// Primo schema persistente locale. Non rappresenta ancora tutti i domini V1.
export interface Workspace {
  schemaVersion: 2;
  projects: Project[];
  tasks: Task[];
}

export type WorkspaceCommand =
  | Readonly<{ type: 'task.setCompleted'; id: string; completed: boolean }>
  | Readonly<{ type: 'project.rename'; id: string; name: string }>;
