## Why

Graph View has reached the intended canvas-first direction, but the current production layout still leaks page-level scrolling, overloads the canvas HUD, and lets labels compete with the graph itself. This change tightens the screen into a bounded analytical workspace that feels aligned with the Signapse shell and shadcn/radix-nova system without changing the graph engine or backend contract.

## What Changes

- Constrain `/graph-view` to a viewport-bounded graph workspace so the browser does not expose horizontal page scroll or force users to recover the graph by scrolling the document.
- Rebalance in-canvas HUD hierarchy: keep the title and essential summaries visible, separate icon controls from metric chips, and lower the visual weight of relationship summaries.
- Refine label density so default labels help orientation without creating overlapping label blocks across dense clusters.
- Align canvas chrome, chip treatment, and icon controls with the app's neutral shadcn system while preserving Graph View's dark analytical visual identity.
- Clarify breadcrumb/page identity behavior when Graph View is not semantically nested under Overview.
- Preserve existing G6 force layout, drag, hover, selection, controlled zoom, recenter, quick detail, and backend response behavior.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `graph-view-canvas-first-layout`: Tighten canvas-first layout into a bounded viewport workspace and rebalance in-canvas HUD placement.
- `graph-view-label-spacing`: Strengthen default label density policy so dense graphs do not render overlapping label blocks as the resting state.
- `graph-view-controlled-zoom`: Separate explicit zoom/recenter controls from graph metric chips and keep controls compact and accessible.
- `graph-view-exploration-ux`: Clarify that supporting graph metrics, legends, helper affordances, and page identity must stay secondary to the canvas.
- `shadcn-radix-nova-conformance`: Keep graph-specific visual treatments local while ensuring shadcn primitives and global tokens are not restyled for this feature.

## Impact

- Affects `app/[lang]/(main)/graph-view/` page, canvas, skeleton, and local graph view UI components.
- Affects Graph View localized dictionary copy where breadcrumb, HUD labels, tooltips, or accessible labels are adjusted.
- No backend endpoint, response contract, authentication, data fetching, graph dependency, or G6 engine replacement is expected.
- No global theme token or `components/ui/*` primitive chrome changes are expected.
