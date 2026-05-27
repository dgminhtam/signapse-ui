## Why

Graph View's latest canvas-first layout is functionally on track, but the canvas chrome still feels heavier and more custom than nearby Signapse admin sections. This change polishes the surface so the graph reads as a system-aligned workspace: simpler shell, clearer title, shadcn-native grouped controls, and a recenter icon that matches the spatial action.

## What Changes

- Replace the custom wrapped zoom/recenter tool dock with a shadcn `ButtonGroup` composition.
- Reorder explicit graph controls so the recenter/locate action sits between zoom out and zoom in.
- Replace the reset-style icon with a locate/focus-position icon that better communicates returning the graph to the visible analysis area.
- Reduce Graph View canvas chrome by aligning the outer radius with standard `rounded-xl` section surfaces.
- Remove the heavy canvas gradient/glow treatment from the primary wrapper so the graph content, not the shell, carries the visual weight.
- Render the `Biểu đồ tri thức` canvas title as larger plain text instead of a small wrapped pill.
- Preserve existing G6 graph layout, bounded workspace, drag, hover, selection, controlled zoom, recenter behavior, and backend contract.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `graph-view-canvas-first-layout`: Refine canvas shell, title treatment, and HUD chrome while keeping the canvas-first workspace.
- `graph-view-controlled-zoom`: Present zoom and recenter controls as a shadcn grouped control with the locate action centered.
- `graph-view-exploration-ux`: Reduce decorative chrome so page identity and metrics remain secondary to graph exploration.
- `shadcn-radix-nova-conformance`: Prefer installed shadcn `ButtonGroup` and built-in button variants over local custom control chrome.

## Impact

- Affects `app/[lang]/(main)/graph-view/graph-view-canvas.tsx`.
- Affects `app/[lang]/(main)/graph-view/graph-view-workbench.tsx` and the page skeleton in `app/[lang]/(main)/graph-view/page.tsx`.
- May affect Graph View imports for lucide icon selection and shadcn `ButtonGroup`.
- No backend endpoint, graph engine, graph data contract, global theme token, or `components/ui/*` wrapper change is expected.
