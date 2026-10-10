# Batch 03 — LifeOS Experience Lab

This is a **separate UI/UX concept**, not the actual LifeOS V2 implementation.

## Selected directions
- **Dark:** Aurora Neo-Swiss — midnight canvas, teal/blue/violet accents, disciplined typography, lower noise.
- **Light:** Prism Bento — light neutral canvas, stronger cobalt/teal/orange accents, color blocking and asymmetrical cards.

Both modes preserve navigation, content and interaction; they share a conceptual design system.

## Prototype paths
- [Open Batch 03 source](https://github.com/kuzo17/life-os/blob/lifeos-visual-lab/design-lab/batch-03/index.html)
- [External HTML preview (third party; availability not guaranteed)](https://raw.githack.com/kuzo17/life-os/lifeos-visual-lab/design-lab/batch-03/index.html)

## Pages included
- Today: action-first cockpit, task completion simulation, focus starter, habits, due-date and inbox links, FitOS/finance entry points.
- Projects: bento/cards and list switch, filter + search, context detail dialog with tabs Task / Goals / Recurring / Expenses / Notes.
- Agenda: week strip, conceptual timeline, overdue task decision (demo only).
- FitOS: Today, Training, Nutrition, Stretching and Weight subviews; Focus demo timer.
- Finance: net worth, asset list, transaction preview with explicit simulated confirmation, ledger display.
- Collections: Cards / Vinted inventory switching and sale concept.
- Inbox: fast capture followed by triage to Task / Note; these are only local in-memory demo items.
- Review: guided 3-step weekly review, explicitly not an algorithmic recommendation engine.
- Mobile “More”: access to all secondary modules from the bottom navigation.

## Testable flows
1. Switch dark/light without changing page.
2. Use sidebar or mobile bar to navigate.
3. Complete/reopen demo task in Today.
4. Open Quick Capture from global + and route to Today task or Inbox.
5. Use Ctrl/Cmd+K to search navigation, projects, tasks and Quick Capture.
6. Filter and search projects; change grid/list; open detail tabs.
7. Change agenda day.
8. Open FitOS tabs; start/pause/reset local Focus timer.
9. Add a demo financial transaction via preview and confirmation; asset value is intentionally not changed.
10. Switch collection category and inspect sale flow notification.
11. Triage Inbox items; experience empty state.
12. Step through Review.

## Explicit boundaries
- All content, amounts, progress, sessions and names are fictitious.
- No Firebase libraries, auth, DB writes, real imported data, external API calls or service workers.
- No persistent changes: reload resets data and timer.
- Advanced functions (e.g., dragging agenda tasks, real workout sets, finance ledger consistency, recurring rules, browser offline) are **specified only**, not implemented in the demo.
- The actual V2 will implement interactions through typed domain services, not DOM string operations.

## Engineering confidence
- Static HTML tag matching completed for the page shell.
- JavaScript syntax checked with a JavaScript parser.
- Generated contents of all 9 navigable views and the 5 FitOS subtabs + 2 inventory modes were inspected for balanced tags.
- Automated browser screenshot/end-to-end test was NOT completed; external preview might be blocked by browser environment.

## UX review questions
- Can the user identify the *next action* within three seconds?
- Can a task be captured and completed without opening a project?
- Are modules distinguishable but visually coherent across light and dark themes?
- Is the bento density optimal, or does it become cluttered?
- Does every user action have clear consequences, especially financial ones?
- Can every primary module be reached on mobile in at most two taps?
- Is the interface stimulating without nagging, noisy gamification or meaningless animation?

## Next design rounds
- Add persona-specific density settings: Compact / Comfortable.
- Prototype desktop project side panel vs modal with actual nested task/goal/expense sections.
- Prototype agenda drag/drop & bulk date assignment, using clear recovery/Undo affordances.
- Design real session UI and offline reconciliation UX for FitOS.
- Explore widget configuration, saved smart filters, empty/error/offline states.
- Translate approved tokens/layout patterns to the actual React/TypeScript V2, and maintain capability parity with the V1 function inventory.
