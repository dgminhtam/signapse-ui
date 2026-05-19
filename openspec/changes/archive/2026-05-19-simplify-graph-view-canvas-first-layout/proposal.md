## Why

The graph view currently spends too much vertical space on explanatory cards, repeated headings, and secondary metrics, while the graph canvas is the user's main analysis surface. This change simplifies the screen into a canvas-first workspace so users can inspect, pan, zoom, and drag the graph with minimal surrounding chrome.

## What Changes

- Remove the graph view hero copy, experiment badges, `Team clustering layout` card content, bottom metric cards, and edge chips outside the canvas.
- Keep one primary graph canvas surface as the dominant content of the screen.
- Move node-kind counts into a compact HUD inside the canvas, preferably at the top-right or right edge.
- Move the lower-priority total count summary, such as `100 nút · 168 cạnh`, into the bottom-left of the canvas.
- Move edge-kind counts, such as `Sự kiện - tài sản 56`, `Sự kiện - chủ đề 80`, and `Bằng chứng - sự kiện 32`, into the bottom-right of the canvas.
- Replace the top-left `D3 force layout` label and description with a concise `Biểu đồ tri thức` label only.
- Replace the textual `Đưa về trung tâm` button with a compact icon-only control that remains accessible through an aria label.
- Keep the current G6 graph rendering, force layout, drag, pan, zoom, recenter behavior, loading state, and empty state semantics.

## Capabilities

### New Capabilities

- `graph-view-canvas-first-layout`: Defines a simplified graph view layout where the canvas is the primary workspace and graph metadata is shown as in-canvas HUD overlays.

### Modified Capabilities

## Impact

- Affected frontend code: `app/(main)/graph-view/graph-view-workbench.tsx`, `app/(main)/graph-view/graph-view-canvas.tsx`, and `app/(main)/graph-view/page.tsx` skeleton if needed.
- No backend API changes.
- No dependency changes.
- No changes to graph payload shape, G6 layout algorithm, auth, permissions, or persisted graph positions.
