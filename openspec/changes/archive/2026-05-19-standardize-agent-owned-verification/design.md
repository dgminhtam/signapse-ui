## Context

Signapse OpenSpec changes often include final smoke, browser, visual, authenticated-session, or backend-data checks. Those checks are useful product QA, but they are not reliably runnable by Codex because the local terminal context usually lacks a Clerk browser session, seeded backend data, chart/provider fixtures, and permission-specific workspaces. As a result, otherwise complete changes remain `in-progress` and cannot be archived cleanly.

The repo already has reliable agent-owned checks: targeted lint, project typecheck, OpenSpec validation, static searches, and code review against `AGENTS.md`. The user will own manual smoke testing in an authenticated browser session.

## Goals / Non-Goals

**Goals:**
- Make `AGENTS.md` explicit that OpenSpec task checklists should default to Codex-runnable verification.
- Prevent future proposals from adding smoke/browser/auth/backend/manual QA as unchecked archive-gating tasks unless the user explicitly asks.
- Convert existing unchecked smoke-like tasks into checked transfer notes or non-checkbox `User-owned manual QA` notes so active changes can reach archive readiness.
- Preserve manual QA details so the user still has a clear list of what to test outside the agent archive gate.

**Non-Goals:**
- Do not add Playwright, Clerk test sessions, backend seeding, or any automated browser-testing infrastructure.
- Do not claim that Codex performed smoke tests it did not run.
- Do not mark implementation, cleanup, lint, typecheck, static search, or OpenSpec validation tasks complete unless they have actually been completed.
- Do not modify archived changes.

## Decisions

### Treat smoke/manual QA as user-owned verification

Unchecked tasks whose completion depends on an authenticated browser, local backend data, fixtures, visual inspection, route interaction, or manual smoke behavior will be moved out of the archive gate. The details should remain in a `User-owned manual QA` note so the user can perform them after implementation.

Alternative considered: keep smoke tasks unchecked and document the blocker. Rejected because it keeps completed implementation changes permanently unarchivable.

### Preserve archive-gating tasks for agent-runnable checks

Lint, typecheck, OpenSpec validation, static searches, dependency cleanup, implementation work, and deterministic code checks remain normal checklist tasks. These are within Codex's responsibility and should still block archive when incomplete.

Alternative considered: convert all remaining verification tasks to notes. Rejected because it would weaken the actual quality gate Codex can own.

### Convert old smoke tasks without rewriting product scope

Existing smoke-like tasks should be converted mechanically and narrowly. The implementation should not change feature requirements, product behavior, or app code while doing this cleanup.

Alternative considered: regenerate each old `tasks.md` from scratch. Rejected because it risks losing context and completed-task history.

## Risks / Trade-offs

- [Risk] A true implementation task could be misclassified as smoke because it mentions drag, hover, backend, or visual behavior. -> Mitigation: review each unchecked task before conversion and leave implementation tasks untouched.
- [Risk] Archiving may appear to mean manual QA has passed. -> Mitigation: use explicit wording such as `User-owned manual QA` and final summaries that distinguish Codex-owned checks from user-owned smoke.
- [Risk] Future agents may reintroduce smoke tasks from habit. -> Mitigation: update both `AGENTS.md` and the OpenSpec proposal/apply guidance used in this repo.
