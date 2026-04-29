## Why

The repository already has strong project-specific rules, but it lacks a compact, reusable guardrail that can be invoked during implementation, review, and refactor work to keep changes small, purposeful, and verifiable. Adding a small always-visible note to `AGENTS.md` plus a dedicated callable skill will reduce scope creep without making the repo-wide instructions heavier than necessary.

## What Changes

- Add a short implementation guardrail section to `AGENTS.md` covering scope lock, simplicity, surgical edits, and verification.
- Create a dedicated Codex skill that can be called on demand for non-trivial implementation, refactor, bugfix, and review tasks.
- Adapt only the useful principles from `andrej-karpathy-skills-main`; do not import the Claude/Cursor plugin files wholesale.
- Keep the new guidance subordinate to `AGENTS.md`, OpenSpec change instructions, and explicit user requests.
- Avoid adding always-on Cursor or Claude plugin rules as part of this change.

## Capabilities

### New Capabilities

- `implementation-guardrails`: Defines a callable workflow guardrail for scope control, simplicity checks, surgical edits, and verification before completing code changes.

### Modified Capabilities

- None.

## Impact

- Affected documentation: `AGENTS.md`.
- Affected Codex workflow assets: `.codex/skills/<new-skill>/SKILL.md`.
- No runtime application code, backend API contract, package dependency, or UI behavior changes.
