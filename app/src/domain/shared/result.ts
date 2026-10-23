export type FailureCode = 'invalid' | 'conflict' | 'busy' | 'empty-history' | 'unavailable' | 'uncertain';
export type Failure = Readonly<{ ok: false; code: FailureCode; message: string }>;
export type Result<T> = Readonly<{ ok: true; value: T }> | Failure;

export class DomainError extends Error {}
export class UncertainWriteError extends Error {}

export function failure(code: FailureCode, message: string): Failure {
  return Object.freeze({ ok: false, code, message });
}

export function safeFailure(error: unknown): Failure {
  if (error instanceof UncertainWriteError) return failure('uncertain', 'Conferma non ricevuta. Rileggi prima di riprovare: il salvataggio potrebbe essere avvenuto.');
  return error instanceof DomainError
    ? failure('invalid', error.message)
    : failure('unavailable', 'Operazione non riuscita. Nessuna modifica applicata.');
}
