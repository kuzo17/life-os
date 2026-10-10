# LifeOS Experience Lab — Batch 04

**Status:** interactive UX concept, not production-ready. Visual identity approved for exploration:
- **Dark:** Aurora Neo-Swiss.
- **Light:** Prism Bento.

### Preview
- [Batch 04 source](https://github.com/kuzo17/life-os/blob/lifeos-visual-lab/design-lab/batch-04/index.html)
- [External browser preview (RawGitHack; availability not guaranteed)](https://raw.githack.com/kuzo17/life-os/lifeos-visual-lab/design-lab/batch-04/index.html)
- `#finance`, `#today`, `#projects`, `#agenda` work as client-side demo routes.

## Implemented prototype behaviors

1. **Finance tabs:** Overview / Income Sources / Assets / Scheduled.
2. **Income-source cards:** KDP, Vinted, Cards, Shop with separate demo accrued revenue, payments received, outstanding amounts and inventory valuations.
3. **Source details:** contextual side sheet on desktop; full screen on mobile. Shop source toggles between fixed and variable forecast modes in memory.
4. **Unambiguous patrimony accounting:** cash + investments + stocks; receivables not automatically counted (policy yet to be designed). No double counting between inventory sale and cash movement.
5. **Unified Quick Add modal:** Natural language and Structured entry tabs. The structured form offers 12 common categories for Task / Food / Exercise / Stretching / Recipe / Habit / Weight / Movement / Planned expense / Card / Vinted / Note.
6. **Natural language capture demo:** simple Italian clauses and dates, editable preview per item, type/date changes, removal and confirmation. **Not a complete NLP system and not AI-backed yet**. May fail on compound/ambiguous text; user must verify.
7. **Scheduling semantics in demo:** task with `oggi` appears in Today, with future weekday/days appears in Agenda, undated item stays in Inbox. Non-task types save as demo Inbox drafts, not real FitOS/Finance records.
8. **Adaptive Today:** hide/show nonessential Habits, FitOS and Finance widgets while keeping core tasks and actions stable; preferences only in memory.
9. **Project contextual sheet:** opens on top of project view, keeping filters/context accessible once closed; tabs from Batch 03 preserved.
10. **Undo task check:** Undo action in confirmation toast, no silent permanent changes.

## Known limits

- **All figures are invented** and only illustrate layout.
- No Firebase, no API keys, no real KDP/bank/shop integration, no user accounts and no persistent data storage.
- Task/calendar operations update only local JavaScript arrays in the tab. Non-task Quick Add entries are **drafts**.
- Shop “fixed to variable” switch only updates a local example, not a ledger or payment schedule.
- No speech-to-text implemented. Colloquial *typed* input is demonstrated with a simple heuristic parser, not an LLM. True dictation needs browser/platform support, consent and reliability design.
- Sending a recap **from ChatGPT directly into LifeOS** requires a separately authorized connector/custom app backend; it is not currently available.
- Not all V1 functions are implemented in this demo. V1 compatibility remains an explicit development requirement for the actual LifeOS V2.
- Static JS syntax and balanced DOM markup tests passed across all 9 pages, Finance views, 5 FitOS tabs, sample Quick Add/recap dialogs and side sheets. **A live browser/end-to-end visual test is not yet completed.**

## Next UX design decisions

- Natural Capture production pipeline: speech/transcription if requested, LLM/parser behind authenticated API, typed Zod commands, preview with ambiguity flags, confirmation, deduplication and audit.
- Quick Add shortcuts and last-used categories: less navigation, yet no duplicated domain logic.
- Financial model: source revenue, gross vs net, payable/receivable, payouts, inventory valuation and shop income forecast. Investigate actual schema with real backups (privately supplied).
- Mobile side sheet adaptation and responsive design after user feedback.
- Undo/reversal safety and offline/pending visual states.
- Dashboard widgets: movable tiles and smart alerts that *never reorder without consent*.
