## Why

Backend has simplified the event domain contract, but the frontend event screens still present the older model with separate lifecycle status, enrichment status, active flag, and enrichment timestamps. This makes the event UI heavier than the data now supports and pushes the most useful operator information below secondary metadata.

The same drift can happen again on future simplified backend surfaces, so the repo-wide implementation guidance should capture the principle: when BE reduces a feature contract, FE should reduce the screen around the remaining user decisions instead of preserving obsolete sections.

## What Changes

- Refine `/events` list to align with the simplified event contract: `title`, `description`, `status`, `confidence`, `occurredAt`, and the detail action become the primary scanning fields.
- Refine `/events/{id}` detail to remove obsolete enrichment/active sections and move high-value information above the fold.
- Treat `status` as the single event enrichment lifecycle indicator with labels for `ENRICHMENT_PENDING`, `ENRICHED`, `ENRICHMENT_NO_MATCH`, `ENRICHMENT_FAILED`, and `ARCHIVED`.
- Keep evidence, assets, and themes as the meaningful detail sections, with evidence prioritized before supporting classifications.
- Move technical identifiers and audit timestamps into a lower-priority technical details area.
- Update `AGENTS.md` with a reusable rule for simplified backend feature surfaces: simplify the UI information hierarchy, remove obsolete fields, and put user-relevant information first.
- Update `docs/APIMAPPING.md` after implementation so event coverage reflects the new FE alignment.

## Capabilities

### New Capabilities

- `event-simplified-workbench`: Covers the simplified event list/detail experience, status presentation, prioritized detail sections, and event operator actions under the new backend contract.
- `simplified-admin-surface-hierarchy`: Covers the repo-wide UX rule that simplified backend contracts should result in simplified frontend screens and documentation guidance in `AGENTS.md`.

### Modified Capabilities

- None.

## Impact

- Event contract and labels in `app/lib/events/definitions.ts` and `app/(main)/events/event-presentation.ts`.
- Event list and skeleton in `app/(main)/events/event-list.tsx` and `app/(main)/events/page.tsx`.
- Event detail layout in `app/(main)/events/[id]/page.tsx`.
- Event enrichment button/toast helpers where outcome enum names change.
- Repo guidance in `AGENTS.md`.
- API mapping notes in `docs/APIMAPPING.md`.
