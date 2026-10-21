import { createContext, useContext, useSyncExternalStore } from 'react';
import type { Runtime } from './runtime';

export const WorkspaceContext = createContext<Runtime | null>(null);

function useContextRuntime(): Runtime {
  const runtime = useContext(WorkspaceContext);
  if (!runtime) throw new Error('Runtime non inizializzato.');
  return runtime;
}

export function useRuntime(): Pick<Runtime, 'workspace' | 'referenceDay'> {
  const { workspace, referenceDay } = useContextRuntime();
  return { workspace, referenceDay };
}

export function useWorkspace() {
  const { repository } = useContextRuntime();
  return useSyncExternalStore(repository.subscribe, repository.getSnapshot, repository.getSnapshot);
}
