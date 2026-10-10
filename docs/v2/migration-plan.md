# LifeOS V1 → V2 — Import and reconciliation protocol

## Source boundaries
- Never mutate original Firebase JSON export or LifeOS local-storage export.
- Never commit backups containing private inventory/finance/nutrition data to public GitHub.
- V1 source baseline `main@e58a77e3e00445474d93008d15ecf3a171f2a783`; do not touch production RTDB.
- Two backups were reportedly exported by the user but **not supplied for validation**. Work may only plan migration, not assert successful data transfer.

## Stage 1 — Inventory
Inventory (a) all RTDB node paths, including `lifeOS`, `backups` and schema timestamps; (b) all local `g_*` entries; (c) seed literals in V1; (d) every dynamic prefix and `agenda_YYYY-MM-DD`; (e) seed overrides and deleted/archived flags.
Generate keyed record count, SHA-256 fingerprint, per-domain totals and validation warnings. Do not log sensitive values.

## Stage 2 — Normalize
Apply pure deterministic transforms, record `legacySourcePath => v2Id`, normalize locale dates, verify reference existence, turn indexed recurring completions into ID-keyed completions, map goal check arrays by original positional index, merge project seed+custom and overrides before export. Preserve unrecognized fields in encrypted/safe quarantine **outside public repo**, not silently discard.

## Stage 3 — Reconcile
Compare exact counts and critical aggregates: folder/projects; agenda tasks by date; recurring rule/check counts; goals and debts; habits/check history; assets balances; expenses and paid status; txLog operations; net worth; Vinted units/sales; cards by stock state; savings contributions; food/recipe refs; seven-day training/stretching plans; nutrition slot count, weight history.
Record ambiguous dates, duplicate titles, broken references, invalid numbers, unsupported RTDB keys, old meal variants, unknown schema versions.

## Stage 4 — Stage and test
Use isolated V2 Firebase staging project, with Security Rules and Emulator Suite tests. Import dry-run first; then write with idempotency keys and checkpointing. Rerun import and assert no duplicates. Verify export/restore round trip and mobile/desktop synchronization.

## Stage 5 — Cutover
Only after user approval, produce signed off reconciled import report, remove old insecure anonymous access on production at coordinated cutover, verify login and data across devices, rollback path tested.

## Primary storage mapping
```
folders                         => folders
PD+customProjs+deletedPD         => projects
proj_*+projOrders+archived       => projects/folders metadata
agenda_YYYY-MM-DD                => tasks
recur_*/recurFreq_*/recurpri_*  => recurringRules
recurChecks_*                    => recurringCompletions
goals_*/gchecks_*                => goals
weekGoals_*/weekGoalChecks_*     => goals / weeklyGoalCycles
debt_*                           => debtAdjustments / legacy metadata
habits/habitLog                  => habits / habitEntries
assets/asset_note_*              => assets
txLog                            => financialTransactions
spese_*/speseGen                 => plannedExpenses
planId/planIdx/planTot           => installmentPlans
pat_events/pat_target            => netWorthSnapshots / targets
vinInv/vinSold                   => vintedItems / vintedSales
carteInv                         => collectionCards / cardSales
risp_*                           => savingsPlans / contributions
cryptoInv                        => cryptoHoldings
all_catalogo/all_schede          => exercises/workoutTemplates
all_checksOggi                   => workout historic completion (limited)
str_catalogo/str_schede          => stretchExercises/templates
str_checksOggi                   => stretching historic completion (limited)
alimenti/ricette                 => foods/recipes
alim_schede/alim_checksOggi      => mealTemplates/mealLogs (incomplete historic source)
alim_targets/fitos_settings      => nutritionTargets/settings
alim_pesoStoria                  => weightEntries
quickNotes/note_*                => notes
theme/oggi_sort/*_view           => settings
*_migrated/dataInit              => migrationJobs compatibility only
```

### Critical risks
- Firebase snapshot may be newer or older than local backup; need per-path comparison and explicit source-of-truth resolution, **never last-write-wins on full root during migration**.
- Dates in `toDateString()` and `DD/MM/YYYY` require timezone/locale migration.
- RTDB serialization can omit empty arrays.
- Recurring histories use positional suffixes; deletion/insertions may have changed indices.
- Nutrition pre-v11 migrations may leave incompatible slot shapes.
- `txLog` is capped to 200; current balances cannot be recreated from its incomplete transactions.
- Risk of duplicate inventory value if both inventory valuation and manually logged asset are summed.
