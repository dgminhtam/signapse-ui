## Context

The root overview has been simplified into a single successful-state surface that identifies the current workspace and shows tracked-asset readiness. Backend API mapping shows `GET /narratives` is available and returns `NarrativeSummaryResponse` inside a paged response, but the frontend does not yet expose a dedicated narrative module. The user has explicitly chosen `/narratives` as the source for overview narrative data and wants backend-side filtering/relevance, not client-side filtering.

## Goals / Non-Goals

**Goals:**

- Add a compact read-only narrative preview to the root overview.
- Use `GET /narratives` as the only data source for the preview.
- Keep relevance, workspace/watchlist scoping, filtering, and ranking on the backend.
- Keep the overview hierarchy simple: workspace identity, tracked assets, then narrative preview.
- Preserve permission-aware behavior for users without `narrative:read`.

**Non-Goals:**

- Do not create a narrative list page, detail page, route, sidebar item, or quick-detail drawer.
- Do not add create, update, archive, refresh, or management operations for narratives.
- Do not derive narrative relevance in the browser from watchlist assets, workspace fields, graph data, or market query data.
- Do not change the backend API contract in this frontend change.

## Decisions

1. Use `/narratives` directly for the overview preview.

   The frontend will request a preview-sized page from `GET /narratives`, such as `size=3` with backend-supported sort/query parameters when available. The client will render the returned narratives as authoritative. Alternative considered: reusing `market-query` `keyNarratives[]`; rejected because the user explicitly chose `/narratives` and market-query is a separate workflow with a different intent.

2. Delegate relevance and filtering to the backend.

   The overview will not filter returned narratives by tracked assets, workspace membership, primary asset, or theme on the client. This avoids duplicating business logic in the UI and prevents mismatches when backend relevance rules evolve. Alternative considered: client filtering against watchlist assets; rejected by product decision.

3. Render the preview as a separate overview section.

   The narrative preview will be a sibling section below the workspace/tracked-asset panel. This keeps workspace setup and market intelligence visually distinct while preserving a simple vertical hierarchy. It will use a section heading plus dense rows, not nested cards or a second metric tile. Alternative considered: keeping narratives inside the workspace panel; rejected because narratives are insight content, not workspace configuration.

4. Hide the section when permission is missing.

   Users without `narrative:read` should not see an access-denied block on the overview. This keeps the root page focused and avoids showing unavailable capability noise. Alternative considered: showing a disabled/error panel; rejected because permissions are not actionable from this screen.

5. Keep empty and error states compact and non-blocking.

   Narrative load failure or empty results should not block the workspace overview. Empty/error copy should stay localized and short, with the rest of the overview still usable.

## Risks / Trade-offs

- Backend does not yet scope `/narratives` exactly as the overview expects -> The UI will still render whatever page is returned and the spec explicitly records backend-owned relevance so contract gaps are visible.
- Narrative preview could make the overview busy again -> Limit to three rows, use only decision-useful fields, and keep it under tracked assets.
- Permission model may not be exposed in the same way as other overview data -> Reuse the existing permission pattern in the page/action layer and hide the section if permission cannot be confirmed.
- API response shape could be partially empty -> Use defensive DTO parsing and fallback display for optional thesis/summary, primary asset, confidence, and updated time.
