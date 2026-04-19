## Context

The current frontend source-document feature already supports list, detail, analyze, crawl, delete, and feature-image-related behavior. The latest backend snapshot extends that same domain with event-derivation endpoints and fields, but the frontend definitions and UI still stop at content crawl state.

This creates a cross-cutting gap across:
- `app/lib/source-documents/definitions.ts`, which does not yet model event-derivation fields and result DTOs
- `app/api/source-documents/action.ts`, which does not expose mutation helpers for single-document or batch derivation
- `app/(main)/source-documents/*`, which has no operator controls or visibility for event-derivation progress
- `docs/APIMAPPING.md`, which does not yet describe the new source-document event endpoints

Constraints that matter for this change:
- The current backend spec does not expose a standalone `/events` frontend management domain; event derivation is attached to `source-documents`.
- The repo expects authenticated mutations through `fetchAuthenticated()`, `ActionResult<T>` wrappers, server-side `revalidatePath()`, and professional Vietnamese UI copy.
- The current permission model is still in compatibility mode for source documents, so the design should avoid inventing speculative event-specific permission keys.

## Goals / Non-Goals

**Goals:**
- Align frontend source-document types with the backend event-derivation contract.
- Add event-derivation server actions for single-document and batch workflows.
- Let operators see event-derivation status directly in source-document list and detail screens.
- Let authorized users trigger event derivation from the existing source-document management UX with clear pending, success, and error feedback.
- Keep the API mapping documentation current for the newly supported endpoints.

**Non-Goals:**
- Creating a standalone `/events` route, event detail page, or event management module.
- Changing backend APIs, response payloads, or permission keys.
- Building bulk selection UX for arbitrary source-document subsets; the batch action only targets the backend's pending-news derivation endpoint.
- Adding historical audit trails beyond the latest derivation status, timestamps, and error fields already exposed by the backend.

## Decisions

### 1. Event derivation stays inside the `source-documents` feature boundary
The frontend will treat event derivation as an extension of source-document operations rather than introducing a new route group or domain module.

Why:
- The backend contract exposes derivation under `/source-documents/*`.
- Operators already review crawl status, analysis, and content quality in the same screens, so derivation status belongs in that operational context.

Alternatives considered:
- Create a new `events` frontend module now.
- Rejected because the API snapshot does not provide a canonical `/events` integration surface for FE yet, and a speculative module would add drift.

### 2. Derivation permissions will reuse the current source-document analyze compatibility layer
The single-document and batch derivation controls will be gated by the same permission helper currently used for source-document analysis actions.

Why:
- Derivation is an operator-triggered AI/content-processing action, closer to analyze than to delete.
- The current auth model already uses compatibility permissions for source-document rollout, and the backend snapshot does not confirm a separate derivation permission.

Alternatives considered:
- Add a new hypothetical `event:derive` or `source-document:derive-event` permission gate.
- Rejected because it would guess unsupported keys and risk hiding the feature for valid users.

### 3. The list page will surface derivation as status-plus-batch-control, not as a second heavy toolbar flow
The list screen will add an event-derivation badge per row and a single toolbar action for batch derivation of pending news events. The batch action will not add per-row expanded summaries on the list page.

Why:
- Operators need quick visibility into which documents still need derivation, without overwhelming the main content table.
- The backend batch endpoint already encapsulates selection logic, so the UI only needs one intentional trigger and a concise result summary.

Alternatives considered:
- Show detailed derivation result text inline on every row.
- Rejected because list density would degrade and most result details are only useful when investigating a specific document.

### 4. The detail page becomes the canonical place to inspect derivation metadata
`/source-documents/[id]` will add a dedicated "Suy diễn sự kiện" section that shows the latest derivation status, attempted/completed timestamps, and latest error. For `NEWS` documents, this section also hosts the single-document trigger.

Why:
- The detail page already serves as the readable, high-context surface for metadata inspection.
- This keeps the list page lightweight while still making operator diagnostics easy.

Alternatives considered:
- Put the single-document derive button only in the header action row.
- Rejected because the result context and status metadata live lower on the page, so colocating the action with derivation metadata is clearer.

### 5. Result feedback will favor concise operator summaries over persistent local state
After a derive mutation succeeds, the frontend will show a toast that summarizes the backend response using `outcome`, `changeType`, and `message`, then refresh data through route revalidation and `router.refresh()`.

Why:
- The backend is the source of truth for current derivation state.
- Toast summaries provide immediate feedback without adding separate client-side stores for transient result objects.

Alternatives considered:
- Store and render a client-only "last result" panel after mutation.
- Rejected because it duplicates backend state and becomes stale after navigation or refresh.

## Risks / Trade-offs

- [Batch derivation may take noticeable time and return mixed outcomes] → Use pending feedback, disable the trigger while running, and summarize counts clearly in the success toast.
- [The backend result includes `eventId` and `eventCanonicalKey`, but FE has no event route yet] → Surface those values only in concise summaries for now and avoid promising deep-link navigation that does not exist.
- [Permission semantics may change later] → Isolate gating behind existing source-document permission helpers so a future permission rename stays localized.
- [Non-news documents may still carry derivation fields in responses] → Gate derive controls to `NEWS` documents, but keep read-only derivation metadata tolerant of any returned status fields.

## Migration Plan

1. Extend source-document frontend definitions with derivation status enums and result DTOs.
2. Add server actions for single-document and batch derivation, including `revalidatePath()` calls for list and detail routes.
3. Update source-document list and detail UI to display derivation status and expose derivation actions where allowed.
4. Update API mapping documentation to include the new endpoints and current frontend coverage notes.
5. Validate list/detail flows, mutation feedback, and route refresh behavior against the local backend.

## Open Questions

- Should the batch toolbar action expose a configurable `batchSize`, or should v1 keep a fixed frontend default and only pass an override later if operators ask for it?
- Do we want the detail page to display `eventId` and `eventCanonicalKey` when a single-document derivation succeeds, or keep those values in toast feedback only until an event surface exists?
