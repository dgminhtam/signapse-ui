## Context

Market chart annotations are returned by the backend with `eventId`, `title`, `summary`, optional reaction/confidence fields, evidence, and `links.eventDetail`. The chart popup currently renders the annotation title as static text. Separately, the app already has a shared quick-detail drawer via the `@quickDetail` parallel route and intercepted event route `@quickDetail/(.)events/[id]`.

The product direction is to keep the market chart popup lightweight and use the event detail drawer for deeper content. Article/source-document navigation should remain inside event detail rather than being mapped directly from chart annotations.

## Goals / Non-Goals

**Goals:**

- Make annotation event titles actionable when an event route can be resolved.
- Open the existing event quick-detail drawer by linking to `/events/:id`.
- Prefer clean `eventId` mapping over article/source evidence mapping.
- Preserve the lightweight chart popup and current marker behavior.
- Avoid custom drawer implementation inside the chart feature.

**Non-Goals:**

- Do not add news article or source document links to the chart popup.
- Do not change event detail drawer layout/content.
- Do not change backend annotation DTOs or require new API fields.
- Do not change annotation marker positioning, grouping, lazy history loading, or chart route state.
- Do not replace the popup with a drawer; the title link opens the drawer.

## Decisions

### 1. Event title links use existing app routes

Render annotation titles as `next/link` links to `/events/:eventId` when `eventId` is present. This should trigger the existing intercepted quick-detail drawer in the `(main)` layout.

Rationale: Internal `Link` preserves Next.js routing behavior and lets the existing `@quickDetail` route own the drawer, permission checks, loading/error states, and full-detail action.

Alternative considered: use a raw `<a href={annotation.links.eventDetail}>`. Rejected for internal event routes because it may bypass client-side intercepted drawer behavior.

### 2. `links.eventDetail` is fallback only

If `eventId` is absent, the implementation may use `links.eventDetail` only when it is a safe internal event detail path such as `/events/123`. External links, malformed paths, or non-event paths should not be used for the title.

Rationale: The clean contract is event mapping. The fallback is useful for robustness but must not turn chart titles into arbitrary navigation.

Alternative considered: always trust `links.eventDetail`. Rejected because link shape is less type-safe than `eventId`.

### 3. Close local popup on event navigation

When a title link is clicked, close the local chart annotation popup before navigation.

Rationale: The event drawer becomes the focused detail surface. Leaving the chart popup selected behind the drawer can create stale UI when the user closes the drawer.

Alternative considered: leave popup state intact. Rejected because it can make the chart feel like it has two active detail layers.

### 4. Keep article/source navigation inside event detail

The chart popup should not inspect `evidence[]` to create news/article/source links in this change.

Rationale: Event detail is the correct place to present related articles and evidence with context and permissions. Chart annotations should remain a quick entry point into the event.

## Risks / Trade-offs

- [Some annotations may lack event mapping] -> Render static title text when no safe event href exists.
- [Drawer does not open if navigation bypasses intercepted route] -> Use `next/link` with internal `/events/:id` href and rely on existing `(main)` quick-detail slot.
- [Popup remains visible behind drawer] -> Close popup on title click.
- [Users expect article detail from chart] -> Defer article/source navigation to the event detail drawer for cleaner mapping and permissions.

## Migration Plan

1. Add a helper to resolve a safe event href from `annotation.eventId` or fallback `annotation.links.eventDetail`.
2. Render annotation title as `Link` when a safe event href exists.
3. Pass an optional navigation callback from `MarketChartAnnotationPopup` into detail rendering to close the popup on link click.
4. Preserve static title rendering for annotations without safe event href.
5. Verify lint, typecheck, build, OpenSpec validation, and browser smoke with authenticated annotation data.

## Open Questions

- No blocking open questions. The chosen direction is event-only mapping from chart annotation title to event quick-detail drawer.
