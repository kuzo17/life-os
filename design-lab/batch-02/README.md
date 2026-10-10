# LifeOS Design Lab — Batch 02

## Theme direction
Official design exploration maps to **one future app with two modes**:
- **Dark** → Aurora Dark family; candidate A1 `neo` (Swiss typography, restrained contrast) and A2 `dynamic` (more vivid glow/cards).
- **Light** → Prism Bold family; candidate B1 `bold` (white, cobalt, emerald, orange, high contrast) and B2 `bento` (strong color-blocking and asymmetric components).
- Mode toggle pairs **Neo-Swiss ↔ Prism Bold** and **Aurora Dynamic ↔ Prism Bento**; it preserves the current screen.
- Layout principles: modular Bento Grid, Swiss type hierarchy, keyboard discoverability, fewer clicks, responsive navigation.

## Interactive screens
- **Oggi**: side-by-side hero and task/habit/focus KPI bento grid, task completion preview, Quick Add demo, habits, weekly activity.
- **Progetti**: project filter + text search, card/list layout switch, project detail dialog, keyboard activation.
- **Finanze**: net worth hero and KPI bento grid, chart date-range toggle, asset list, category chart and recent transaction filters.
- **Global**: Ctrl/Cmd+K command center to navigate or create a demo task, plus switch between all four variants.

## Demo data and safety
All figures, tasks, project names, financial values and charts are fictional visual data. Quick Add changes only the current page's DOM; there is no persistence. No Firebase SDK, login, tracking, access token or production API calls. Design code stays isolated in `lifeos-visual-lab/design-lab/batch-02/`; do not merge into V1 or V2 automatically.

## Preview
- [Batch 02 GitHub source](https://github.com/kuzo17/life-os/blob/lifeos-visual-lab/design-lab/batch-02/index.html).
- [Browser preview via RawGitHack (third party; may be unavailable)](https://raw.githack.com/kuzo17/life-os/lifeos-visual-lab/design-lab/batch-02/index.html).
- Direct sections: `#view/neo/today`, `#view/dynamic/today`, `#view/bold/today`, `#view/bento/today`.

## Review checklist
- Visual: compare typography, density, graph readability, whitespace, bento asymmetry, project card readability, Swiss consistency.
- UX: test navigation, theme switching while remaining on same screen, Quick Add, Ctrl/Cmd+K, project filters, project card/list layout, detail dialog, transaction filters, chart ranges.
- Responsive: check 360/390px iPhone, 768px tablet and 1440px desktop, both light and dark, keyboard interaction, reduced motion.
- Contrast: visually inspect and later verify WCAG color contrast using automated testing.
- Status: static source + structure checks performed; **not** certified via automated browser screenshot/end-to-end runs yet.

## Intentional non-features
No functioning calendar, FitOS, projects CRUD, real finances or full UI data architecture. The Batch 02 HTML is a decision artifact, not a substitute for the actual React/TypeScript V2. Approved themes/layout patterns will be translated into real typed UI components.
