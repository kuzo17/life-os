import { requireText, requireValue } from '../../data/schema.mjs';
import { required } from './entities.mjs';
export function catalogFinanceHandlers(nextId) {
  return {
    'inventory.save': (data, input) => {
      const entity = input.id ? required(data.inventory, input.id) : {
        id: nextId('item'),
        kind: input.kind
      };
      const allowed = ['title', 'detail', 'quantity', 'acquisition', 'estimate', 'ask', 'status'];
      for (const key of allowed) if (Object.hasOwn(input, key)) entity[key] = input[key];
      entity.title = requireText(entity.title, 'nome articolo');
      if (!input.id) data.inventory.unshift(entity);
      return {
        entity
      };
    },
    'finance.sourceMode': (data, {
      id
    }) => {
      const entity = required(data.incomeSources, id);
      requireValue(id === 'shop', 'Fonte non configurabile.');
      entity.mode = entity.mode === 'fixed' ? 'variable' : 'fixed';
      return {
        entity
      };
    },
    'finance.transaction': (data, input) => {
      const entity = {
        id: nextId('tx'),
        name: requireText(input.name, 'descrizione movimento'),
        amount: Number(input.amount),
        type: input.type,
        date: 'Adesso'
      };
      data.tx.unshift(entity);
      return {
        entity
      };
    }
  };
}
