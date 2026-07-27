## Context

Market Charts currently initializes all three impact controls, requests calendar events without an impact filter, and filters the returned list in the client. The backend already accepts a repeated `impact` query parameter as a list, normalizes its values, and applies an exact database filter. The frontend request contract and query serializer do not yet expose that capability.

## Goals / Non-Goals

**Goals:**

- Make `HIGH` the only default calendar impact.
- Reduce initial calendar payloads by sending selected impacts to the backend.
- Fetch newly enabled `MEDIUM` or `LOW` events without re-fetching already selected impacts.
- Preserve current range splitting, lazy history loading, client visibility filtering, and failure isolation.

**Non-Goals:**

- Changing backend filtering or synchronization windows.
- Persisting impact selection outside the existing workbench lifecycle.
- Adding a new cache, request library, endpoint, or loading surface.
- Changing marker grouping, placement, or calendar response fields.

## Decisions

### Use the existing repeated backend query parameter

The request contract will carry an array of the existing `HIGH`, `MEDIUM`, and `LOW` values. The action will serialize each value with `URLSearchParams.append("impact", value)`, producing repeated parameters that bind directly to the backend `List<String>`.

Alternative considered: comma-separated values. Rejected because repeated parameters match the backend list contract directly and avoid custom encoding or parsing.

### Fetch only the newly enabled impact

Initial, refresh, layer re-enable, asset/timeframe, and older-history loads will request all currently selected impacts. An interactive transition from unchecked to checked will request only that impact over the current calendar range, then reuse the existing event merge-by-ID behavior.

Alternative considered: re-fetch all selected impacts after every filter change. Rejected because it duplicates high-impact traffic and weakens the purpose of on-demand loading.

### Keep deselection local

Disabling an impact continues to use the existing client filter. Loaded events are retained, so deselection requires no backend call and concurrent or later responses cannot erase previously loaded categories.

Alternative considered: replace the complete event list after every selection change. Rejected because it discards reusable data and can remove events from other selected impacts.

### Use selected-impact state as request intent

The current selected levels will be supplied explicitly to calendar request construction. Empty selection short-circuits calendar fetching. Every split range receives the same impacts so chunking cannot broaden the result.

## Risks / Trade-offs

- [Rapid filter changes can complete out of order] → Merge successful responses by event ID and keep visibility determined by current selection.
- [Re-enabling an impact can re-request a range already loaded] → Accept this bounded duplicate request rather than introduce per-impact range-cache bookkeeping.
- [A newly selected impact can remain selected after its request fails] → Keep existing data intact and expose the existing calendar error feedback so retry remains possible through refresh or reselection.

## Migration Plan

Ship the frontend contract, serializer, and workbench orchestration together. The backend is already compatible. Rollback is the frontend revert; no stored data or backend migration is involved.

## Open Questions

None.
