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
