## Why

The current `graph-view` route is functionally correct, but the experience still feels more like a graph component embedded inside an admin page than a first-class exploration surface. The page renders the data, yet it remains visually rigid, overly card-heavy, and lighter on motion, focus controls, and browse ergonomics than the Obsidian-like direction originally intended.

## What Changes

- Refine the `graph-view` route so the canvas becomes the primary reading surface and the surrounding UI shifts from card-heavy scaffolding to graph-first exploration support.
- Add purposeful motion to the graph experience, including a short settle-on-load feel, smoother camera transitions, and more polished hover and selection feedback without turning the page into a continuously animated physics demo.
- Improve information hierarchy by reducing visual competition from static legend and helper panels, and by progressively revealing supporting controls only when they help exploration.
- Introduce browse controls that make graph exploration feel less rigid, such as local focus controls, adjustable neighborhood depth, and compact visual tuning options for label density or graph readability.
- Reduce graph clutter by making edge labels and secondary metadata more contextual, so the graph reads clearly at a glance and only expands detail when the user asks for it.
- Refine the right-hand panel so it behaves more like an inspector and exploration aid, not a stacked set of equal-weight cards.
- Preserve the existing backend contract, permissions, and browse-first drill-down model while upgrading the operator experience.

## Capabilities

### New Capabilities
- `graph-view-exploration-ux`: Refine the graph-view browse surface with canvas-first hierarchy, purposeful motion, contextual graph controls, and smoother exploration feedback.

### Modified Capabilities
- None.

## Impact

- Primary UI changes in `app/(main)/graph-view/graph-view-workbench.tsx` and related route-shell presentation under `app/(main)/graph-view/*`.
- Possible helper updates in `app/lib/graph-view/*` if additional client-side display settings, local-focus helpers, or browse-state utilities are needed.
- No backend API changes to `GET /graph-view`.
- No permission model changes; existing `graph-view:read`, `event:read`, and `source-document:read` rules remain intact.
- Verification will need to cover not only correctness, but also motion, readability, focus behavior, and responsive browsing quality.
