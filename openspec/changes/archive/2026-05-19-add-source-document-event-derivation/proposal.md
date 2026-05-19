## Why

The backend now exposes event-derivation behavior directly on `source-documents`, but the frontend still stops at crawl and analyze flows. This leaves a contract gap in types, actions, and UX right where operators need to monitor and trigger primary-event derivation for news documents.

## What Changes

- Extend frontend source-document DTOs to include event-derivation status and result shapes from the current API snapshot.
- Add authenticated server actions for:
  - deriving a primary event from a single source document
  - deriving pending news events in batch
- Revalidate `/source-documents` and `/source-documents/[id]` after event-derivation mutations succeed.
- Add event-derivation status badges to source-document list and detail views.
- Add a dedicated detail section for event-derivation metadata, including status, attempted time, completed time, and latest error.
- Add a per-document action to derive the primary event for `NEWS` source documents.
- Add a batch action in the source-document list toolbar to derive pending news events.
- Show success and failure feedback using toast copy and result summaries based on backend `outcome`, `changeType`, and `message`.
- Update `docs/APIMAPPING.md` to document the two new source-document event-derivation endpoints.

## Capabilities

### New Capabilities
- `source-document-event-derivation`: Manage source-document event-derivation contract, actions, and operator UX for single-document and batch event derivation flows.

### Modified Capabilities
- None.

## Impact

- Affected source-document types in `app/lib/source-documents/definitions.ts`.
- Affected source-document server actions in `app/api/source-documents/action.ts`.
- Affected source-document list and detail UI under `app/(main)/source-documents/*`.
- Affected source-document permission handling and action affordances where event-derivation controls are surfaced.
- Affected API documentation in `docs/APIMAPPING.md`.
