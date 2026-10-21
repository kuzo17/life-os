import type { DeepReadonly } from '../../domain/shared/immutable';
import type { Result } from '../../domain/shared/result';
import type { Workspace } from '../../domain/workspace/model';

export type Durability = 'volatile' | 'local' | 'remote';

export interface WorkspaceVersion {
  readonly data: DeepReadonly<Workspace>;
  readonly revision: number;
  readonly durability: Durability;
  readonly undoLabel: string | null;
}

export interface WorkspaceRepository {
  // Dopo l'inizializzazione, lo snapshot in cache ha identità stabile fino a un commit.
  getSnapshot(): WorkspaceVersion;
  subscribe(listener: () => void): () => void;
  read(): Promise<WorkspaceVersion>;
  commit(input: { expectedRevision: number; next: Workspace; label: string }): Promise<Result<number>>;
  undo(expectedRevision: number): Promise<Result<number>>;
}
