## Context

`/graph-view` currently renders a large page hero, node count chips, an outer card section, a `Team clustering layout` description, canvas, three metric cards, and edge count chips below the canvas. This hierarchy was useful while the graph layout was being explained, but now it competes with the primary job: exploring the graph itself.

The current graph data model already exposes node-kind counts and edge-kind counts in `GraphModel`. The canvas component already owns in-canvas overlays for the top-left label, recenter control, and bottom status chips. This makes the canvas the right place to host compact metadata HUDs without changing backend data or the G6 layout.

## Goals / Non-Goals

**Goals:**

- Make graph view a canvas-first workspace with minimal page chrome.
- Remove explanatory and metric cards that do not directly help graph analysis.
- Move useful counts into unobtrusive in-canvas HUD overlays.
- Keep the canvas visually dominant above the fold.
- Keep all user-facing copy professional Vietnamese.
- Preserve the existing empty state and loading skeleton quality.

**Non-Goals:**

- Changing the backend graph contract.
- Changing G6 force layout, clustering, drag, pan, zoom, or bounded-space behavior.
- Adding node detail modals, side inspectors, filters, or new graph interactions.
- Reworking global page layout, sidebar, breadcrumbs, theme tokens, or shadcn primitives.

## Decisions

### Collapse workbench chrome into a single canvas shell

Remove the hero block, experiment badges, `Team clustering layout` explanation, bottom metric cards, and edge chips from the normal content flow. Keep one graph canvas surface as the only primary rendered surface when graph data exists.

Why:
- The breadcrumb already identifies the page as graph view.
- Reducing vertical chrome gives the graph more usable height.
- It aligns with the user's stated expectation: one canvas, not a dashboard of cards.

Alternative considered:
- Keep the hero but shrink it. Rejected because even compact external copy still pushes the canvas down and repeats information already available in the app header and HUD.

### Move counts into canvas HUD overlays

Pass graph counts into `GraphViewCanvas` and render them as compact HUD clusters:
- top-left: `Biểu đồ tri thức`
- top-right or right edge: node-kind counts such as `Sự kiện`, `Tài sản`, `Chủ đề`, `Bài viết`
- bottom-left: total graph size such as `100 nút · 168 cạnh`
- bottom-right: edge-kind counts such as `Sự kiện - tài sản 56`

Why:
- Counts remain available without owning layout space.
- The HUD pattern matches map/chart interfaces where metadata supplements the visualization.
- It lets the canvas stay the main reading surface.

Alternative considered:
- Hide all metrics. Rejected because counts help users understand graph scope and relation mix.

### Replace recenter text with an accessible icon-only control

Use a compact icon-only control for recenter, with an accessible name such as `Đưa biểu đồ về trung tâm`.

Why:
- Text button takes too much HUD space.
- Icon-only is appropriate for a repeated map-like control when it has a clear accessible label.

Alternative considered:
- Keep text for clarity. Rejected for the default desktop HUD because the surrounding canvas is space-constrained; accessibility can be preserved with aria label and optional tooltip later if needed.

### Keep empty and loading states aligned with the simplified layout

Update the page skeleton and canvas fallback to mirror the new canvas-first layout instead of the removed hero/cards.

Why:
- Skeletons should not preview UI that no longer exists.
- Avoiding layout shift keeps the screen feeling stable.

## Risks / Trade-offs

- [HUD overlays obscure graph nodes] -> Keep HUD clusters small, translucent, and anchored to corners; avoid large descriptive text.
- [Users lose explanatory guidance] -> Preserve only essential labels and interaction affordances; rely on direct manipulation and existing breadcrumbs.
- [Icon-only recenter is less obvious] -> Use a familiar icon, accessible name, and clear hover/focus treatment.
- [Mobile HUD crowding] -> Allow HUD groups to wrap or collapse while keeping the canvas first.
