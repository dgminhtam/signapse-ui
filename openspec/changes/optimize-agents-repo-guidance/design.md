## Context

`AGENTS.md` is the repo-wide instruction surface for Codex. It currently contains valuable rules, but it also repeats implementation-level recipes that are better maintained in `.codex/skills`, especially around shadcn composition, hydration mismatch debugging, list/table/form UI patterns, skeleton layout, and review findings.

The repository already has Signapse-specific skills for shadcn, implementation guardrails, frontend design, hydration mismatch, accessibility, OpenSpec proposal/apply/archive workflows, and API mapping. The optimized AGENTS structure should make those skills easier to discover instead of duplicating their full content in the root guidance file.

## Goals / Non-Goals

**Goals:**
- Keep `AGENTS.md` as the authoritative repo-wide policy file.
- Reduce duplicated or overly specific instructions while preserving the intent of important guardrails.
- Add encoding-safe edit guidance for Markdown, TypeScript, and TSX files.
- Make the feature completion checklist match the agent-owned verification policy.
- Add clear skill routing so agents know when to consult `.codex/skills`.

**Non-Goals:**
- Do not change application runtime behavior, UI implementation, API contracts, dependencies, or build scripts.
- Do not remove product-critical rules such as Vietnamese UI copy, Clerk authenticated fetches, shadcn wrapper usage, URL-driven list state, and destructive action safeguards.
- Do not move large chunks into skills unless the target skill already exists or the move is small and directly tied to this cleanup.
- Do not add smoke/browser/manual/auth/backend-data QA as archive-gating tasks.

## Decisions

### Keep AGENTS as policy, not a full recipe book

AGENTS should retain global constraints that affect most implementation work: stack summary, route conventions, API/auth rules, UI language, shadcn wrapper policy, verification expectations, and review categories. Long recipes should be summarized and linked to skills.

Alternative considered: keep all detailed rules in AGENTS for maximum visibility. This was rejected because the file becomes harder to scan and duplicates skill responsibilities.

### Consolidate repeated UI governance into compact rule groups

Repeated rules about shadcn chrome, toolbar/table spacing, skeleton mirroring, and cardless layouts should be grouped once in the relevant section. Review guidance should refer to drift categories instead of repeating full implementation rules.

Alternative considered: remove the review section entirely. This was rejected because review expectations are useful, but they should be compact and category-based.

### Add explicit encoding-safe editing guidance

AGENTS should tell agents to preserve UTF-8 and avoid whole-file rewrites with tools that can change encoding or newlines. `apply_patch` should remain the preferred manual edit path; scripted edits should be narrow and encoding-aware.

Alternative considered: rely on general Codex editing instructions. This was rejected because this repo has already seen encoding/match failures, and a repo-local reminder reduces recurrence.

### Keep verification agent-owned

The completion checklist should require lint/typecheck/OpenSpec validation or explicit skipped-check reporting. Smoke, browser, authenticated-session, backend-data, fixture-dependent, visual, and manual QA should remain user-owned unless explicitly requested.

Alternative considered: keep smoke testing in completion checklists as a reminder. This was rejected because it recreates archive blockers Codex cannot reliably complete in this project.

## Risks / Trade-offs

- [Risk] Over-trimming AGENTS may hide important project rules from future agents. -> Mitigation: keep all global invariants in AGENTS and only summarize recipes already covered by skills.
- [Risk] Skills may drift from AGENTS after the cleanup. -> Mitigation: add a clear rule that detailed reusable workflows live in `.codex/skills` and update relevant skills when AGENTS points to them.
- [Risk] Review guidance may become too abstract. -> Mitigation: keep concrete finding categories and examples for the most common drift types.
- [Risk] Encoding guidance may be ignored during bulk edits. -> Mitigation: include it in guardrails and apply tasks, and verify the file remains readable after edits.
