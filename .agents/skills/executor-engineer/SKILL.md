---
name: executor-engineer
description: >-
  Guides Executor agents (Gemini 4 Carbon or Gemini 4 Hydrogen) when implementing
  scoped feature slices, bug fixes, refactors, or tests assigned by the Architect/Orchestrator.
---

# Executor Engineer Runbook

Follow this procedure when executing an assigned task slice in KittyCaffe («Мур-Лате»).

## Steps

1. **Confirm Scope & Ownership**:
   - Read the Architect's brief and inspect every file in your assigned ownership list before making edits.
   - Do **not** modify files outside your assigned scope unless explicitly approved by the Orchestrator. If a shared contract in `src/types/game.ts` needs adjustment, report the exact proposed change to the Orchestrator first.

2. **Implement Cleanly**:
   - Preserve 100% Ukrainian player-facing copy and the `#FAF4E8` / `#5A3E32` Studio Ghibli watercolor palette.
   - Keep pure data catalogs in `src/data/*.ts` (never export non-components from `.tsx` files).
   - Never add `content-center` on station ingredient grids or remove `min-h-0` from flex scroll/grid wrappers.
   - Never call `Math.random()` or secondary `setState` calls inside React state updaters (`setState(prev => ...)`).
   - Maintain backward compatibility for `mur_late_save_v1` in `src/services/storage.ts`.

3. **Verify Before Reporting Done**:
   - Run in one command:
     ```bash
     npm run lint && npm run build && npm test
     ```
   - Fix all TypeScript, `oxlint`, or test failures before reporting back.
   - Check `git status` and `git diff --stat` to ensure no stray scratch files or unintended edits exist.

4. **Report Concise Evidence**:
   - Summarize modified files, key behavior changes, verification command outputs, and any edge cases or follow-ups for the Orchestrator.
