## Context

The market chart screen currently uses `klinecharts` directly inside the market chart canvas adapter. The workbench owns high-level UI state such as asset, timeframe, annotation visibility, indicators, screenshot, and fullscreen, while the canvas exposes an imperative handle for chart-only commands.

Annotations are currently rendered as Signapse-owned DOM markers positioned from KLineCharts coordinates. Drawing tools should not reuse that DOM marker pattern because drawn objects need native chart hit-testing, panning, zooming, selection, dragging, visibility, and lock behavior. KLineCharts 10.0.0-beta1 exposes native overlay APIs including `createOverlay`, `overrideOverlay`, `removeOverlay`, `getOverlays`, built-in overlays for line/channel/fibonacci tools, and `registerOverlay` plus figure types for custom circle/rect overlays.

## Goals / Non-Goals

**Goals:**

- Add a compact chart-local drawing toolbar that feels like part of the chart workstation, not a list/filter toolbar.
- Use KLineCharts base overlay APIs as the drawing engine and keep KLineChart-specific details inside the canvas adapter boundary.
- Support an initial useful drawing set: horizontal line, trend/segment line, channel/parallel line, fibonacci line, circle, and rectangle/area.
- Provide basic drawing management: active tool selection, magnet mode, lock, visibility, selected deletion, and safe clear-all behavior.
- Keep annotation markers and drawing overlays independent so event analysis remains readable while drawing mode is active.
- Keep implementation ready for future persistence without adding backend APIs in this change.

**Non-Goals:**

- Do not migrate to `@klinecharts/pro` or adopt its toolbar chrome.
- Do not add backend persistence, drawing sharing, drawing templates, undo/redo, style editing, or multi-symbol drawing sync.
- Do not replace annotation markers with KLineCharts overlays in this change.
- Do not add additional chart data APIs or manual date controls.

## Decisions

### Use custom shadcn toolbar with KLineCharts base overlays

The drawing toolbar will be a Signapse-owned component composed from existing `@/components/ui/` wrappers such as `ToggleGroup`, `Toggle`, `Button`, `Tooltip`, and `Separator`. The chart behavior will be powered by KLineCharts base overlays.

Alternatives considered:

- `@klinecharts/pro`: provides built-in drawing chrome, but brings CSS/theme, i18n, symbol-search, and watchlist-only integration risks that conflict with the current Signapse shell.
- DOM-only drawing layer: simpler to render initially, but would require rebuilding zoom/pan coordinate transforms, hit-testing, drag selection, and screenshot inclusion.

### Keep drawing state split between workbench and canvas adapter

The workbench should own UI state such as active drawing tool, collapsed toolbar state, magnet enabled, drawings locked, and drawings visible. The canvas adapter should own KLineCharts calls and expose imperative commands through `MarketChartCanvasHandle`, for example:

- `setDrawingTool(tool)`
- `setDrawingMagnet(enabled)`
- `setDrawingsLocked(locked)`
- `setDrawingsVisible(visible)`
- `deleteSelectedDrawing()`
- `clearDrawings()`

This follows the existing indicator command pattern and keeps vendor-specific types out of surrounding feature logic.

### Use built-in overlays first and custom overlays only for shape gaps

Line-like tools should map to supported overlays such as `horizontalStraightLine`, `segment` or `straightLine`, `priceChannelLine` or `parallelStraightLine`, and `fibonacciLine`. Circle and rectangle/area tools should be implemented as small Signapse-registered overlays only if no built-in overlay matches, using KLineCharts figure types such as `circle`, `rect`, or `polygon`.

Custom overlays should be registered from a chart-local module and guarded so registration is idempotent across client renders.

### Use drawing group metadata for cleanup and future persistence

All Signapse user drawings should be created with a stable drawing `groupId` for the current chart context and `extendData` identifying the Signapse tool type. The group id should include enough context to prevent drawings from one asset/timeframe appearing on another asset/timeframe.

In this change, drawings are session-local. When asset, timeframe, reset key, or chart instance changes, the adapter should remove current drawing overlays. The data model should still be shaped so future backend persistence can serialize overlay name, points, lock, visible, styles, and Signapse tool metadata without rewriting the toolbar.

### Avoid annotation and drawing interaction conflicts

When a drawing tool is active, chart interactions should prioritize drawing. Annotation marker DOM controls should not intercept drawing clicks while active drawing mode is waiting for points. Annotation marker rendering can remain visible, but pointer interaction should be disabled or guarded during drawing mode.

Overlay callbacks such as `onSelected`, `onDeselected`, `onRemoved`, and `onDrawEnd` should update selected drawing state so delete and clear actions are accurate.

### Keep toolbar compact and accessible

The toolbar should be positioned inside the chart surface on desktop, visually aligned to the chart edge, and collapsible or simplified on narrow viewports. Icon-only controls must have accessible labels and tooltips. Destructive clear-all must use `AlertDialog`; selected delete can be direct when scoped to one selected overlay.

The toolbar should use shadcn default chrome where possible and avoid custom visual overrides on primitives except layout constraints required by the chart-local vertical surface.

## Risks / Trade-offs

- Custom circle/rectangle overlays could take longer than built-in line tools -> Implement built-in overlays first, then add the smallest custom overlay templates needed for the MVP.
- Annotation DOM markers can steal clicks from drawing mode -> Disable marker pointer interaction while a draw tool is active.
- Drawings are not persisted -> Make session-local behavior explicit and clear drawings on chart context changes so users do not see stale drawings.
- Theme and density can drift from shadcn -> Keep toolbar composition in shadcn primitives and semantic tokens; do not import KLineChart Pro CSS.
- KLineCharts beta overlay behavior can change -> Contain all overlay calls in one adapter module so future API adjustments stay localized.

## Migration Plan

1. Add drawing tool types and overlay mapping without changing existing chart data loading.
2. Extend the canvas handle with drawing commands and wire them to KLineCharts overlay APIs.
3. Add the chart-local toolbar and connect it to canvas commands.
4. Add custom overlay registrations for circle and rectangle/area only after built-in tools are working.
5. Verify annotation marker interaction, screenshot inclusion, theme switching, fullscreen layout, lint, typecheck, and OpenSpec validation.

## Open Questions

- None for the MVP. Persistence, style editing, and undo/redo should be handled by separate proposals when product scope is ready.
