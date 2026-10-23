import type { Workspace } from '../../domain/workspace/model';

export interface StoredWorkspace { revision: number; data: Workspace }

// Il confronto e la scrittura devono condividere una singola transazione.
export interface AtomicWorkspaceStorage {
  read(): Promise<StoredWorkspace>;
  compareAndSwap(expectedRevision: number, next: Workspace): Promise<StoredWorkspace | null>;
  close(): void;
}
