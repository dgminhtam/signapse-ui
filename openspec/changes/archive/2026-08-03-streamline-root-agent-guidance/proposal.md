## Why

The root `AGENTS.md` repeats domain-specific API, library, localization, and UI guidance that now exists in scoped `AGENTS.override.md` files. This increases instruction load, obscures repo-wide policy, and still contains stale route paths that omit the required `app/[lang]` locale segment.

## What Changes

- Add a compact scoped-instruction router to the root guidance for `app/api/**`, `app/lib/**`, and UI work under `app/[lang]/**` or `components/**`.
- Remove root rules that are fully owned by the corresponding override while preserving cross-domain and product-critical constraints that do not yet have a scoped owner.
- Correct protected, authentication, and feature route examples to use `app/[lang]/(main)` and `app/[lang]/(auth)`.
- Keep `AGENTS.md` and `AGENTS.vi.md` structurally and semantically synchronized.
- Verify that no required API, localization, UI safety, quick-detail, sidebar, validation, or review policy is lost during consolidation.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `repo-agent-guidance`: Define scoped instruction routing, locale-aware route accuracy, safe de-duplication, and bilingual synchronization for root agent guidance.

## Impact

- Affected files: `AGENTS.md` and `AGENTS.vi.md`.
- Referenced scoped guidance: `app/api/AGENTS.override.md`, `app/lib/AGENTS.override.md`, and `components/AGENTS.override.md`.
- No application runtime, API contract, dependency, or user-facing behavior changes.
