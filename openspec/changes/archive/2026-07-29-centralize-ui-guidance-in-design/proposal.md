## Why

Detailed UI and UX conventions are split between `AGENTS.md`, `components/AGENTS.override.md`, and `docs/design/DESIGN.md`, creating duplication, inconsistent ownership, and active conflicts such as cardless pages versus a page Card shell and Geist versus Inter. Centralizing durable UI guidance in one design source keeps agent instructions concise while making UI implementation and review consistent.

## What Changes

- Make `docs/design/DESIGN.md` the source of truth for Signapse visual, layout, interaction, content, state, and accessibility conventions.
- Reconcile the current design document with the implemented stack and active `radix-nova` policies, including typography, page surfaces, wrapper customization, theme tokens, and cardless list-page composition.
- Move detailed UI rules from `AGENTS.md` and `components/AGENTS.override.md` into `DESIGN.md` without moving architecture, ownership, localization mechanisms, security, validation, workflow, or verification policy.
- Require agents implementing or reviewing any user-visible UI or interaction under `app/[lang]/**` or `components/**` to read both the scoped component guidance and `docs/design/DESIGN.md`.
- Remove stale rollout-specific material from the persistent design source and retain only durable UI direction and review criteria.
- Keep `app/api/AGENTS.override.md` and `app/lib/AGENTS.override.md` unchanged.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `financial-command-surface-design`: Expand the persistent design document from a rollout-oriented visual baseline into the authoritative UI/UX convention source and remove requirements for stale pilot, rollout, deferred-target, and rollback sections.
- `repo-agent-guidance`: Route all UI implementation and review work to the design source while keeping root and component instructions focused on workflow, architecture, ownership, technical boundaries, and review reporting.

## Impact

- Affected files: `docs/design/DESIGN.md`, `AGENTS.md`, and `components/AGENTS.override.md`.
- Affected specs: `financial-command-surface-design` and `repo-agent-guidance`.
- No application runtime, API contract, dependency, permission, localization data, or user-facing behavior changes.
