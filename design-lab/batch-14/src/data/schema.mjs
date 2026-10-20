export function requireValue(condition, message) {
  if (!condition) throw new Error(message);
}
export function requireText(value, label, max = 180) {
  const result = String(value ?? '').trim();
  requireValue(result.length > 0 && result.length <= max, `Controlla ${label}.`);
  return result;
}
export function validateSnapshot(data) {
  const collections = ['homeFolders', 'projects', 'tasks', 'inbox', 'goals', 'recurrences', 'expenses', 'notes', 'inventory', 'tx', 'incomeSources'];
  for (const key of collections) {
    const rows = data[key];
    requireValue(Array.isArray(rows), `Collezione non valida: ${key}.`);
    requireValue(rows.every(row => row.id !== null && row.id !== undefined && String(row.id).length > 0), `ID mancante: ${key}.`);
    requireValue(new Set(rows.map(row => String(row.id))).size === rows.length, `ID duplicato: ${key}.`);
  }
  const folders = new Set(data.homeFolders.map(row => row.id));
  const projects = new Set(data.projects.map(row => row.id));
  for (const project of data.projects) {
    requireText(project.name, 'nome progetto', 100);
    requireValue(folders.has(project.folderId), 'Cartella progetto non valida.');
    requireValue(['active', 'planning', 'archived'].includes(project.status), 'Stato progetto non valido.');
  }
  for (const key of ['tasks', 'goals', 'recurrences', 'expenses', 'notes']) {
    for (const row of data[key]) {
      requireValue(projects.has(row.projectId), `Progetto mancante: ${key}.`);
      requireText(row.title, 'titolo');
    }
  }
  for (const task of data.tasks) {
    requireValue(['alta', 'media', 'bassa', 'none'].includes(task.priority), 'Priorità non valida.');
    requireValue(typeof task.done === 'boolean', 'Stato task non valido.');
  }
  for (const item of data.inventory) {
    requireText(item.title, 'nome articolo');
    requireValue(['cards', 'vinted'].includes(item.kind), 'Catalogo non valido.');
    requireValue(['available', 'sold'].includes(item.status), 'Stato articolo non valido.');
    requireValue(Number.isInteger(item.quantity) && item.quantity > 0, 'Quantità non valida.');
    requireValue([item.acquisition, item.estimate, item.ask].every(value => Number.isFinite(value) && value >= 0), 'Valore articolo non valido.');
  }
  for (const expense of data.expenses) requireValue(Number.isFinite(expense.amount) && expense.amount >= 0, 'Importo spesa non valido.');
  for (const tx of data.tx) {
    requireText(tx.name, 'descrizione movimento');
    requireValue(['in', 'out'].includes(tx.type) && Number.isFinite(tx.amount) && tx.amount > 0, 'Movimento non valido.');
  }
}
