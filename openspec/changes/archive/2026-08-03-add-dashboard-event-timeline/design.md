## Context

The production localized dashboard already resolves the active workspace and makes one authenticated `GET /dashboard/summary` request for Trading Snapshot. The current frontend schema only models four metrics, so Zod removes the additive `recentEvents` field before the UI can use it.

The backend contract now provides `DashboardRecentEventsMetricResponse` with independent `AVAILABLE`, `EMPTY`, `DENIED`, and `ERROR` states. Available items contain the event identity and content needed by the prototype Event Timeline: `id`, `title`, `description`, `occurredAt`, `confidence`, `themes`, and `affectedAssets`. Existing localized `/events` and `/events/{id}` routes can handle navigation.

## Goals / Non-Goals

**Goals:**

- Preserve `recentEvents` through the existing authenticated summary action and typed API boundary.
- Add a live production Event Timeline after Trading Snapshot on `/[lang]/dashboard`.
- Match the reviewed prototype hierarchy while using backend data, independent metric states, existing localization, and existing design-system primitives.
- Keep the request count at one summary request and provide a predictable loading/error/empty footprint.

**Non-Goals:**

- Adding a new dashboard or events endpoint, query parameters, pagination, filtering, or client-side event aggregation.
- Reusing prototype mock data, scenario controls, or importing the prototype view into production.
- Changing the events list/detail API, event enrichment behavior, Latest News, or other prototype-only modules.
- Adding dependencies or changing shared UI primitives.

## Decisions

### Reuse `GET /dashboard/summary`

Extend the existing dashboard definitions and `getDashboardSummary` parser with the new metric. The page passes the validated `recentEvents` value to the timeline component. A separate `/events` request was considered, but it would duplicate backend scope and permission logic and could make the four snapshot cards and timeline disagree about freshness.

### Add a focused production timeline component

Create the smallest dashboard-local component needed for the Event Timeline and keep the prototype view isolated. The component consumes the dashboard DTO directly, renders backend order, and does not reconstruct `EventResponse` objects or make N+1 detail requests.

### Use full-width production layout

Place Event Timeline after Trading Snapshot as a full-width dashboard section. The prototype's `lg:col-span-8` treatment assumes a sibling Latest News module; that sibling is not part of this change, so copying the 8/4 grid would create an empty layout column.

### Keep metric states explicit

Map `AVAILABLE`, `EMPTY`, `DENIED`, and `ERROR` to localized UI states. Do not convert denied/error to zero, hide the whole dashboard because of one metric, or fall back to prototype content. The existing endpoint-level summary failure behavior remains the source of truth when the whole request fails.

### Use existing event routes and neutral metadata

Use `LocalizedLink` to link the module to `/events` and each row to `/events/{id}`. Display `themeTitle` and `assetSymbol`/`assetName` as neutral context; do not infer bullish/bearish direction from themes, affected assets, or confidence. Use existing locale-aware date/time and percentage/number formatters.

### Follow existing UI and accessibility conventions

Reuse dashboard `Card`, `Badge`, `Skeleton`, `Empty`, icons, semantic tokens, and spacing. The section has a semantic heading, keyboard-reachable links, visible focus, compact icon-bearing time metadata, and responsive rows that remain readable at mobile width and 200% zoom.

## Risks / Trade-offs

- [The generated OpenAPI contract does not declare `required`, `minItems`, or `maxItems` for the new properties] → Keep the frontend validation aligned with the actual DTO shape and show an explicit unavailable/error state for malformed data; never fabricate events. Tightening backend requiredness/limits can be a follow-up contract improvement.
- [The backend can return `DENIED` when any of `event:read`, `watchlist:read`, or `asset:read` is unavailable] → Render the metric-level localized unavailable state while leaving the rest of the summary usable.
- [Event descriptions or item counts can exceed the compact module footprint] → Preserve backend order, use the existing compact row treatment, and allow normal text wrapping/clamping according to the dashboard surface; do not invent client-side pagination in this change.
- [A frontend-first rollout can receive an older summary response without `recentEvents`] → Roll out against the updated backend contract first; rollback is a frontend revert to the existing four-metric dashboard with no data migration.
- [The contract includes asset enum values not represented by the current frontend event union] → Render the summary's display fields rather than exhaustively switching on asset type; do not broaden unrelated event-domain types unless typechecking proves it necessary.

## Migration Plan

1. Keep the backend contract update and the synchronized `docs/APIMAPPING.md` as the API source of truth.
2. Add the dashboard schemas/types, then wire the existing summary action and page state into the new component.
3. Add Vietnamese and English dictionary keys, loading/empty/error states, and links.
4. Run repository checks (typecheck, lint, OpenSpec/status validation, and focused static searches).
5. If rollback is needed, revert the frontend timeline/schema integration; no database, route, or API migration is required.

## Open Questions

- Should BE add explicit `required` and bounded-list metadata for `recentEvents.items` in a later contract revision? This is not blocking for the additive frontend integration, but it would make generated clients and validation stricter.
- What maximum number of recent items is product-approved? Until specified, the frontend will render the backend-provided list without adding a second pagination contract.
