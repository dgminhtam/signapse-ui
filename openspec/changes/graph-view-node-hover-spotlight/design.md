## Context

`/graph-view` currently renders a G6 force-directed canvas with team clustering, drag, pan, zoom, bounded interaction, and compact HUD overlays. The current label strategy limits visible labels for dense graphs and uses canvas label styling that is effectively tuned for light mode. Users now need a lightweight way to inspect node titles and nearby relationships directly in the canvas, while dark mode must remain readable.

This change builds on the canvas-first direction. It should not reintroduce side inspectors, metric cards, or modal detail flows. Hover is a momentary reading aid, not a navigation state.

## Goals / Non-Goals

**Goals:**

- Make hovered nodes easier to inspect without clicking.
- Show the hovered node title in full inside the graph canvas.
- Emphasize first-degree related nodes and edges.
- Keep unrelated nodes and edges visible enough to preserve map context.
- Improve label and hover-title contrast in light and dark mode.
- Avoid hover-induced layout jitter, force restarts, or node overlap regressions.
- Keep the solution local to graph view and professional Vietnamese UI copy.

**Non-Goals:**

- Adding a node detail modal, side inspector, or persistent selection panel.
- Persisting hover, drag, or graph positions to the backend.
- Changing graph data contracts or backend response shape.
- Changing global theme tokens in `app/globals.css`.
- Reworking clustering, force parameters, pan bounds, or recenter behavior.
- Adding a new visualization dependency.

## Decisions

### Use G6 element states for relationship emphasis

Configure node and edge states for `active`, `highlight`, and `inactive`, then drive hover through G6 behavior/events.

Why:
- G6 state stacking is designed for exactly this interaction class.
- State styling avoids mutating graph data on every hover.
- It keeps hover visual updates independent from D3 force layout.

Alternative considered:
- Recompute `graphData` with hovered ids in React state. Rejected because it risks remounting/redrawing too much graph state and can trigger layout movement.

### Keep hover focus soft rather than isolating the node

The hovered node should receive the strongest treatment, directly related nodes and edges should be highlighted, and unrelated elements should only dim lightly.

Why:
- The user's graph-analysis workflow needs the surrounding topology to remain legible.
- Previous overly dimmed focus made the graph feel like context disappeared.

Suggested visual hierarchy:
- Hovered node: stronger stroke, subtle halo/shadow, full title tooltip.
- Related nodes: high opacity and slightly stronger stroke.
- Related edges: higher opacity and slightly thicker line.
- Unrelated nodes/edges: opacity around `0.55-0.7`, not near-invisible.

Alternative considered:
- Hide unrelated elements. Rejected because graph-view is an exploratory map, not a filtered detail screen.

### Render the full title as a DOM overlay tooltip

Use a small absolutely positioned tooltip inside `GraphViewCanvas`, updated by node pointer events and hidden on pointer leave, drag start, or unmount.

Why:
- DOM text can use Tailwind/shadcn theme tokens for readable light/dark contrast.
- It avoids fighting G6 label rendering limits for long Vietnamese titles.
- It keeps the title inside the canvas without adding card-heavy page chrome.

Tooltip content should be concise:
- Full node label as the main line.
- Optional small metadata line using the Vietnamese node kind label if it improves orientation.

Alternative considered:
- Use G6 built-in tooltip plugin. Rejected for this first pass unless it proves simpler during implementation; a local DOM overlay gives better control over theme tokens and copy.

### Make graph canvas palette theme-aware locally

Derive graph canvas text and state colors from the resolved theme or from local CSS variables applied to the graph canvas root. The implementation should update G6 label-related styles when the theme changes.

Why:
- Current `labelFill` is hard-coded for light mode.
- AGENTS guardrails discourage changing global theme tokens for a local graph-view issue.
- G6 canvas labels are not ordinary DOM text, so they need explicit theme-aware color values.

Suggested palette:
- Light label: dark slate text with subtle light halo or background.
- Dark label: near-white text with a translucent dark label background or subtle dark outline.
- Hover tooltip: use DOM `bg-popover/95`, `text-popover-foreground`, border, and shadow.

Alternative considered:
- Change global foreground or chart tokens. Rejected because this would affect unrelated screens.

### Do not resize nodes or restart layout on hover

Hover state must be visual-only. It may change stroke, halo, shadow, label visibility, opacity, and edge width, but must not change force layout radius, seed positions, clustering, or layout config.

Why:
- Node size changes can affect perceived overlap and may cause redraw jitter.
- Layout restart on pointer movement would make dense graphs feel unstable.

Alternative considered:
- Scale hovered nodes for emphasis. Rejected for now because shadow/halo/label provides enough emphasis without changing spatial relationships.

## Risks / Trade-offs

- [Tooltip can obscure nearby nodes] -> Keep it compact, offset from pointer/node, and allow it to follow pointer movement.
- [State updates on dense graphs may be expensive] -> Limit updates to pointer enter/leave, use G6 state APIs, and avoid React graph data recalculation.
- [Theme changes may not repaint canvas labels automatically] -> Treat `resolvedTheme` as an effect dependency and update/draw graph styles in a guarded way.
- [Inactive opacity can reduce dark-mode contrast] -> Use separate dark-mode inactive values if needed and keep the dimming soft.
- [Hover conflicts with drag] -> Hide tooltip during drag and keep drag behavior as the primary pointer action when dragging.

## Migration Plan

1. Add hover state styles and theme-aware label palette to the G6 graph options.
2. Add hover handlers or `hover-activate` behavior for node-only relationship focus.
3. Add local DOM tooltip state and rendering inside `GraphViewCanvas`.
4. Verify hover, drag, pan, zoom, recenter, light mode, and dark mode.

Rollback strategy:
- Remove the hover behavior/state styles and tooltip overlay. The existing G6 canvas, force layout, and HUD remain intact.

## Open Questions

- Whether the hover tooltip should include only the full title or also one secondary line such as node kind.
- Whether edge labels should be revealed on related edges later; this is intentionally out of scope for the first hover pass.
