---
name: architect-orchestrator
description: >-
  Guides the Architect/Orchestrator agent (Gemini 4 Neon xHigh or Gemini 4 Carbon)
  when planning architecture, breaking large features or refactors into parallel
  non-overlapping slices, briefing Executor workers (Gemini 4 Carbon or Gemini 4 Hydrogen)
  in /teamwork, and running final integration and acceptance gates.
---

# Architect / Orchestrator Runbook

Use this workflow when leading multi-file feature delivery, architectural refactoring, or post-audit remediation on KittyCaffe («Мур-Лате»).

## Model Assignment Policy

- **Orchestrator / Architect** (this role): `Gemini 4 Neon xHigh` (preferred for complex architecture, audit synthesis, and tricky refactoring plans) or `Gemini 4 Carbon`.
- **Complex Executor slices** (state hooks/reducers, `storage.ts` migrations, `sound.ts` Web Audio, Vite chunking/code-splitting, `recipes.ts`/`guests.ts` logic): pin to **`Gemini 4 Carbon`**.
- **Scoped Executor slices** (isolated UI components, SVG polish, copy/a11y updates, unit test expansion, docs updates): pin to **`Gemini 4 Hydrogen`** (or `Gemini 4 Carbon` if closely coupled to TypeScript generics).

## Steps

1. **Ground in Current Reality**:
   - Read [docs/ARCHITECTURE.md](../../../docs/ARCHITECTURE.md) and inspect target files before designing changes.
   - Update shared contracts (`src/types/game.ts`) first or assign a single owner to contract changes before fanning out parallel workers.

2. **Slice with Disjoint File Ownership**:
   - Split work into independent vertical slices where **no two active writers edit the same file**.
   - In `/teamwork`, spawn authoring workers with `workspace: "share"` so each Executor edits and builds cleanly in its own working copy.
   - Every worker brief must explicitly state:
     1. Exact goal and acceptance criteria.
     2. Owned file paths (and files off-limits).
     3. Applicable invariants from `AGENTS.md` (Ukrainian copy, StrictMode safety, `aspect-[8/7]`, no `content-center` on station grids).
     4. Required verification commands (`npm run lint && npm run build && npm test`).

3. **Review & Integrate**:
   - Inspect diffs from each Executor against `AGENTS.md` invariants and `docs/ARCHITECTURE.md`.
   - Merge worker changes cleanly into the coordinator working copy before retiring workers.
   - Update `docs/ARCHITECTURE.md` whenever module boundaries, state management, or build configuration change.

4. **Final Acceptance Gate**:
   - Run `npm run lint && npm run build && npm test`.
   - If UI/layout changed, execute `.agents/skills/visual-qa-barista/SKILL.md` across `1366×720`, `1536×740`, `768×1024`, and `390×844`.
   - Only commit and push to GitHub after every check passes cleanly.
