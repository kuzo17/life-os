import type { Durability } from '../data/ports/workspace-repository';

export function saveConfirmation(durability: Durability) {
  if (durability === 'emulated') return 'Confermato nell’emulatore locale di prova.';
  if (durability === 'remote') return 'Conferma remota ricevuta.';
  return durability === 'local' ? 'Salvato in questo browser.' : 'Modifica solo in memoria.';
}
