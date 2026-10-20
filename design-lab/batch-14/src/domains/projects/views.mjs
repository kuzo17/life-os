import { safe, eur, sectionHead, headline, miniStat } from "../../shared/patterns.mjs";
import { projectById, projectTasks, projectMetric, folderById, folderName, folderCount } from "../workspace/selectors.mjs";
import { renderTaskRow } from "../tasks/views.mjs";
import { dialog } from "../../shared/feedback.mjs";
import { state } from "../../app/ui-state.mjs";
import { projects, tasks, projectGoals, recurrences, projectExpenses, projectNotes, homeFolders } from "../../data/runtime.mjs";
function projectCard(p) {
  const m = projectMetric(p);
  return '<article class="card project" role="button" tabindex="0" data-project="' + p.id + '" aria-label="Apri workspace ' + safe(p.name) + '">' + '<div class="project-art" style="--grad:linear-gradient(115deg,' + p.color + ',color-mix(in srgb,' + p.color + ' 62%,#182d50))"><span class="project-glyph">' + safe(p.glyph) + '</span><span class="pill" style="background:#ffffff35;color:#fff">' + safe(p.cat) + '</span></div>' + '<div class="project-core"><h3>' + safe(p.name) + '</h3><p>' + safe(p.desc) + '</p>' + '<div class="progress" style="--pct:' + (m.pct ?? 0) + '%;--shade:' + p.color + '"><i></i></div><div class="project-foot"><span>' + m.n + ' task nella demo</span><b>' + (m.pct === null ? "—" : m.pct + "%") + '</b></div></div></article>';
}
function projectParitySection(projectId, section) {
  const add = '<button class="button small" data-project-entity-add="' + section + '" data-project-id="' + projectId + '">+ Aggiungi</button>';
  if (section === "goals") {
    const rows = projectGoals.filter(x => x.projectId === projectId);
    return sectionHead("Obiettivi", add) + '<div class="card parity-list">' + (rows.length ? rows.map(x => '<div class="parity-row ' + (x.done ? 'done' : '') + '"><button class="check ' + (x.done ? 'done' : '') + '" data-goal-toggle="' + x.id + '" aria-label="' + (x.done ? 'Riapri' : 'Completa') + ' obiettivo">✓</button><div class="body"><b>' + safe(x.title) + '</b><div class="sub">' + (x.scope === "settimanale" ? 'Obiettivo settimanale' : 'Obiettivo generale') + ' · demo in memoria</div></div><button class="button small" data-entity-delete="goal" data-entity-id="' + x.id + '">Elimina</button></div>').join('') : '<div class="empty">Nessun obiettivo demo per questo progetto.</div>') + '</div>';
  }
  if (section === "recur") {
    const rows = recurrences.filter(x => x.projectId === projectId);
    return sectionHead("Ricorrenti", add) + '<div class="card parity-list">' + (rows.length ? rows.map(x => '<div class="parity-row"><button class="check ' + (x.active ? 'done' : '') + '" data-recur-toggle="' + x.id + '" aria-label="' + (x.active ? 'Sospendi' : 'Riattiva') + ' ricorrenza">✓</button><div class="body"><b>' + safe(x.title) + '</b><div class="sub">' + safe(x.rule) + ' · streak ' + x.streak + ' · ' + (x.active ? 'attiva' : 'in pausa') + '</div></div><button class="button small" data-entity-delete="recur" data-entity-id="' + x.id + '">Elimina</button></div>').join('') : '<div class="empty">Nessuna regola ricorrente demo.</div>') + '</div>';
  }
  if (section === "expenses") {
    const rows = projectExpenses.filter(x => x.projectId === projectId);
    return sectionHead("Spese pianificate", add) + '<div class="card parity-list">' + (rows.length ? rows.map(x => '<div class="parity-row ' + (x.paid ? 'done' : '') + '"><button class="check ' + (x.paid ? 'done' : '') + '" data-expense-toggle="' + x.id + '" aria-label="' + (x.paid ? 'Segna non pagata' : 'Segna pagata') + '">✓</button><div class="body"><b>' + safe(x.title) + '</b><div class="sub">Scadenza ' + safe(x.date) + ' · ' + (x.paid ? 'pagata' : 'da pagare') + ' · nessun movimento creato</div></div><b>' + eur(x.amount) + '</b></div>').join('') : '<div class="empty">Nessuna spesa pianificata demo.</div>') + '<div class="hint-box">Segnare “pagata” cambia solo questa vista demo: non crea un movimento e non tocca asset o saldi.</div></div>';
  }
  const rows = projectNotes.filter(x => x.projectId === projectId);
  return sectionHead("Note & risorse", add) + '<div class="card parity-list">' + (rows.length ? rows.map(x => '<div class="parity-row"><span class="chip violet">' + safe(x.kind) + '</span><div class="body"><b>' + safe(x.title) + '</b><div class="sub">' + safe(x.body) + '</div></div><button class="button small" data-entity-delete="note" data-entity-id="' + x.id + '">Elimina</button></div>').join('') : '<div class="empty">Nessuna nota o risorsa demo.</div>') + '</div>';
}
function projectWorkspace() {
  const p = projectById(state.projectId);
  if (!p) {
    state.projectId = null;
    return viewProjects();
  }
  const m = projectMetric(p),
    id = p.id;
  const sections = [["tasks", "Task"], ["goals", "Obiettivi"], ["recur", "Ricorrenti"], ["expenses", "Spese"], ["notes", "Note & link"]];
  const nav = '<div class="workspace-tabs" role="group" aria-label="Sezioni del progetto">' + sections.map(([k, label]) => '<button class="tab ' + (state.projectSection === k ? 'active' : '') + '" data-workspace-tab="' + k + '">' + label + '</button>').join("") + '</div>';
  let body = '';
  if (state.projectSection === "tasks") {
    const pTasks = projectTasks(id);
    body = '<div class="project-content"><div>' + sectionHead("Attività del progetto", "Record unici: presenti anche in Oggi e Agenda quando pertinenti") + '<div class="card">' + (pTasks.length ? pTasks.map(t => renderTaskRow(t, false)).join("") : '<div class="empty">Nessuna task nella demo. Il progetto reale potrebbe averne molte.</div>') + '<button class="button small" style="margin-top:14px" data-add-project-task="' + id + '">+ Task nel progetto</button></div></div>' + '<div>' + sectionHead("Organizzazione", "Contesto senza aprire pannelli") + '<div class="card">' + '<div class="work-stat"><span>Task totali nella demo</span><b>' + m.n + '</b></div><div class="work-stat"><span>Completate</span><b>' + m.done + '</b></div><div class="work-stat"><span>Da completare</span><b>' + (m.n - m.done) + '</b></div>' + '<div class="hint-box" style="margin-top:15px">Nella V2 questa area include viste Lista, Board, Priorità e Scadenze, con filtri salvati. Nessuna delle funzioni originali viene eliminata.</div></div></div></div>';
  } else body = '<div class="demo-contract"><span>◎</span><div><b>UX navigabile, dati sintetici.</b> Le modifiche vivono solo in memoria e si azzerano al reload. Nessuna sincronizzazione, Firebase o registrazione finanziaria.</div></div>' + projectParitySection(id, state.projectSection);
  return '<div class="workspace-breadcrumb"><button class="crumb-link" data-projects-back>Cartelle</button><span>›</span><button class="crumb-link" data-folder-back>' + safe(folderName(p.folderId)) + '</button><span>›</span><b>' + safe(p.name) + '</b></div>' + '<div class="project-identity"><div class="project-emblem" style="background:' + p.color + '">' + safe(p.glyph) + '</div><div><div class="eyebrow">WORKSPACE / ' + safe(p.cat) + '</div><h1>' + safe(p.name) + '</h1><p class="muted small">' + safe(p.desc) + '</p></div><div class="project-identity-actions"><button class="button small" data-project-organize="' + id + '">⚙ Organizza</button><button class="button small" data-folder-back>← Torna alla cartella</button></div></div>' + '<div class="workspace-kpis"><div class="card"><div class="stat-label">Avanzamento task nella demo</div><div class="statnum">' + (m.pct === null ? "—" : m.pct + "%") + '</div><div class="progress" style="--pct:' + (m.pct ?? 0) + '%;--shade:' + p.color + '"><i></i></div></div>' + '<div class="card"><div class="stat-label">Task</div><div class="statnum">' + m.n + '</div><div class="small muted">Singola fonte di verità</div></div>' + '<div class="card"><div class="stat-label">Stato</div><div class="statnum" style="font-size:18px;margin:17px 0">' + (p.status === "active" ? "Attivo" : p.status === "archived" ? "Archiviato" : "Pianificato") + '</div><div class="small muted">Label dimostrativa</div></div></div>' + nav + body;
}
function addProjectEntity(kind, projectId) {
  const p = projectById(projectId);
  if (!p) return;
  const labels = {
    goals: "Nuovo obiettivo",
    recur: "Nuova ricorrenza",
    expenses: "Nuova spesa pianificata",
    notes: "Nuova nota o risorsa"
  };
  let extra = '';
  if (kind === "goals") extra = '<label class="field-label" for="entity-extra">Tipo</label><select class="field" id="entity-extra"><option value="generale">Generale</option><option value="settimanale">Settimanale</option></select>';
  if (kind === "recur") extra = '<label class="field-label" for="entity-extra">Frequenza</label><input class="field" id="entity-extra" required placeholder="Es. ogni lunedì">';
  if (kind === "expenses") extra = '<label class="field-label" for="entity-amount">Importo €</label><input class="field" id="entity-amount" type="number" min="0" step="0.01" required><label class="field-label" for="entity-extra">Scadenza</label><input class="field" id="entity-extra" required placeholder="Es. 28 ott">';
  if (kind === "notes") extra = '<label class="field-label" for="entity-note-kind">Tipo</label><select class="field" id="entity-note-kind"><option value="nota">Nota</option><option value="link">Link / risorsa</option></select><label class="field-label" for="entity-extra">Contenuto</label><textarea class="field" id="entity-extra" required></textarea>';
  dialog(labels[kind] || "Nuovo elemento", '<form id="project-entity-form" data-entity-kind="' + kind + '" data-project-id="' + projectId + '"><p class="small muted">' + safe(p.name) + ' · demo locale non persistita</p><label class="field-label" for="entity-title">Titolo</label><input class="field" id="entity-title" required maxlength="120">' + extra + '<div class="modal-actions"><button class="button" type="button" data-close>Annulla</button><button class="button primary" type="submit">Aggiungi alla demo</button></div></form>');
}
function folderOptions(selected) {
  return homeFolders.map(f => '<option value="' + safe(f.id) + '" ' + (selected === f.id ? 'selected' : '') + '>' + safe(f.name) + '</option>').join('');
}
function manageFolders() {
  dialog("Gestisci cartelle", '<p class="small muted" style="line-height:1.7">Cartelle con ID stabili. Puoi modificarne ordine e nome senza scollegare i progetti.</p>' + '<div class="folder-manager">' + homeFolders.map((f, i) => '<div class="folder-manager-row"><span class="folder-manager-glyph">' + f.icon + '</span>' + '<div class="body"><b>' + safe(f.name) + '</b><div class="sub">' + folderCount(f.id) + ' progetti</div></div>' + '<button class="button small" data-folder-shift="' + f.id + '" data-shift="-1" ' + (i === 0 ? 'disabled' : '') + '>↑</button>' + '<button class="button small" data-folder-shift="' + f.id + '" data-shift="1" ' + (i === homeFolders.length - 1 ? 'disabled' : '') + '>↓</button>' + '<button class="button small" data-folder-rename="' + f.id + '">Rinomina</button>' + (!f.original ? '<button class="button small" data-folder-delete="' + f.id + '">Elimina</button>' : '') + '</div>').join('') + '</div>' + '<div class="modal-actions"><button class="button" data-close>Chiudi</button><button class="button primary" data-folder-create>+ Cartella</button></div>');
}
function editFolder(id) {
  const f = folderById(id);
  dialog(f ? "Rinomina cartella" : "Nuova cartella", '<form id="folder-edit-form" data-folder-id="' + safe(f?.id || "") + '">' + '<label class="field-label" for="folder-name">Nome</label><input class="field" id="folder-name" maxlength="55" required value="' + safe(f?.name || "") + '">' + '<div class="modal-actions"><button class="button" type="button" data-folder-manage>Indietro</button><button class="button primary" type="submit">' + (f ? "Salva nome" : "Crea cartella") + '</button></div></form>');
}
function editProject(id, folderId) {
  const p = id ? projectById(id) : null;
  dialog(p ? "Organizza progetto" : "Nuovo progetto", '<form id="project-edit-form" data-project-id="' + safe(p?.id || "") + '">' + '<label class="field-label" for="project-name">Nome</label><input class="field" id="project-name" maxlength="80" required value="' + safe(p?.name || "") + '">' + '<label class="field-label" for="project-folder">Cartella</label><select class="field" id="project-folder">' + folderOptions(p?.folderId || folderId) + '</select>' + '<label class="field-label" for="project-category">Categoria</label><input class="field" id="project-category" maxlength="50" value="' + safe(p?.cat || "Personale") + '">' + '<label class="field-label" for="project-status">Stato</label><select class="field" id="project-status">' + [['active', 'Attivo'], ['planning', 'Pianificato'], ['archived', 'Archiviato']].map(([v, n]) => '<option value="' + v + '" ' + ((p?.status || "active") === v ? 'selected' : '') + '>' + n + '</option>').join('') + '</select>' + '<label class="field-label" for="project-desc">Descrizione</label><textarea class="field" id="project-desc" maxlength="240">' + safe(p?.desc || "") + '</textarea>' + '<div class="modal-actions"><button type="button" class="button" data-close>Chiudi</button><button type="submit" class="button primary">Salva nella demo</button></div></form>' + '<p class="small muted" style="margin-top:12px">Archiviare non elimina le task del progetto.</p>');
}
function viewFolderHome() {
  return headline("Cartelle", "Apri una cartella per esplorare i progetti: la navigazione non si ferma a una griglia unica.", "WORKSPACE / ORGANIZZAZIONE", '<button class="button title-action" data-folder-manage>⚙ Gestisci cartelle</button>') + '<div class="folder-grid-b05">' + homeFolders.map((f, i) => '<button class="folder-card-b05 folder-' + f.color + '" data-folder="' + safe(f.id) + '"><span class="folder-icon-b05">' + f.icon + '</span><span class="folder-n-b05">0' + (i + 1) + '</span><h2>' + safe(f.name) + '</h2><div class="folder-bottom-b05">' + folderCount(f.id) + ' progetti demo <span>↗</span></div></button>').join("") + '</div>' + '<p class="small muted" style="margin:19px 0;line-height:1.7">Cartelle originali V1. I contenuti sono dimostrativi: i progetti personalizzati e il loro archivio verranno migrati privatamente, non pubblicati in questo laboratorio.</p>';
}
function viewProjects() {
  if (!state.projectId && !state.folderId) return viewFolderHome();
  if (state.projectId) return projectWorkspace();
  const filtered = projects.filter(p => p.folderId === state.folderId && (state.projectFilter === "all" || p.status === state.projectFilter) && p.name.toLocaleLowerCase("it").includes(state.projectQuery.toLocaleLowerCase("it")));
  const active = projects.filter(p => p.status === "active").length;
  const completed = tasks.filter(t => t.done).length;
  return '<div class="workspace-breadcrumb"><button class="crumb-link" data-projects-back>Cartelle</button><span>›</span><b>' + safe(folderName(state.folderId)) + '</b></div>' + headline(folderName(state.folderId), "Apri un progetto di questa cartella per esplorarne le sezioni.", "CARTELLA / PROGETTI") + '<div class="grid c3">' + miniStat("Aree progetto", String(projects.length), "Stessa struttura originale", "cyan", "▦") + miniStat("Task demo", String(tasks.length), completed + " completate", "blue", "✓") + miniStat("Workspace attivi", String(active), "Stato dimostrativo", "violet", "◈") + '</div>' + '<div class="section-head"><h2>Esplora i workspace</h2><div class="action-row"><button class="button small" data-project-create="' + state.folderId + '">+ Nuovo progetto</button><button class="button small" data-folder-manage>⚙ Cartelle</button></div></div>' + '<div class="action-row" style="align-items:center"><input class="search" id="project-search" value="' + safe(state.projectQuery) + '" placeholder="⌕ Cerca un progetto..." aria-label="Cerca progetti">' + '<button class="tab ' + (state.projectFilter === "all" ? "active" : "") + '" data-project-filter="all">Tutti</button><button class="tab ' + (state.projectFilter === "active" ? "active" : "") + '" data-project-filter="active">Attivi</button><button class="tab ' + (state.projectFilter === "planning" ? "active" : "") + '" data-project-filter="planning">Pianificati</button><button class="tab ' + (state.projectFilter === "archived" ? "active" : "") + '" data-project-filter="archived">Archivio</button><button class="button small" data-action="project-layout">' + (state.projectView === "grid" ? "☰ Vista lista" : "▦ Vista bento") + '</button></div>' + '<div class="project-catalog ' + (state.projectView === "list" ? "list-layout" : "") + '" id="project-cards">' + (filtered.length ? filtered.map(projectCard).join("") : '<div class="empty">Nessun workspace trovato.</div>') + '</div>' + '<div class="hint-box" style="margin-top:20px">Questo è un prototipo di navigazione e design. Le 14 aree sono derivate dalla struttura V1, ma task e percentuali mostrate qui sono dati fittizi. I contenuti originali completi saranno preservati nella V2.</div>';
}
export { projectCard, projectParitySection, projectWorkspace, addProjectEntity, folderOptions, manageFolders, editFolder, editProject, viewFolderHome, viewProjects };
