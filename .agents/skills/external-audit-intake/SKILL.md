---
name: external-audit-intake
description: >-
  Guides the Architect/Orchestrator when receiving an independent audit report from
  an external AI model (such as ChatGPT Sol 6.2), verifying every finding against
  the actual codebase, triaging priorities in docs/AUDITS.md, and planning safe
  remediation waves for Executor agents.
---

# External Audit Intake & Remediation Runbook

Use this skill whenever the user supplies an audit report from **ChatGPT Sol 6.2** or another external reviewer.

## Core Principle: Verify Before Acting

Never apply external audit suggestions blindly. External models may inspect partial snapshots, miss React 19 / Tailwind v4 idioms, or flag intentional design choices (such as zero-failure cozy UX or local Web Audio synthesis).

## Steps

1. **Parse & Inventory Findings**:
   - Break the incoming audit report into atomic items with sequential IDs (`SOL-001`, `SOL-002`, ...).
   - Categorize each item: `Architecture`, `Correctness / Bugs`, `Performance / Bundle`, `Accessibility`, `Security / Storage`, `Testing / CI`, `UX / Layout`.

2. **Verify Against Actual Source Code**:
   - Read the referenced files and line ranges in parallel.
   - Classify each finding accurately:
     - **`Confirmed`**: Real issue verified in current code.
     - **`Partially Valid`**: Real concern, but root cause or scope differs from the audit text.
     - **`False Positive`**: Already handled or factually inaccurate (cite exact file and line numbers).
     - **`Deferred`**: Valid idea, but out of scope for the current milestone (explain why).

3. **Prioritize & Record in `docs/AUDITS.md`**:
   - Assign severity (`P0`, `P1`, `P2`, `P3`) using the rubric in [docs/AUDITS.md](../../../docs/AUDITS.md).
   - Record all findings, verification verdicts, and target Executor models (`Gemini 4 Carbon` vs `Gemini 4 Hydrogen`) in `docs/AUDITS.md`.

4. **Plan & Execute Remediation Waves**:
   - **Wave 1 (`P0` + `P1`)**: Correctness, persistence safety, visual/layout defects, security issues.
   - **Wave 2 (`P2`)**: Structural refactors (e.g., splitting `App.tsx`, `React.lazy` code-splitting, a11y focus management, expanded tests).
   - **Wave 3 (`P3`)**: Polish and low-risk enhancements (only if approved by the user).
   - Delegate disjoint slices to Executors using `.agents/skills/architect-orchestrator/SKILL.md`.

5. **Close the Audit Loop**:
   - Run `npm run lint && npm run build && npm test` plus browser QA if UI changed.
   - Update every resolved item in `docs/AUDITS.md` to `Fixed & Verified` with commit/file references, and update `docs/ARCHITECTURE.md` to reflect the improved system.
