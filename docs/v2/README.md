# LifeOS V2 — documentazione e direzione di sviluppo

**Direzione corrente — 21 ottobre 2026:** [piano principale](DELIVERY_PLAN.md) e [registro operativo](DELIVERY_STATUS.md). Prima rifattorizzazione tecnica e trasferimento delle capacità V1; poi redesign e nuove funzioni. La documentazione esistente viene riutilizzata, non rifatta.

**Stato:** base React/TypeScript F1 in [`app/`](../../app/README.md), con fixture volatili e trasferimento selettivo dal laboratorio; migrazione V1 non completata, non pronta a sostituire l’app in uso. [Consegna INC-01](increments/INC-01.md).
**Baseline V1:** `main@e58a77e3e00445474d93008d15ecf3a171f2a783`.
**Rule:** never change V1, `main`, `v1-stable`, Firebase Auth/Rules, or production RTDB while designing V2.

## Product contract

Rebuild the *full observable capability* of V1 (not its HTML) in a modern, tested responsive product, with a clearly superior visual design. Preserve user data and meaningful behavior; review V1 bugs rather than faithfully reproducing them.

- Functional baseline: [function inventory](legacy-functions.md) (429 named functions, plus uncovered inline logic).
- Data direction: [model and relationships](data-model.md).
- Migration protocol: [migration plan](migration-plan.md).
- Screen design and acceptance: [UX specification](ux.md).
- Clickable first-pass mock: [prototype](../../v2-prototype/index.html) (static UI-only; fake numbers, zero Firebase integration).

## Scelte del piano corrente

- Sorgente unica attiva in `app/`; batch congelate e conservate come riferimenti.
- React + TypeScript + Vite e routing mantenuto, configurati in INC-01 con versioni compatibili e lockfile.
- Dominio e casi d’uso indipendenti da UI e SDK; porte repository e adattatori separati.
- Nessun cambio automatico del database esistente. Firestore era un candidato storico, non un requisito approvato della rifattorizzazione.
- Vitest, Testing Library, Playwright e contratti dati/emulatore; UI accessibile fin dall’implementazione.
- Stato effettivo, priorità, decisioni aperte e criteri di uscita sono nel piano e nel registro. Nessuna migrazione sui dati reali senza riconciliazione, backup e passaggio autorizzato.

## Delivery gates

La sequenza vincolante è F0–F9 nel [piano](DELIVERY_PLAN.md#6-sequenza-di-lavoro-e-criteri-di-uscita): continuità, progetto applicativo, primo percorso V1 persistente, domini, copertura trasversale, sync/accessi, redesign, migrazione e rilascio.

L’inventario e il mapping già presenti sono input dell’implementazione. Si aggiungono i casi mancanti quando si lavora sul relativo dominio. La disponibilità e la validità dei backup privati vanno verificate al gate dati reali e non impediscono il lavoro su fixture sintetiche.

## Current limitations

This documentation derives from inspected V1 code, not verified real backup values. No Firebase security rules have been changed and no import is performed. Mock data in prototypes is illustrative only. Component matrix is not final until the 429 entries and anonymous/inline handlers are each reconciled.
