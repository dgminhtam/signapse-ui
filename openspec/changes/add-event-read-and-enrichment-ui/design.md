## Context

The frontend already supports `source-documents` as the canonical content domain and has recently added event-derivation actions there. The backend has now moved beyond derivation and provides:

- `GET /events` for browsing events
- `GET /events/{id}` for full event detail with `assets`, `themes`, and `evidence`
- `POST /events/{id}/enrich-assets-and-themes` for single-event enrichment
- `POST /events/enrich-pending-assets-and-themes` for batch enrichment
- `linkedEvents` on `GET /source-documents/{id}` for reverse traceability

The current frontend gap is therefore not one feature but a chain:

- no `events` module, route tree, or server actions
- no event DTOs or labels in FE
- no rendering of `linkedEvents` on source-document detail
- stale compatibility permissions in `app/lib/source-documents/permissions.ts`
- no navigation entry into the new event surface

The backend permission model is now clear enough to design against:

- `event:read` gates event browsing
- `source-document:analyze` gates source-document analyze/crawl/derive and event enrich operators
- `source-document:update` gates source-document update actions such as feature-image patch
- `source-document:delete` gates source-document deletion
- `event:crawl` exists in BE but is intentionally not used by FE in this change

## Goals / Non-Goals

**Goals:**
- Add a dedicated `events` read surface in the frontend with list and detail routes.
- Let operators run manual event enrichment from list/detail when they have `source-document:analyze`.
- Surface `linkedEvents` on source-document detail to close the traceability loop between content and events.
- Align permission helpers and navigation with the backend's current permission decisions.
- Keep `docs/APIMAPPING.md` current so FE ownership of the event surface is explicit.

**Non-Goals:**
- Adding create/update/delete CRUD for events.
- Using `event:crawl` anywhere in FE.
- Building a complex event search/filter builder in v1.
- Introducing a separate event administration dashboard outside the standard protected route tree.
- Changing backend response shapes, permission keys, or operator semantics.

## Decisions

### 1. Introduce a dedicated `events` frontend feature under `app/(main)/events`
The frontend will treat events as their own protected read surface with a list page, detail page, local `error.tsx`, and feature-local components following the repo's standard route structure.

Why:
- The backend now has canonical browse endpoints for events.
- Event detail has its own object graph (`assets`, `themes`, `evidence`) that is too rich to keep burying inside source-document-only views.

Alternatives considered:
- Keep events hidden and rely only on `linkedEvents` summaries inside source-document detail.
- Rejected because operators need a first-class browse surface and a dedicated place to run event enrich actions.

### 2. Event browsing and event operators will use different permission families
The UI will gate route access, navigation, and event detail links with `event:read`. It will gate `enrich-assets-and-themes` and `enrich-pending-assets-and-themes` with `source-document:analyze`.

Why:
- This matches the backend guidance and avoids inventing a frontend interpretation of `event:crawl`.
- It keeps the read surface discoverable only to users who can browse events, while still letting BE treat enrich as a content-processing operator action.

Alternatives considered:
- Gate enrich buttons with `event:crawl`.
- Rejected because BE explicitly said that permission is not currently used in this flow.

### 3. `linkedEvents` remains visible as traceability metadata on source-document detail
`linkedEvents` summaries will render on source-document detail whenever the backend returns them and the user can read the source document. Event deep links inside that section will only be interactive when the user also has `event:read`.

Why:
- The source-document detail page is the natural place to understand what event, if any, was linked from a specific document.
- Hiding the entire section when `event:read` is absent would throw away useful traceability data the user is already authorized to see via the source-document response.

Alternatives considered:
- Hide the entire linked-events section unless the user has `event:read`.
- Rejected because summary metadata is still useful even without permission to browse the full event module.

### 4. Event list v1 will optimize for browse and operations, not advanced filtering
The first event list surface will support pagination and sort using the repo's existing search-param conventions, and it may omit complex `$filter` UX in v1. The table/card surface will focus on `title`, `status`, `enrichmentStatus`, `occurredAt`, and `confidence`, plus a batch enrich action.

Why:
- The backend already supports the standard paging contract, so FE can ship a useful browse surface without blocking on filter-builder design.
- This keeps the first event module small enough to implement and verify safely.

Alternatives considered:
- Build search and multi-field filtering immediately.
- Rejected because BE explicitly framed filter support as optional for an initial FE integration.

### 5. Batch event enrich will use a simple operator trigger with the backend default batch size
The event list toolbar will expose one batch enrich control that calls `POST /events/enrich-pending-assets-and-themes` without asking the user for a custom batch size in v1.

Why:
- The backend already defines a default of `50`.
- A single, predictable operator action fits the repo's current UX style better than introducing another inline numeric control on first release.

Alternatives considered:
- Add a configurable `batchSize` input in the toolbar.
- Rejected because it adds UI weight before operators have asked for that flexibility.

### 6. Permission helpers will be split by domain and cleaned up
The change will introduce dedicated event permission helpers and remove stale `article:*` and `event:*` fallbacks from source-document permission arrays. Source-document buttons such as analyze, crawl, derive, and event enrich entry points will rely on explicit `source-document:*` permissions.

Why:
- The backend permission model is now explicit enough that compatibility fallbacks become misleading.
- Centralized helpers reduce the chance that route guards and button guards drift apart.

Alternatives considered:
- Keep the compatibility arrays for now and only add new event helpers.
- Rejected because that would preserve incorrect access decisions for users who only have event permissions.

## Risks / Trade-offs

- [Cross-domain operator permissions may surprise developers] → Document the matrix in helper modules and `APIMAPPING.md`, and keep guards centralized.
- [No advanced event filtering in v1 may limit discoverability on large datasets] → Ship browse, sort, and pagination first, then add richer filters only if operators need them.
- [Users without `event:read` will see linked-event summaries but not full navigation] → Make the non-clickable state explicit in the linked-events section so the missing navigation feels intentional, not broken.
- [Adding a new route tree increases UI surface area] → Reuse existing page/list/detail patterns and keep v1 focused on read + operator actions only.

## Migration Plan

1. Add frontend event definitions and permission helpers.
2. Add event server actions and route-level read integration.
3. Add event list/detail UI and navigation entry.
4. Extend source-document detail with `linkedEvents`.
5. Update API mapping documentation and verify permission-sensitive flows.

## Open Questions

- None at the moment; backend route, DTO, and permission direction are clear enough to proceed.
