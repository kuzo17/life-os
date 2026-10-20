import { store } from '../../data/runtime.mjs';
import { createCommandBus } from './bus.mjs';
export const commands = createCommandBus(store);
// Compatibility name for the existing views; both names expose the same command service.
export const operationalCore = commands;
