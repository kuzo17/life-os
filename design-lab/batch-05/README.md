# LifeOS Visual Lab — Batch 05 / Navigation + Swiss Bento

**Purpose:** move forward on product UI and interaction design **without losing the depth of the existing LifeOS V1**. Not an implementation/replacement of V1 or V2.

## Official visual language

- **Dark: Aurora Neo-Swiss** — midnight blue surfaces, cyan/blue/violet accents, visible typographic hierarchy, disciplined geometry.
- **Light: Prism Bento** — bright neutral surfaces, strong cobalt/emerald/coral/gold project accents, real contrast (not washed-out pastels).
- **Shared**: 12-column Bento composition for dashboard/finance, module-specific summary, 14-project catalog, mobile navigation, card/list switching, density toggle.

## Update: folder-first navigation restored

The five V1 folder labels are now the **first page of Projects**: KUZO ENTERPRISE, Z & JPC, RESELLING & COLLEZIONE, FINANZA & TRADING, ALTRO. The tested demo path is: Folder gallery → Folder projects → Project workspace → individual task detail sheet. The breadcrumb can return one level from project to folder, then to all folders.

Only default public-project labels and **synthetic UI content** are represented in the lab. The seven private custom projects, real archived statuses and live project folder membership in the uploaded Firebase JSON were **not committed here**. They are reviewed exclusively in the private local audit report.

## New visual / UX flows to evaluate

### 1. Correct hierarchy: pages for branches, sheet for leaf
- Projects gallery → select project → **dedicated Project Workspace page**, with breadcrumb and tabs Task / Obiettivi / Ricorrenti / Spese / Note.
- Opening an individual task opens its **leaf detail side sheet** for title, project, priority and date.
- Returning to project list preserves current search/filter/compact preference.
- Those deeper non-task tabs currently describe their proposed functional structure without falsely pretending their full V1 functionality already exists.

### 2. All V1 project domains in the lab
14 project domains are represented from the V1 source (Quartzica, AI Made Simple, Stosa, KDP, Nami, YouTube, Vinted, Carte, Risparmio, Crypto, Trading, Allenamento, Alimentazione, Stretching). **Example task counts/progress/status are fake**; these are navigation placeholders, not imported personal data.

### 3. Single task identity in the demo
- Initial tasks live in one `tasks[]` array with stable `id`, `projectId`, `priority`, `when`, `done`.
- Oggi = filter tasks dated `oggi`; Agenda = filter future/undated tasks; Project workspace = filter by `projectId`.
- Project progress derived from those same tasks, rather than fake independent values.
- Editing a leaf task updates the same entity, so the views agree without manually duplicating a record.
- This is a client-side model demonstration, **not** the production Firestore schema or persistent data service.

### 4. Natural input and Quick Add
- Typed casual recap interprets a *limited* set of project keywords, dates and priority expressions. Example: `Domani controllare KDP urgente; lunedì chiamare il fornitore del negozio, priorità alta; oggi fare stretching`.
- Preview shows **project, priority, date, type and editable title** for each parsed item.
- Ambiguous or absent project cannot silently fall back to Generic: user must select a project before committing a task.
- Structured Quick Add supports a required project and priority for Task.
- Ordinary user input does not require YAML.
- Other structured capture types and the fully generalized V1 Quick Capture registry remain **future implementation parity requirements**; demo types other than Task create Inbox drafts, not complete domain records.
- This is **heuristic demo parsing**, *not AI/voice*; nuanced multi-intent text may be misinterpreted.

### 5. Additional UI polish
- Project cards feature sharper Swiss geometry and domain color treatment, consistent in both modes.
- Global Compact/Comfortable density toggle.
- Oggi hero chooses a currently pending task based on priority and displays its actual demo project.
- Clear differentiation between general focus/pomodoro and FitOS workout/stretches Focus Mode; the latter links to the dedicated `focus-study` demo with sets, recoveries and cues.
- Focused project navigation via keyboard for accessible card activation.

## Remaining functional gaps (intentionally honest)

- The V1's complete goals/debt, recurring rules, finance, Vinted/Card catalogs, nutrition/recipes, workout sets/history and original project details are **not fully implemented** in this HTML prototype.
- Some other demo sections still use synthetic static numbers and illustrative schedules.
- No Firebase, auth, persistence, true voice transcription, AI parser or external accounts.
- The actual V2 must be implemented separately with 100% V1 parity validation (including user backup reconciliation) and extensive end-to-end tests; no mock can satisfy this release gate.
- User-approved design constraints are tracked in `../master-concept-register.md`. A visual experiment is not a user approval.

## Test links

- [Source on GitHub](https://github.com/kuzo17/life-os/blob/lifeos-visual-lab/design-lab/batch-05/index.html)
- [External HTML preview, availability not guaranteed](https://raw.githack.com/kuzo17/life-os/lifeos-visual-lab/design-lab/batch-05/index.html)
- Open `#projects` for gallery / project workspace; `#today` for task dashboard; `#agenda` for planned tasks; `#finance` for income sources.
- [Global Concept Register](../master-concept-register.md)
- [Non-regression matrix](../non-regression-matrix.md)
- [Focus study](../focus-study/index.html)

## Validation performed

- Source committed to an isolated branch without writes to main or lifeos-v2.
- JavaScript syntax checked.
- All primary page renderers, project workspace subpages, finance and FitOS subviews checked for balanced generated HTML tags in a synthetic test runner.
- Parser example returned expected project, date and priority assignments in a static test.
- **No full browser screenshot or real user interaction test was completed**; mobile/a11y should be inspected before design approval.

## Next design focus

Continue depth work in the module page hierarchy: Finance → Income source → original asset/income record; FitOS → Training → weekly program → selected exercise → leaf editor; Agenda → day/week → task; Cards/Vinted → inventory → item editor. Pursue tasteful, meaningful microinteractions: display density, task undo, better status and sync indicators, keyboard shortcuts, clearer side sheet affordance, animation respecting reduced-motion, and mobile bottom navigation.
