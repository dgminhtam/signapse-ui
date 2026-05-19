## Why

Backend now exposes a real Event read surface and operator enrich endpoints, while the frontend still stops at source-document derivation. This leaves FE without a canonical way to browse events, inspect event evidence, or trace from a source document into the linked event graph.

## What Changes

- Add a dedicated frontend `events` feature for list and detail read flows using `GET /events` and `GET /events/{id}`.
- Add authenticated event operator actions for:
  - enriching assets/themes for a single event
  - enriching pending events in batch
- Gate event browsing with `event:read`.
- Gate event enrich operators with `source-document:analyze`, matching the backend permission decision; do not use `event:crawl` in FE for now.
- Extend source-document detail data mapping to include `linkedEvents` returned by `GET /source-documents/{id}`.
- Add a `Sự kiện liên kết` section on source-document detail so operators can trace from a source document into linked events.
- Allow navigation from linked-event summaries into event detail only when the current user has `event:read`.
- Add an `Sự kiện` navigation entry so the new event read surface is discoverable from the protected app.
- Update `docs/APIMAPPING.md` to reflect FE coverage for event list/detail, event enrich operators, linked-event traceability, and the current permission mapping.

## Capabilities

### New Capabilities
- `event-read-and-enrichment`: Browse event data, inspect event relations and evidence, and trigger manual asset/theme enrichment from the frontend.
- `source-document-linked-events`: Surface linked-event summaries on source-document detail and connect source-document traceability to the new event detail pages.

### Modified Capabilities
- None.

## Impact

- New event types, labels, and helpers in `app/lib/events/*`.
- New event server actions in `app/api/events/action.ts`.
- New protected routes and UI under `app/(main)/events/*`.
- Updated source-document definitions and detail UI under `app/lib/source-documents/*` and `app/(main)/source-documents/*`.
- Updated navigation in `config/site.ts`.
- Updated API mapping notes in `docs/APIMAPPING.md`.
