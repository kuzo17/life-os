import { requireText, requireValue } from '../../data/schema.mjs';
export const find = (rows, id) => rows.find(row => String(row.id) === String(id));
export function required(rows, id) {
  const record = find(rows, id);
  requireValue(Boolean(record), 'Elemento non trovato.');
  return record;
}
export function insertEntity(data, input, nextId) {
  const title = requireText(input.title, 'titolo');
  const kind = input.kind;
  const projectKinds = ['task', 'goal', 'weekly_goal', 'recurring', 'expense', 'note', 'link'];
  if (projectKinds.includes(kind)) required(data.projects, input.projectId);
  let entity, destination;
  if (kind === 'task') {
    destination = 'tasks';
    entity = {
      id: nextId('task'),
      title,
      projectId: input.projectId,
      priority: input.priority || 'media',
      when: input.when?.trim() || 'oggi',
      time: input.time?.trim() || '',
      done: false
    };
  } else if (kind === 'goal' || kind === 'weekly_goal') {
    destination = 'goals';
    entity = {
      id: nextId('goal'),
      title,
      projectId: input.projectId,
      scope: kind === 'weekly_goal' ? 'settimanale' : 'generale',
      done: false
    };
  } else if (kind === 'recurring') {
    destination = 'recurrences';
    entity = {
      id: nextId('recur'),
      title,
      projectId: input.projectId,
      rule: input.extra?.trim() || 'Frequenza da definire',
      streak: 0,
      active: true
    };
  } else if (kind === 'expense') {
    destination = 'expenses';
    entity = {
      id: nextId('expense'),
      title,
      projectId: input.projectId,
      amount: Number(input.amount),
      date: input.when?.trim() || 'Da definire',
      paid: false
    };
  } else if (kind === 'note' || kind === 'link') {
    destination = 'notes';
    entity = {
      id: nextId('note'),
      title,
      projectId: input.projectId,
      body: input.extra?.trim() || '',
      kind: kind === 'link' ? 'link' : 'nota'
    };
  } else {
    destination = 'inbox';
    entity = {
      id: nextId('inbox'),
      text: `${kind || 'idea'}: ${title}`,
      type: kind || 'idea'
    };
  }
  data[destination].unshift(entity);
  return {
    entity,
    destination
  };
}
export function entityHandlers(nextId) {
  return {
    'capture.create': (data, input) => insertEntity(data, input, nextId),
    'capture.batch': (data, {
      items
    }) => {
      requireValue(Array.isArray(items) && items.length > 0, 'La cattura è vuota.');
      const created = items.map(item => insertEntity(data, item, nextId));
      return {
        count: created.length,
        created
      };
    },
    'inbox.park': (data, {
      text,
      type = 'idea'
    }) => {
      const entity = {
        id: nextId('inbox'),
        text: requireText(text, 'testo Inbox'),
        type
      };
      data.inbox.unshift(entity);
      return {
        entity
      };
    },
    'inbox.triage': (data, {
      id,
      input
    }) => {
      const source = required(data.inbox, id);
      requireValue(['task', 'note', 'link'].includes(input.kind), 'Destinazione non supportata.');
      const result = insertEntity(data, {
        ...input,
        title: input.title || source.text
      }, nextId);
      data.inbox.splice(data.inbox.indexOf(source), 1);
      return {
        source,
        ...result
      };
    },
    'entity.toggle': (data, {
      collection,
      id
    }) => {
      const field = {
        tasks: 'done',
        goals: 'done',
        recurrences: 'active',
        expenses: 'paid'
      }[collection];
      requireValue(Boolean(field), 'Collezione non modificabile.');
      const entity = required(data[collection], id);
      entity[field] = !entity[field];
      return {
        entity
      };
    },
    'entity.delete': (data, {
      collection,
      id
    }) => {
      requireValue(['tasks', 'goals', 'recurrences', 'expenses', 'notes', 'inbox'].includes(collection), 'Collezione non eliminabile.');
      const entity = required(data[collection], id);
      data[collection].splice(data[collection].indexOf(entity), 1);
      return {
        entity
      };
    },
    'task.update': (data, {
      id,
      patch
    }) => {
      const entity = required(data.tasks, id);
      for (const key of ['title', 'projectId', 'priority', 'when', 'time']) if (Object.hasOwn(patch, key)) entity[key] = patch[key];
      return {
        entity
      };
    },
    'agenda.bulk': (data, {
      action,
      ids,
      when
    }) => {
      const selected = new Set(ids.map(String));
      const rows = data.tasks.filter(row => selected.has(String(row.id)));
      requireValue(rows.length > 0 && rows.length === selected.size, 'La selezione contiene task mancanti.');
      if (action === 'move') for (const row of rows) row.when = requireText(when, 'giorno');else if (action === 'duplicate') data.tasks.unshift(...rows.map(row => ({
        ...row,
        id: nextId('task'),
        title: `${row.title} · copia`,
        done: false
      })));else if (action === 'delete') data.tasks = data.tasks.filter(row => !selected.has(String(row.id)));else throw new Error('Operazione Agenda non supportata.');
      return {
        count: rows.length
      };
    }
  };
}
