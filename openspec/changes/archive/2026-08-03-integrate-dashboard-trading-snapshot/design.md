## Context

The production dashboard is a Next.js App Router server page that currently resolves the readable workspace, loads a compact tracked-asset preview, and renders the Current Workspace surface. The reviewed `/dashboard-prototype` contains the desired Trading Snapshot layout, but its four values are route-local mock data. Backend now exposes `GET /dashboard/summary`, which resolves the authenticated user's current workspace and returns one UTC snapshot containing the next high-impact economic-calendar event plus three aggregate counts.

The implementation must keep the production dashboard's existing workspace gate and watchlist behavior, avoid coupling production code to prototype mock data or scenario controls, and preserve independent backend metric states. The backend response is authoritative for workspace scope, time windows, permissions, and aggregate semantics.

## Goals / Non-Goals

**Goals:**

- Add one authenticated frontend request for the live Trading Snapshot.
- Validate the summary response at the frontend API boundary, including nullable metric values and canonical state/error codes.
- Reuse the prototype's four-card hierarchy with production data, existing shadcn primitives, semantic tokens, accessible headings, and localized formatters.
- Keep `AVAILABLE`, `EMPTY`, `DENIED`, and `ERROR` visibly distinct without representing unknown data as zero.
- Keep the prototype route isolated and preserve the Current Workspace loading, empty, permission, and error states.

**Non-Goals:**

- Do not replace the existing workspace or watchlist preview requests; they serve the Current Workspace surface.
- Do not call the four existing list endpoints to recreate summary counts in the frontend.
- Do not add query/body parameters, client-side workspace overrides, polling, caching, refresh controls, charts, links, or new dependencies.
- Do not change the backend endpoint, database, permissions, or `/dashboard-prototype` mock scenarios.
- Do not add a new frontend permission system for metric permissions; the backend metric state is the source of truth.

## Decisions

### 1. Use a small dashboard action and response module

Add one server action under `app/api/dashboard` that calls `fetchAuthenticated("/dashboard/summary")` without query parameters or a body. Add one definitions module under `app/lib/dashboard` for the response types and Zod validation. This mirrors existing feature action/definitions boundaries and keeps backend contract parsing out of the route component.

Alternative considered: compose the summary with existing `/economic-calendar`, `/events`, `/narratives`, and `/news-articles` actions. Rejected because it recreates backend aggregation, produces inconsistent timestamps/scope, and defeats the new endpoint's purpose.

### 2. Load the summary once after workspace context is available

The dashboard server page continues to resolve workspace permission and current workspace before rendering normal content. Once the gate passes, it loads the summary exactly once; the summary request may run in parallel with the existing tracked-asset preview because neither response depends on the other. The frontend sends no workspace ID and does not infer a replacement scope when the backend returns `NO_ACTIVE_WORKSPACE`.

Alternative considered: load the summary in a client component after hydration. Rejected because the route already uses server-side data loading, the endpoint is authenticated, and client loading would add a second visible waterfall.

### 3. Keep metric state mapping local to the Trading Snapshot

The Trading Snapshot component receives the validated summary and maps each metric directly to its card. `nextKeyEvent` renders canonical title, scheduled time, currency, and the existing economic-calendar impact badge helper. Count metrics render localized counts only when the state is `AVAILABLE` or `EMPTY`; `DENIED` and `ERROR` render localized unavailable/error treatment and never use a synthetic zero. The backend-provided windows and narrative statuses remain data metadata rather than being recomputed in the browser.

Alternative considered: normalize all metrics into one generic card model before rendering. Rejected for this four-card surface because it would hide the event/count differences and add an abstraction with one consumer.

### 4. Reuse the presentation, not the prototype implementation

Create a production-local Trading Snapshot component by adapting the `TradingSnapshot` and `SnapshotCard` presentation from the prototype. Reuse existing `Card`, `Badge`, icon, formatter, and semantic-token conventions, but do not import prototype mock constants, scenario props, or route controls. The prototype remains unchanged for visual review.

### 5. Treat top-level and metric failures separately

A successful HTTP 200 response always renders the four metric slots, including independent `DENIED` and `ERROR` states. A top-level 403/409/network failure is handled as a summary-level failure while preserving the already-loaded Current Workspace surface. The shared API error code is not needed to compute cards; if exact endpoint branching becomes a UI requirement, preserve `ErrorBody.code` in the narrow shared fetch error boundary rather than adding a dashboard-specific transport.

### 6. Keep production copy localized

Use dictionary-backed production labels for the section, cards, empty state, unavailable state, and error state in both `vi` and `en`. Reuse existing economic-calendar impact labels and date/number formatters. Do not render backend enum values as user-facing text and do not use the prototype's mock event title/time/currency.

## Risks / Trade-offs

- **[Risk]** The frontend's locally resolved fallback workspace can differ from the backend's current-workspace resolution when multiple workspaces exist without a valid current selection. → Do not fabricate summary scope; show the summary-level failure and retain the existing workspace gate behavior until the backend resolves a valid current workspace.
- **[Risk]** Metric permissions can differ across users. → Render the metric's returned `DENIED` state independently and keep other cards useful.
- **[Risk]** The OpenAPI snapshot does not encode all required/nullable properties. → Validate the known contract at runtime with nullable fields matching the backend DTO/spec semantics, and keep the backend OpenSpec contract as the source of behavioral truth.
- **[Risk]** The summary adds one request to the existing dashboard load. → Run it in parallel with the existing watchlist preview and avoid adding any per-metric requests.
- **[Risk]** A copied prototype card can drift from the production design system. → Use existing shadcn wrappers/semantic tokens and limit the production component to the accepted four-card surface.

## Migration Plan

1. Add the dashboard action and response definitions.
2. Add localized production snapshot copy and the production-local component.
3. Integrate the component into `/dashboard` while preserving the current workspace/watchlist states.
4. Run typecheck, lint, OpenSpec validation, and deterministic response/state checks.
5. Rollback is deleting the new action/definitions/component and removing the dashboard composition call; no backend or persisted-data rollback is required.

## Open Questions

- Product acceptance should confirm the exact visual copy for `DENIED` and `ERROR` cards; the implementation can use localized generic unavailable/error states from the existing dashboard conventions if no copy is supplied.
- BE should repair the strict OpenSpec artifact by adding at least one level-4 scenario to each dashboard-summary requirement; this does not change the frontend plan or endpoint contract.
