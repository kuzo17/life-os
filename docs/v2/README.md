# LifeOS V2 — Product blueprint

**Status:** design + inventory, not production-ready.
**Baseline V1:** `main@e58a77e3e00445474d93008d15ecf3a171f2a783`.
**Rule:** never change V1, `main`, `v1-stable`, Firebase Auth/Rules, or production RTDB while designing V2.

## Product contract

Rebuild the *full observable capability* of V1 (not its HTML) in a modern, tested responsive product, with a clearly superior visual design. Preserve user data and meaningful behavior; review V1 bugs rather than faithfully reproducing them.

- Functional baseline: [function inventory](legacy-functions.md) (429 named functions, plus uncovered inline logic).
- Data direction: [model and relationships](data-model.md).
- Migration protocol: [migration plan](migration-plan.md).
- Screen design and acceptance: [UX specification](ux.md).
- Clickable first-pass mock: [prototype](../../v2-prototype/index.html) (static UI-only; fake numbers, zero Firebase integration).

## Architecture candidate

- React 19 + TypeScript + Vite, React Router, TanStack Query for server-state, Zod for command validation; state stays close to feature.
- Cloud Firestore as candidate primary store with Google Firebase Auth; use separate staging and production Firebase projects.
- Domain services and repository interfaces separate business rules from components and Firebase-specific SDK.
- Test using Vitest + Testing Library, Playwright, Firebase Emulator Suite.
- Accessible custom design-system components and tokens; PWA implemented after auth/offline strategy is tested.
- No runtime migrations without signed-off preview, reconciliation counts, backups and idempotency checks.

## Delivery gates

1. Catalog every V1 feature and persistent key including dynamic keys / inline callbacks.
2. Snapshot/validate real Firebase export **and** local LifeOS backup supplied privately by user. Neither has been provided to this work environment.
3. Approve UI shell and 3 primary screens (Today, Projects, Finance) against prototype.
4. Build full V2 staging, no production DB writes.
5. Import idempotently, reconcile records and financial sums; test multi-device/offline/restore.
6. Approve and deploy deliberately, with rollback.

## Current limitations

This documentation derives from inspected V1 code, not verified real backup values. No Firebase security rules have been changed and no import is performed. Mock data in prototypes is illustrative only. Component matrix is not final until the 429 entries and anonymous/inline handlers are each reconciled.
