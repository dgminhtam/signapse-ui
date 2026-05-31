## Why

`AGENTS.md` has grown into a mix of repo-wide policy, implementation recipes, review checklists, and task-specific details. This makes the file useful but noisy, and increases the chance that future agents miss the truly global rules or duplicate guidance that should live in `.codex/skills`.

## What Changes

- Refactor `AGENTS.md` toward a concise repo-wide policy index that keeps only high-value global rules and points task-specific recipes to the relevant skills.
- Consolidate duplicated shadcn/radix-nova chrome rules, skeleton rules, toolbar/list/table/form review rules, and completion checklist items.
- Add explicit encoding-safe editing guidance to avoid UTF-8/newline regressions when editing Markdown, TS, and TSX files.
- Align the feature completion checklist with the agent-owned verification policy: lint, typecheck, OpenSpec validation, static review, or clearly reported skipped checks; no smoke/manual/auth QA as archive-gating tasks by default.
- Preserve existing product constraints that matter globally, including Clerk auth, Vietnamese UI copy, shadcn wrapper usage, URL-driven list state, simplified API hierarchy, and destructive action safeguards.

## Capabilities

### New Capabilities
- `repo-agent-guidance`: Covers the expected structure, scope, and maintenance rules for `AGENTS.md` and its relationship to `.codex/skills`.

### Modified Capabilities

None.

## Impact

- Affected files: `AGENTS.md` and potentially Signapse-specific skill docs under `.codex/skills/` if duplicated recipes need to be moved or cross-referenced.
- No application runtime behavior, API contract, dependency, or UI component behavior should change.
- OpenSpec proposal/apply workflows should become less likely to include non-agent-owned smoke/manual QA tasks as archive blockers.
