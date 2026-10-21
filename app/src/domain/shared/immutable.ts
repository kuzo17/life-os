export type DeepReadonly<T> = T extends readonly (infer Item)[]
  ? readonly DeepReadonly<Item>[]
  : T extends object ? { readonly [Key in keyof T]: DeepReadonly<T[Key]> } : T;

export function cloneMutable<T>(value: DeepReadonly<T>): T {
  // structuredClone separa la proprietà del record; non è una conversione di schema.
  return structuredClone(value) as T;
}

// Record JSON, non Map/Set: anche il confine runtime controlla i campi ammessi.
export function deepFreeze<T>(value: T): DeepReadonly<T> {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value as DeepReadonly<T>;
}
