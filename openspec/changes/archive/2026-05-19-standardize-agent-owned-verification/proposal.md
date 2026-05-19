## Why

Many active OpenSpec changes are blocked from archive by unchecked smoke, browser, authentication, or backend-data verification tasks that Codex cannot reliably execute from the terminal context. This change separates agent-owned verification from user-owned manual QA so completed implementation work can be archived without losing the manual smoke checklist the user will run separately.

## What Changes

- Update repo-wide guidance so OpenSpec task checklists default to Codex-runnable verification only: lint, typecheck, and OpenSpec validation when applicable.
- Stop adding smoke, browser, visual, authenticated-session, local-backend, fixture-dependent, or manual QA checks as unchecked archive-gating tasks unless the user explicitly asks for that.
- Move existing unchecked smoke/auth/backend/manual verification tasks out of archive-gating checkboxes and into user-owned manual QA notes.
- Preserve implementation, cleanup, static validation, and true code verification tasks as archive-gating checklist items.
- Keep final summaries honest by reporting which Codex-owned checks ran and which user-owned manual QA remains outside the archive gate.

## Capabilities

### New Capabilities
- `agent-owned-verification`: Defines how OpenSpec task checklists distinguish Codex-runnable verification from user-owned manual QA.

### Modified Capabilities

## Impact

- Affects `AGENTS.md` repo guidance for verification and OpenSpec task authoring.
- Affects active `openspec/changes/*/tasks.md` files that currently contain unchecked smoke/browser/auth/backend/manual QA tasks.
- Affects future OpenSpec proposal/task creation by narrowing default verification tasks to lint, typecheck, and OpenSpec validation.
- Does not add app runtime behavior, dependencies, API changes, or automated browser testing infrastructure.
