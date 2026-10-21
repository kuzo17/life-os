# LifeOS V2 — UX direction and acceptance

> Aggiornamento 21 ottobre 2026: la sequenza operativa è nel [piano principale](DELIVERY_PLAN.md). Le sezioni mock/design di questo file restano materiale di riferimento. L’implementazione tecnica e la parità precedono il redesign definitivo; accessibilità e uso mobile restano criteri di ogni modulo.

## Product design thesis
A personal command center with a *premium editorial* visual identity, significantly more polished than V1. Dark and light themes are first-class; no template-dashboard clutter. Crisp typography, strong information hierarchy, deliberate spacing, contextual color, meaningful microinteractions, low-noise charts.

## Layout
- Desktop: compact left rail with hover/focus reveal and explicit pin (Today, Projects, Agenda, FitOS, Finance), global search and quick-create action; wide content area with adaptable grids. A permanently expanded sidebar is not the default.
- Mobile: clear stacked cards, bottom navigation, quick add reachable with one thumb; drawers instead of crowded dialogs; responsive typography.
- All surfaces: focus states, keyboard access, error/retry states, reduced-motion support, touch targets >= 44px when practical.

## Design tokens (draft, not approval)
Dark: canvas #0D1217, elevated #162029, border #283640, text #EEF2F2, muted #93A2AA, primary #B6DFC6, info #91B8EC, warning #EBC28B.
Light: canvas #F6F5F1, elevated #FFFFFF, border #E2E6E3, text #1A252A, muted #65737B, primary #287456.
Avoid using color alone to encode status.

## Mock screens
1. **Today**: greeting/date, daily task completion, priority focus, overdue tasks, habits, FitOS daily progress, next scheduled events.
2. **Projects**: search/filter and group, project card showing category/accent/progress/priority; project detail and create remain to be designed.
3. **Finance**: net worth hero, change stats, asset allocations, income/expense ledger, planned expenses, installments.

## Acceptance gates
- Mock is UI-only: does not connect to actual Firebase, does not claim real metrics, intentionally no persistence.
- Every navigation link/tab must work in mock; no fake create/edit buttons.
- Screen content should be legible on 360px and desktop 1440px, with focus-visible states.
- Prototype not deployed to GitHub Pages production; opened directly from branch file or staging preview.
- After design approval, implement as React/TypeScript components with typed view-models; avoid committing mock code as application architecture.
