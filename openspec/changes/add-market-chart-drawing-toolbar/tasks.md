## 1. Drawing Model And Overlay Adapter

- [x] 1.1 Define market chart drawing tool types, toolbar state types, overlay group id helpers, and KLineCharts overlay name mapping for built-in tools.
- [x] 1.2 Add an idempotent KLineCharts custom overlay registration module for circle and rectangle/area tools using supported KLineCharts figure primitives.
- [x] 1.3 Add a small adapter boundary so feature code can request drawing commands without importing KLineCharts overlay types outside the canvas layer.

## 2. Canvas Drawing Commands

- [x] 2.1 Extend `MarketChartCanvasHandle` with drawing commands for active tool, magnet mode, lock, visibility, selected deletion, clear all, and resize-safe state refresh.
- [x] 2.2 Wire drawing commands to KLineCharts `createOverlay`, `overrideOverlay`, `removeOverlay`, and `getOverlays` using the current chart context group id.
- [x] 2.3 Track selected drawing overlay through overlay callbacks and clear selection when the overlay is removed, context changes, or chart is disposed.
- [x] 2.4 Clear session-local drawing overlays when asset, timeframe, reset key, or chart instance changes so stale drawings never cross chart contexts.
- [x] 2.5 Guard annotation marker pointer handling while a drawing tool is active so drawing interactions are not blocked by visible event markers.

## 3. Toolbar UI And Workbench Wiring

- [x] 3.1 Add a chart-local `MarketChartDrawingToolbar` composed from existing shadcn wrappers such as `ToggleGroup`, `Toggle`, `Button`, `Tooltip`, `Separator`, and `AlertDialog`.
- [x] 3.2 Place the drawing toolbar inside the market chart surface without moving asset, timeframe, annotation, indicator, screenshot, or fullscreen controls.
- [x] 3.3 Connect workbench state to canvas drawing commands for tool selection, magnet, lock, visibility, selected delete, and confirmed clear-all.
- [x] 3.4 Add Vietnamese dictionary copy and accessible labels for every icon-only drawing control.
- [x] 3.5 Ensure narrow viewports keep the toolbar usable without page-level horizontal overflow.

## 4. Interaction Polish

- [x] 4.1 Ensure active drawing tool, selected drawing, magnet, lock, and visibility states have clear visual feedback using shadcn state styling.
- [x] 4.2 Ensure destructive clear-all uses confirmation while selected single-drawing deletion stays scoped and does not require confirmation.
- [x] 4.3 Ensure chart screenshot export includes drawing overlays and does not include Signapse toolbar chrome.
- [x] 4.4 Ensure toolbar controls are disabled or hidden safely when the chart is loading, empty, errored, or missing an initialized chart instance.

## 5. Verification

- [x] 5.1 Run `openspec validate add-market-chart-drawing-toolbar --strict`.
- [x] 5.2 Run `pnpm typecheck`.
- [x] 5.3 Run `pnpm lint`.
- [x] 5.4 Static-review market chart source to confirm no `@klinecharts/pro` dependency, no direct UI primitive imports in feature code, and no drawings crossing asset/timeframe contexts.
