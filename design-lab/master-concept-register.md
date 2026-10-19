## Batch 07 — Scheletro UI + dominio (2026-10-19)

**Realizzato come PROTOTIPO, non come V2 pronta:**
- Routing con path profondi per cartelle, workspace, Agenda, FitOS, fonti finanza, inventario; sincronizzazione History API.
- Gestione demo cartelle con ID stabili, nome editabile, ordinamento, protezione da cancellazione se non vuote.
- Gestione demo progetti con creazione, spostamento tra cartelle, archiviazione che mantiene i task.
- Collezioni Carte/Vinted con pagine catalogo e item leaf, filtri di stato, quantità, costi/stime.
- Nuovo `architecture/workspace-core.mjs` indipendente dalla UI con comandi puri e test di integrità; **non ancora integrato nell'interfaccia e non contiene Firebase**.

**Decisioni di struttura da mantenere:** folderId/projectId sempre stabili; task canoniche con `dueDate` ISO nella V2 reale; navigazione a pagine nei rami e pannelli sulle foglie; valori inventario non accreditati al conto al semplice cambio stato; stessa logica per Quick Add e linguaggio naturale; priorità al 100% delle funzioni V1.

**Prossimi lavori di sostanza:** collegamento reale dei moduli al layer dominio (test), dati/date ISO e ricorrenti, gestione completa delle 14 aree legacy + custom, flussi FitOS e finanza riconciliabili, test visuali con mobile. Le funzionalità ancora non implementate restano nella [matrice non regressione](non-regression-matrix.md). [Registro Batch 07](batch-07/README.md).

---

## Progresso Visual Lab — Batch 06 (2026-10-19)

**LAB / non implementazione V2:** abbiamo spostato la progettazione di Agenda, FitOS e Finanze da schermate dimostrative statiche a percorsi visuali a più livelli: pagina di navigazione → sottosezione → eventuale pannello finale. Abbiamo preservato i temi Aurora Neo-Swiss/Prism Bento, la home a cartelle e il modello a singola task collegata a progetto/priorità/data nella demo.

**Idee/decisioni ancora da validare prima della V2 reale:**
- Progettare routing profondo con Back/Forward del browser, breadcrumb e persistenza degli stati filtri.
- Agenda con vere date ISO, regole ricorrenti, operazioni in massa e spostamenti/duplicazioni legittimi.
- FitOS con catalogo reale, log serie, storico, recuperi nel background, sessioni interrotte e template separati.
- Finanze per fonte reddituale con ledger/payout riconciliati e trattamento di inventario, liquidità e profitto senza doppio conteggio.
- Cartelle con custom, archivio, ordinamento e recupero progetti con override orfani da backup (nessun dato privato nel prototipo).
- QA visuale su browser, touchscreen, accessibilità e verifiche di contrasto.
- Lo studio Focus attuale è indipendente dalla scheda del giorno selezionata: collegare la vera sessione alla scheda sarà un requisito V2, non qualcosa già completato.

Vedi [Batch 06](batch-06/README.md) per test statici e limiti. Tutti i concept e le funzionalità V1 già riportati nel registro e nella matrice non regressione restano vincolanti: **nessun downgrade funzionale**.

---

# LifeOS — Master Concept Register / Visual Lab

**Version:** 2026-10-10 · **Owner decision:** design-first phase, functionality preserved as a hard constraint.

## NON-NEGOTIABLE CONTRACT

1. **100% V1 feature parity** as an acceptance baseline, not the ambition ceiling. Existing features are never replaced by a pretty but less capable screen.
2. **V1 audit before implementation, not after**. `non-regression-matrix.md` and `fitos-focus-parity-audit.md` form the starting checklist; V1 code inventory and real backup-data mapping still need finishing.
3. **Design mode only in Visual Lab.** No write to `main` or `lifeos-v2`; isolated branch `lifeos-visual-lab`, artificial data, no Firebase access or credentials.
4. **Modes of one app:** Aurora Neo-Swiss night and Prism Bento day; common tokens, components, interaction semantics and navigational structure.
5. **Pages for branches, sheets for leaves:** the navigation hierarchy should expand through pages in middle levels; side sheets/modals belong mostly to leaf item viewing/editing. Exceptions: global quick actions.
6. **Task single source of truth:** each task must keep stable `projectId`, priority, date, source metadata, state, and optional goal/recurrence link; Oggi, Agenda, search and project view are *views of the same record*, not duplicated task databases.
7. **Quick Add is not downgraded:** preserve every real V1 capture entity; natural language is a second entrance, not a replacement. No YAML required for everyday use. An ambiguous project/date or financial intent is clarified before commit. Production AI transcription and direct chat import require explicit integration and user authorization.
8. **No deceptive completeness:** lab mocks label invented data, static-only states and missing capabilities clearly. UI approval ≠ backend release readiness.

## Decisions adopted / frozen

| ID | Decision | Why | Status |
|---|---|---|---|
| D-01 | Dark = Aurora Neo-Swiss | premium, disciplined futuristic aesthetics | Approved design direction |
| D-02 | Light = Prism Bento | high-contrast color-block, adult, strong palette | Approved design direction |
| D-03 | Swiss type + modular functional Bento | fast scanning, dense information without noise | Approved direction |
| D-04 | Maintain 100% V1 capabilities, then improve | stop feature regression | Mandatory |
| D-05 | Leaf-only contextual panel pattern | prevents an overlong panel-based navigation tunnel | Approved principle |
| D-06 | Structured Quick Add + conversational capture + Inbox | distinct roles, same command layer | Proposed architecture |
| D-07 | Assign capture to project, date, priority, type, and optional goal | enables correct project progress | Mandatory functional design |
| D-08 | Finance: income sources ≠ assets ≠ transactions ≠ inventory | prevents double counting | Mandatory functional design |
| D-09 | Adapt dashboard without unpredictable auto-reordering | stable muscle memory | Approved principle |
| D-10 | FitOS must match full V1 guided workouts, then improve | Focus V1 is already sophisticated | Mandatory |
| D-11 | UI exploration separated from production data | privacy and preservation | Mandatory |
| D-12 | Design-first now; per-module peak review later | preserve momentum without losing ideas | Current plan |

## Status legend

- **APPROVED:** user-established design constraint.
- **P0 / P1 / P2:** prioritized proposal, NOT delivered functionality.
- **LAB:** shown or partially simulated in Visual Lab; not production.
- **AUDIT:** V1 exists, needs full line-by-line/test coverage.
- **FUTURE:** idea intentionally deferred until after core design.

## P0 — Must be designed without regression

### Oggi
- Stable action-first dashboard; priority, current/next task, calendar context.
- Daily + recurring + overdue tasks, goals and habits with their existing semantics.
- Same task reflects project and priority, not a detached dashboard clone.
- Per-widget show/hide and density; no chaotic automatic reflow of primary actions.
- Fast complete, undo, postpone, change project, edit priority without going into project.
- Resume ongoing session / important current action without presenting false persistence.
- Useful empty, loading, error, offline, and sync states.

### Projects and task model
- Preserve project hierarchy/folders, custom projects, all 14 seeded special projects, order and archive.
- Branch pages: Projects → Project workspace → Task board / Objectives / Recurrence / Expenses / Notes → leaf details.
- Adjustable view: Bento/cards, compact list, board and linked goals.
- Real relationship from a task to `projectId`, `goalId?`, `dueDate?`, `priority`, `recurrenceRuleId?`.
- Project progress metrics based on canonical task/goal records; never increment artificial counters from a duplicate task.
- Intelligent grouping by due date, priority and workstream with filters preserved.
- Bulk edit, batch dates, priority, category, undo and transparent conflict resolution.

### Agenda
- Day/week/timeline, appointments and project tasks together with preserved identities.
- Date changes operate on the underlying record; no cloned task across Agenda and Projects.
- Overdue triage, drag/drop plus accessible move menu, repeat occurrence semantics.
- One-touch next-week planning and visual indication of unscheduled tasks.
- Recurring original vs instance exception explained, no index-based ambiguity.

### Quick Add / Natural Capture
- Preserve all original Quick Add/Quick Capture categories, validation and automation.
- Two tabs: precise structured multi-domain Quick Add and conversational batch capture.
- Typed or optionally dictated casual Italian. Parse dates, priority, project, task type and optional goal.
- Project matching: exact names, synonyms, abbreviations, recent context; never silently force generic project.
- Preview per extracted operation: title, project, priority, date/time, destination, ambiguous flags; correct inline.
- Ask only for missing essential details; permit multi-select apply project or date for entire batch.
- No YAML in normal usage; keep as optional export/advanced developer representation.
- Idempotent commit into canonical domain commands. Money and destructive operations need explicit confirmation.
- ChatGPT recap → LifeOS would need a safely authenticated API/connector and opt-in. Not present.

### FitOS
- Weekly training schematics/catalog, groups, reps, weights, custom rest, cues, history, progression; full program stays reachable during Focus.
- Auto-rest per exercise and series, +/- duration, pause, skip, modify performed set weight/reps, undo.
- True session snapshots, per-set log, resume and safe templates/history separation in V2.
- Separate Stretch Focus and exercise timers, routine lists, duration, cues and streaks.
- Complete nutrition (foods, recipes, arbitrary reference grams, macros, targets, weekly meal plans, checks), bodyweight trend, exercise history/graphs.
- Never replace sophisticated guided Focus with a Pomodoro timer. See `fitos-focus-parity-audit.md`.

### Finances
- Asset ledger, historical net worth, planned expenses and installments, crypto, savings, Vinted and Cards valuations.
- KDP, Vinted, Cards and Shop as **income sources** with revenue earned vs pending vs received.
- Shop forecast initially a fixed recurring amount, later variable without rewriting history.
- Cards inventory sale decreases stock and links to actual account cash; avoid double counting. Costs and fees for profit.
- Transaction preview effect before commit, rollback/storno, reconciliation, duplicate detection.
- All previously available detail views and category controls retained.
- Read-only external data integrations only when securely authorized, in a separate future milestone.

### Collections
- Vinted inventory, quantities, acquisition values, profit and sold records.
- Cards per-copy tracking, print/language/set and price histories, grading status when appropriate.
- Project ties for sales workflows, with meaningful hierarchy and quick actions.

### Reliability/access
- Keyboard shortcuts & mobile touch parity; structured search across every domain.
- Focus management, reduced motion, contrast AA targets, responsive desktop/tablet/mobile.
- PWA offline and conflict-resolution affordances; saving / syncing / saved statuses.
- Auth and Firebase permission hardening before any release, migration with explicit backups.

## P1 — Product UX gains worth exploring in design

| ID | Concept | User advantage | Trigger |
|---|---|---|---|
| UX-01 | Context bar: what am I doing, project, session, next step | reduce context switching | Oggi / every workspace |
| UX-02 | Editable Bento layout with constrained grid snapping | personalization without disorder | dashboard and finance |
| UX-03 | Density: Comfortable/Compact | different desktop/phone needs | global |
| UX-04 | Progressive disclosure for advanced controls | simplicity without removing depth | detailed workspaces |
| UX-05 | Cross-module deep links + breadcrumbs | navigate long flows without getting lost | all branches |
| UX-06 | Saved smart views (today/high priority/blocked/week) | no duplicated task records | Projects / Agenda |
| UX-07 | Search/command palette for both navigate and create | fast keyboard workflows | global |
| UX-08 | Inline edit and undo on reversible records | lower tap count | tables/lists |
| UX-09 | Resumable sessions and unsaved-draft indicator | avoid accidental losses | FitOS / editors |
| UX-10 | Background-aware timer + safe notifications | real rest periods | FitOS |
| UX-11 | Nonintrusive explanation of contextual alerts | trusted recommendations | Oggi |
| UX-12 | Weekly review that creates linked priorities | planning, not gamification | Review |
| UX-13 | Favorites/recently used sections + optional pinned shortcuts | quicker daily navigation | sidebar |
| UX-14 | Reusable data-dense tables with filtering/export | inspect at scale | Finance, Cards, Inventory |
| UX-15 | Universal batch actions across entity type | manage 10 tasks at once | Projects / Agenda |
| UX-16 | Capture duplicate candidate warning | prevent repeat tasks/expenses | Quick Add |
| UX-17 | Small, meaningful completion feedback (opt-out) | motivating, never nagging | tasks/habits |
| UX-18 | Time-sensitivity + effort estimation, opt-in | prioritization without overload | Today |
| UX-19 | Time-blocking drag interface + accessible alternatives | realistic agenda | Agenda |
| UX-20 | Calendar/finance graph drilldown into originals | from insight to action | Finances / Review |
| UX-21 | Better mobile hierarchy: bottom nav + full-page branches | less nested sheet complexity | mobile |
| UX-22 | Sound/haptic (opt-in) for workout rest and completion | focus without looking | FitOS |

## P2 / Future exploration, NOT active functionality

- Read-only Open Banking connector with regulated intermediary, no raw bank credentials.
- KDP official sales/royalty report import with payments reconciliation.
- eBay official API where available; Vinted supported export/manual import based on terms.
- Voice input and readback with error correction and privacy controls.
- Predictive dashboards with user-explainable, dismissible recommendations.
- Automatic finance categories, anomaly/duplicate detection, privacy-first.
- OCR receipt ingest (explicit consent), receipts linking to transaction.
- Project-specific reusable templates and repeatable process checklists.
- Correlation views across habit/fitness/project trends without misleading causation.
- Automation rules for recurring financial and work tasks (explicitly authorized).
- More robust offline queuing and multi-device reconciliation.
- Bulk data management: safe import previews, conflict tables, audit trail.

## Design-first sprint process

**Right now:** design tokens → IA/navigation → project/task dashboard → agenda/finance/fitos module frames → mobile patterns → micro-interactions → check A11y.

**Later, each module individually:** V1 source audit → parity test scenarios → design signoff → data model and migration → staging implementation → performance tests → explicit release approval.

### Deliverables and gates
1. Visual/UI work stays in `design-lab/`.
2. Documented design choice always links to V1 function(s) and an explicit future acceptance test.
3. Mock state clearly labeled, no false claims about integrations/persistence.
4. Every rejected idea stays documented as rejected rather than silently disappearing.
5. When new concepts are proposed, append to this document or individual module backlog with rationale and status.

**Nothing in this file changes, syncs, or migrates real LifeOS data.**
