# KittyCaffe («Мур-Лате») — Workspace Agent Rules

These rules govern all AI agents operating in this repository. Read [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) before making structural changes and [docs/AUDITS.md](./docs/AUDITS.md) when addressing external audit findings.

## 1. Multi-Agent Role Topology

This repository is designed for an **Architect / Orchestrator + Executor** workflow in Google Antigravity (including `/teamwork`):

- **Orchestrator / Architect** (`Gemini 4 Neon xHigh` or `Gemini 4 Carbon`):
  - Owns system design, interface contracts (`src/types/game.ts`), external audit triage (`docs/AUDITS.md`), task decomposition into non-overlapping file slices, code review, and final release verification.
  - Activates `.agents/skills/architect-orchestrator/SKILL.md` for multi-slice work and `.agents/skills/external-audit-intake/SKILL.md` when ingesting an external audit (e.g., ChatGPT Sol 6.2).
- **Executor Engineer** (`Gemini 4 Carbon` for complex refactoring/logic/state/perf; `Gemini 4 Hydrogen` for scoped UI/copy/SVG/test tasks):
  - Implements strictly within assigned file ownership and contracts.
  - Activates `.agents/skills/executor-engineer/SKILL.md` and reports exact verification outputs back to the Orchestrator.

## 2. Non-Negotiable Product & Engineering Invariants

1. **100% Ukrainian Player UI**: All visible labels, recipes, tooltips, notifications, modal titles, and dialogues must remain in warm, natural Ukrainian appropriate for a 9-year-old player. Never add punitive timers or failure states.
2. **Watercolor Design System**: Preserve `#FAF4E8` warm paper, `#5A3E32` dark-brown ink contours (never harsh `#000000` borders), honey-wood workbench surfaces, `Comfortaa` UI font, and `Caveat` handwritten headings.
3. **Zero External Runtime Dependencies**: All illustrations live in `public/assets/` (with inline SVG fallbacks) and all audio is synthesized via Web Audio API in `src/services/sound.ts`.
4. **Backward-Compatible Persistence**: `localStorage` key `mur_late_save_v1` in `src/services/storage.ts` must always safely migrate and sanitize older saves (`v1`/`v2`/`v3`) without throwing or losing coins, unlocked recipes, wardrobe, decor, friendship, or rare stickers.
5. **React StrictMode Safety**: Never call `generateOrder()` (or any `Math.random()` / side-effecting `setSpeechText`) inside a functional state updater `setOrder((prev) => ...)`. Compute transitions once via refs, then commit states together.
6. **Domain Rules**:
   - Ingredient validation is order-independent.
   - `Кошеня Пух` never orders espresso (including Secret Drinks containing espresso) and triggers `isPuhCoffeeReject` if served espresso.
   - `Котик-мандрівник` accepts any prepared drink or pastry on the tray.
7. **Layout & Responsive Contracts**:
   - `TopBar` must remain a single horizontal row with zero wrapping across `390px`–`1920px`.
   - Never apply `content-center` or `justify-center` directly to overflowing station button grids. Keep station cards strictly `flex flex-col` with `shrink-0 z-10` headers and `flex-1 min-h-0` grid containers.
   - On `1366×720`, `1536×740`, `768×1024`, and `390×844`: zero horizontal page overflow, `button.top >= header.bottom`, and `element.bottom <= card.bottom - 4`.
   - Keep `cat-marzipan.png` and `MarzipanAccessoriesOverlaySvg` locked inside the same `aspect-[8/7]` container (`640×560`).
8. **Fast Refresh Lint Hygiene**: Never export non-component data catalogs from `.tsx` files (`oxlint` rule `react/only-export-components`). Put catalogs and constants in `src/data/*.ts`.

## 3. Mandatory Verification Gate

Before finishing any code change or landing a worker branch, run and verify:

```bash
npm run lint && npm run build && npm test
```

- Zero TypeScript errors, zero `oxlint` warnings/errors, all domain tests passing.
- Any visual, layout, modal, SVG, or responsive change must additionally pass browser verification per `.agents/skills/visual-qa-barista/SKILL.md`.
