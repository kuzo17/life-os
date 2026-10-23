import type { Durability } from '../data/ports/workspace-repository';

export function saveConfirmation(durability: Durability) {
  return durability === 'local' ? 'Salvato in questo browser.' : 'Modifica solo in memoria.';
}
