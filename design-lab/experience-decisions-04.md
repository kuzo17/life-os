# LifeOS Experience Lab — Batch 04 Design Decision Record

**Approvals:** Dark = Aurora Neo-Swiss; Light = Prism Bento. Both modes share one application. Keep 100% V1 capabilities while upgrading UX.

## Finance — economic operations, assets and income sources

**Separate concepts:**
- `Account / Asset`: bank, cash, investments, inventory and potential receivables. Part of net worth only according to explicit valuation policy.
- `Income source`: KDP, Vinted, Cards, shop, etc. A source is an analytical dimension; **not necessarily an asset**.
- `Accrued revenue / receivable`: money earned but not yet paid; may count as an asset depending on accounting setting but must not be counted again on bank settlement.
- `Payment`: cash deposited in a financial account.
- `Profit`: revenue minus cost of goods and other attributable expenses; selling a card transfers inventory to cash, not all proceeds = profit.
- `Forecast`: an expected fixed shop payment today, configurable as variable in the future, not actual cash until recorded.

**Proposed domain objects (supplement V2 data-model review):**
```
IncomeSource { id, name, kind: kdp|vinted|cards|shop|other, active, icon, color }
IncomeRecord { id, sourceId, occurredOn, amountCents, basis: accrued|paid|forecast, projectId? }
Receivable { id, sourceId, grossCents, settledCents, expectedPaymentDate?, status }
IncomePlan { id, sourceId, mode: fixed|variable, period, expectedCents?, effectiveFrom, active }
InventoryValuation { sourceId, asOf, valueCents, valuationMethod, basis }
TransferLink { id, receivableId?, saleId?, financialTransactionId?, amountCents }
```
Avoid double counting and reconcile source income with actual asset balances.

**KDP**: books/market/language analytics should eventually be possible by report import; royalties accrued, payments received and pending independently. No claim of an official general API.

**Vinted**: inventory values and sales revenue are separate; profit after acquisition/fees. **Cards**: individual card copy, estimated stock valuation, sale price, fees, realized profit. **Shop**: currently configured fixed expected recurring income but source can switch to variable, with history preserved.

**Finance IA**: overview, income sources, assets, scheduled expenses, movements. One click from source summary to contextual breakdown; focus on *net worth vs cashflow* explanation.

## Quick Add / Quick Capture / Inbox

Do not make the user learn YAML. Keep **Quick Add V1 fast structured entry** with a single global trigger and category-specific forms. Add **Natural Language Capture**:
- Accept freeform Italian, multi-line recap and optionally dictation through supported platform later.
- Extract candidate intents, dates, amounts, projects and destination entity with a confidence score.
- Preview an editable list; flag ambiguous items and never silently record money / recurring rules / deletions.
- Confirm performs the same canonical typed commands as Quick Add.
- Ordinary parser demo may recognize simple phrases. Production-level colloquial understanding requires a real interpreter (possibly a backend LLM) + schema validation + permissions + confirmation. No API key in frontend. No inference without actual confidence.
- **Inbox is not a duplicate Quick Capture**: it holds uncategorized/unconfirmed captured items; Quick Add and Capture may save directly after confirmation.
- ChatGPT-to-LifeOS recaps **require a separate authorized integration**, not present yet.

## Dashboard adaptation

Default layout should remain stable across visits; never surprise with random reordering.

- **Permanent:** priority action, Today tasks, key navigation.
- **User-configurable:** FitOS, finance, habits and insight widgets; explicitly user-selected order/visibility.
- **Contextual:** due expense, overdue task, incomplete workout, pending unsorted Inbox — appear only when relevant, with clear dismiss or snooze affordance.
- Accessibility/reduced motion; no manipulative streak pressure; explain why cards appear.

## Contextual navigation

- Desktop: side sheet retaining page behind with the item context and tabs (Tasks, Goals, Recurring, Expenses, Notes). Esc to close; preserve page scroll and filters.
- Mobile: full-screen sheet, large touch controls and sensible Back.
- Back to source retains search/filter/sort.
- Panels on assets and income sources show the difference between balance, accrued income, and settlement.
- No second parallel form state or lost editing on switching tabs.

## Micro improvements to test

| # | Enhancement | Outcome |
|---|---|---|
| UX-01 | One global Create with Natural + Quick Add tabs | no YAML |
| UX-02 | Editable capture preview | prevent unintended operations |
| UX-03 | Project detail side sheet | preserve project context |
| UX-04 | Income-source breakdown | distinguish KDP, Vinted, Cards, Shop |
| UX-05 | Stable dashboard widget visibility | user control |
| UX-06 | Undo task completion | easier recovery |
| UX-07 | Real status labels pending/accrued/paid/forecast | no misleading assets |
| UX-08 | Source-based income forecasting | fixed to variable migration |
| UX-09 | Inline fields / recent sources for Quick Add (next) | fewer clicks |
| UX-10 | Keyboard command center & search (already in Batch 03) | accessibility |
| UX-11 | Remember last viewed project sub-tab (next) | return to context |
| UX-12 | Density toggle Compact/Comfortable (next) | tailored screen use |
| UX-13 | Smart Saved Views for overdue/high-priority (next) | no duplicates |
| UX-14 | Separate empty/offline/error states (next) | trust and clarity |
| UX-15 | Undo for low-risk commands, reversal for finance | correct history |

## Review and constraints

Batch 04 is a **local fake-data concept**, with no KDP/bank/eBay connections, no Firebase writes, no persistence and no functioning production NLP. Source data is not treated as genuine statements of user balances. Real schema validation and user testing needed before V2 build.
