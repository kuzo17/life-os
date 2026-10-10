# LifeOS V1 → V2 — Feature Parity Gate (non-regression matrix)

**Status:** working checklist. Baseline source `main@e58a77e3e00445474d93008d15ecf3a171f2a783`. “Spec” describes functionality; none of these statuses assert V2 implementation.

**Rule:** no module can be considered shipped unless its complete V1 feature set has been (a) identified, (b) specified, (c) implemented or explicitly replaced with an equivalent that covers the same need, (d) validated against backup data, and (e) tested end-to-end. UI-only mockups are **never** proof of feature parity.

## Mandatory tracks

| Domain | V1 functional contract to preserve | V2 UX/quality upgrade | Validation |
|---|---|---|---|
| Home/Oggi | task planned today and carryover, priority/time sorting, project filter, recurring completions, goals/habits, FitOS snapshot | action-first adaptive bento with fixed key layout, multi-record quick capture, undo, contextual signals | existing data totals, task check/uncheck/carryover, date test |
| Projects | 14 preloaded special projects and custom projects, folders/order, archive/deletion, task metrics, goals, week goals/debt, planned expenses, notes, recurring rules/streaks | clear hierarchical pages for middle-depth browsing; side panels only for leaf actions; smart views | per-project count, status, order, debt calculations, repeat tests |
| Agenda | daily task storage, date navigation, time ordering, priorities, bulk select, move/duplicate/delete, overdue moves, drag/drop | week/day/timeline views, mobile rescheduling and anchored side sheets | dates/timezones, bulk moves, recurring display without duplicate writes |
| Habits | checkbox, max/min value entries, targets, increment/decrement, daily log, streaks | one-tap check, calm feedback, clear history and easy correction | daily history count/value, all target types |
| FitOS: Training | weekly scheme, catalog stable IDs, exercise groups, rest guidance, per-exercise notes, history/graphs, focus series/rest, skip, +/-weight/time, completion | **complete schedule visible while focusing**, per-set logs, reliable background timers, session resume, non-destructive session vs template separation | [Full focus audit](fitos-focus-parity-audit.md), rest timing & history tests |
| FitOS: Stretching | weekly routines, stretching catalog, custom durations, focus timer/pause/skip/early complete, history, streaks | detailed parallel guided mode, preservation of each exercise's time/notes, safe pause/resume | duration, manual/auto completion, history |
| FitOS: Nutrition | 11 slots/day, 7-day templates, foods normalized on arbitrary reference grams, recipes with ingredient quantities, derived macros, check history, targets, weight entries | distinguish plans from consumption records; snapshot historical meals, quick ingredient search, recipe library | macro calculations and conversions, 11 slots, dependent recipes, past records |
| Finances | assets, balances, transaction register (last 200 V1), payments, planned expenses, installments, pat_events, savings, crypto holdings, manual corrections | separate asset/source/receivable/payout/forecast, ledger idempotency, audit/reversal, chart drilldown | opening balance reconciliation, duplicates, installment clamping, no double counting |
| KDP/Shop finance source | V1 project-specific data / manual earnings and source notes, not necessarily integrations | income-source analytics and import pipelines **without inventing official API**; shop forecast fixed→variable with date-effective history | accrual vs payment reconciliation and authorization |
| Vinted | inventory qty/state/category/prices, completed sales records, potential/realized stats | inventory/cashflow/profit distinctions; fast sale capture and item detail | quantity, unit counts, sale totals |
| Cards | one-record-per-copy, language, series, bought/estimate/sold prices and status, totals/profit | advanced catalog search, filter, resale margin & inventory valuations | copy count, sold count, valuation, profit rules |
| Quick Add / Capture | categorized fast creation, wide ENTITY_REGISTRY (task, goal, weekly goal, movement, expense, asset, exercises, weight, recipe, stretching, card, habit, link), validation, YAML preview and custom notes | preserve **all categories** and fast forms; add colloquial recap & optionally speech; preview/edit/project/prio/date and explicit commit; YAML advanced only | register all intents, validation/error/duplicate tests, no operation without confirmation |
| Global search + settings | search, dark/light theme, project metadata settings, data initialization/migrations, export/import, offline PWA, Firebase sync | universal search + shortcut, better visual states for offline/pending/sync, secure per-user auth | e2e backup restore, rule emulator, device conflicts |

## Focus specifically: blockers from simplified prototypes

- Batch 03/04 generic 25-minute Focus timer is a *visual placeholder*, **not** the FitOS guided session and must not be merged into V2 as replacement.
- V1 catalog rest value must control rest countdown, default 90s only if absent.
- Tips/technique note, last performance, progress suggestions, series × repetitions × weight and skip/mark/pause/+/- are baseline, not optional polish.
- Existing V1 code stores history at exercise completion, not every set; V2 per-set history and session resume are **new improvements** that must not fabricate older set data.

## Operational approval checklist

For each module, produce:
1. Complete use-case inventory with source line or ID.
2. Data entity/schema mapping and legacy quirks.
3. Click path in V1; user-facing proposed path in V2.
4. Parity scenarios and negative/error tests.
5. Prototype review in dark and light + mobile.
6. Working V2 staging implementation with verified save and restore.
7. Reconciliation report based on two user-provided backups, without committing private payloads.
8. Explicit sign-off before release/cutover.

**No module will be marked “done” based on a beautiful static mock.**
