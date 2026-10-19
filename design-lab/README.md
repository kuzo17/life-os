# LifeOS — Batch 06 disponibile

**[Apri Batch 06: Agenda, FitOS e Finanze navigabili](batch-06/index.html)**

- Agenda: task condivise fra progetto e calendario, vista giorno/settimana, filtro e modifica dalla scheda finale.
- FitOS: settimana → scheda giorno → esercizio, catalogo e Focus Study completo come demo separata.
- Finanze: pagina KDP / Vinted / Carte / Negozio, quindi pannello della singola operazione.
- Stessa identità grafica Aurora Neo-Swiss notte + Prism Bento giorno.
- [Limiti, casi provati e funzioni della V1 ancora da integrare](batch-06/README.md).

**Principio invariato:** prototipo di UI/UX senza Firebase o dati personali, non sostituisce la V1. I veri moduli V2 dovranno superare la [matrice di non-regressione](non-regression-matrix.md).

---

# LifeOS — Master Design Direction

**Regola confermata:** nessuna perdita di funzionalità rispetto alla V1. La V2 dovrà essere superiore sia funzionalmente sia nella UX; per adesso si lavora esclusivamente nel laboratorio UI.

- **[Batch 05 — Swiss Bento / Workspace Navigation](batch-05/index.html)** — 14 aree V1 nell'esplorazione progetti, vere pagine workspace con tab, pannelli solo sui singoli elementi, due temi, modalità compatta e demo task con progetto/priorità/data.
- **[Master Concept Register](master-concept-register.md)** — unico archivio delle idee UX/feature attuali e future con decisioni, priorità e gate non regressivi.
- [Batch 05 — cosa è demo e cosa è ancora da realizzare](batch-05/README.md).
- [Matrice non regressione V1 → V2](non-regression-matrix.md) e [audit FitOS Focus](fitos-focus-parity-audit.md).

**Ricorda:** le Batch sono prototipi statici con dati inventati; parità funzionale e migrazione dei dati saranno verificate nella vera V2, senza toccare `main` durante i test.

---

# Nuova regola: profondità funzionale V1 + UX superiore V2

- **[Apri FitOS Focus Study — allenamento e stretching guidati](focus-study/index.html)**: programma completo, serie × ripetizioni × carichi, recuperi specifici, note tecniche, confronto storico, timer, pausa, skip, Undo, riepilogo.
- [Audit tecnico della Focus Mode V1](fitos-focus-parity-audit.md): verifica puntuale delle funzionalità reali e obiettivi V2.
- [Matrice parità completa V1 → V2](non-regression-matrix.md): checklist non-regressiva per Oggi, Progetti, Agenda, FitOS, Finanze, Vinted, Carte, Quick Add e sincronizzazione.

**Un mockup non costituisce prova di parità funzionale. Le schermate V2 devono essere progettate partendo dalle funzioni originali, preservandole tutte e migliorandone usabilità e robustezza.**

---

# LifeOS Visual Lab — Iterazioni UX

**Temi di riferimento approvati:** Aurora Neo-Swiss (notte) e Prism Bento (giorno).

- **[Batch 04 — Finance & Smart Capture](batch-04/index.html)**: KDP/Vinted/Carte/Negozio, distinzione asset/fonte di reddito, Quick Add migliorata, cattura colloquiale con anteprima, widget configurabili, side sheets e Undo.
- **[Decisioni e microfunzioni Batch 04](experience-decisions-04.md)**: finanza, nuova strategia Quick Add, dashboard adattiva e piano dei piccoli miglioramenti.
- **[Limiti e prove Batch 04](batch-04/README.md)**.
- [Batch 03 — Experience Lab](batch-03/index.html): scheletro delle otto aree, sistema di navigazione e workflow.
- [Batch 02 — Swiss & Bento](batch-02/index.html): confronto fra 4 candidati.
- [Batch 01 — Exploration](index.html): primi concept.

Le batch sono prototipi isolati, **non** il codice definitivo dell'app. Non modificare `main` o `lifeos-v2` e non accedere ai dati Firebase in questo laboratorio.

---

# LifeOS Visual Lab — Indice design

**Direzione scelta per la V2:** Aurora Neo-Swiss per il tema notte + Prism Bento per il tema giorno.

- **[Batch 03 — Experience Lab](batch-03/index.html)**: prototipo centrato sui flussi d'uso in 8 moduli con due temi, Bento, ricerca, Quick Capture e nuove interazioni.
- **[Experience Blueprint](experience-blueprint.md)**: architettura dell'esperienza, user journeys prioritari, nuove funzionalità, principi di qualità.
- **[Batch 03 — Note e limitazioni](batch-03/README.md)**: flussi testabili, confini della demo e prossime iterazioni.
- [Batch 02 — Swiss + Bento](batch-02/index.html): quattro candidati originali a confronto.
- [Batch 01 — Prime direzioni](index.html): esplorazione grafica iniziale.

**Regola di isolamento:** modifiche solo nel branch `lifeos-visual-lab`. Non distribuire su `main` e non sostituire la codebase `lifeos-v2` senza revisione e approvazione.

---

# LifeOS Visual Lab — Iterazioni navigabili

- **[Batch 01: tre prime direzioni](index.html)** — Aurora Dark, Prism Light, Prism Color (confronto iniziale, conservato).
- **[Batch 02: Swiss + Bento, quattro varianti](batch-02/index.html)** — Aurora Neo-Swiss, Aurora Dynamic (notte), Prism Bold, Prism Bento (giorno), con Quick Add, Command Center, vista lista, dettagli progetto e bento grid.
- [Specifiche e limiti della Batch 02](batch-02/README.md).

---

# LifeOS Visual Lab — Batch 01

Standalone interactive design exploration. **Not the V1 or the actual V2 app**. No Firebase import, login, authentication, database access, or real user data.

## Themes

1. **Aurora Dark** — dark navy, cyan, violet, blue and coral.
2. **Prism Light** — bright white with soft pastel gradients.
3. **Prism Color** — bright white with noticeably stronger violet, turquoise, coral, and amber accents.

## Screens and interactions

Each theme has the same three navigable demo screens: **Oggi**, **Progetti**, **Finanze**. Theme switching preserves the current screen. There is a side-by-side theme comparison gallery; sample task checkboxes and completion metric, project search and filters, and finance chart range selection. Responsive navigation at smaller widths.

Mock data is intentionally synthetic and never persisted or synchronized. Non-working app features are disabled/marked demo.

## How to open

- Use the [Visual Lab code file](https://github.com/kuzo17/life-os/blob/lifeos-visual-lab/design-lab/index.html) and GitHub's **Download raw file** action, then double-click the downloaded HTML in a browser.
- Optional third-party direct previews (availability not guaranteed):
  - https://raw.githack.com/kuzo17/life-os/lifeos-visual-lab/design-lab/index.html
  - https://htmlpreview.github.io/?https://github.com/kuzo17/life-os/blob/lifeos-visual-lab/design-lab/index.html
- Deep links to distinct themes:
  - `#view/aurora/today`
  - `#view/prism/today`
  - `#view/pop/today`

## Isolation and workflow

- Dedicated branch: `lifeos-visual-lab`. Based on V2 documentation branch, not main.
- Only edit files inside `design-lab/` while testing visual directions.
- **Do not merge into main or V2 application automatically.** Once a visual direction is approved, transfer *design tokens, component patterns, accessibility and layout rules* into the actual React/TypeScript design system, rebuilding UI with real domain view models.
- Current HTML is a design prototype, **not production architecture**.
