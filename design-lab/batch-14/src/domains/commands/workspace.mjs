import { requireText, requireValue } from '../../data/schema.mjs';
import { required } from "./entities.mjs";
export function workspaceHandlers(nextId) {
  return {
    'folder.save': (data, {
      id,
      name
    }) => {
      name = requireText(name, 'nome cartella', 55);
      requireValue(!data.homeFolders.some(row => row.id !== id && row.name.toLocaleLowerCase('it') === name.toLocaleLowerCase('it')), 'Esiste già una cartella con questo nome.');
      let entity = id ? required(data.homeFolders, id) : null;
      if (entity) entity.name = name;else {
        entity = {
          id: nextId('folder'),
          name,
          icon: '▤',
          color: 'blue',
          original: false
        };
        data.homeFolders.push(entity);
      }
      return {
        entity
      };
    },
    'folder.reorder': (data, {
      id,
      shift
    }) => {
      const entity = required(data.homeFolders, id),
        index = data.homeFolders.indexOf(entity),
        target = index + Number(shift);
      requireValue(Number.isInteger(target) && target >= 0 && target < data.homeFolders.length, 'Posizione non valida.');
      data.homeFolders.splice(index, 1);
      data.homeFolders.splice(target, 0, entity);
      return {
        entity
      };
    },
    'folder.delete': (data, {
      id
    }) => {
      const entity = required(data.homeFolders, id);
      requireValue(!entity.original && !data.projects.some(row => row.folderId === id), 'La cartella è originale o contiene progetti.');
      data.homeFolders.splice(data.homeFolders.indexOf(entity), 1);
      return {
        entity
      };
    },
    'project.save': (data, input) => {
      const name = requireText(input.name, 'nome progetto', 100);
      required(data.homeFolders, input.folderId);
      let entity = input.id ? required(data.projects, input.id) : null;
      if (!entity) {
        entity = {
          id: nextId('project'),
          glyph: name.slice(0, 2).toUpperCase(),
          color: '#4779ae'
        };
        data.projects.push(entity);
      }
      Object.assign(entity, {
        name,
        folderId: input.folderId,
        cat: input.cat?.trim() || 'Personale',
        desc: input.desc?.trim() || '',
        status: input.status || 'active'
      });
      return {
        entity
      };
    }
  };
}
