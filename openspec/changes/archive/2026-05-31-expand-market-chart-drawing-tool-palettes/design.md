## Context

The market chart drawing toolbar currently exposes a small flat tool list: horizontal line, trend line, channel, Fibonacci, circle, and rectangle. The user now wants a broader chart-workstation tool set matching the KLineChart-style grouped toolbar, but the team also decided not to add hover-open behavior because it would require extra custom state and timer logic beyond normal shadcn/Radix menu semantics.

The current implementation already separates drawing tool activation, drawing group state, and destructive actions. KLineChart base also includes several built-in overlay templates for lines and channels, while shapes/patterns beyond circle and rectangle require Signapse-owned overlay templates.

## Goals / Non-Goals

**Goals:**

- Replace the flat drawing tool list with five click-open palettes: line, channel, shape, fibonacci/gann, and pattern/wave.
- Add the full tool set shown in the KLineChart-style reference, including the extended line tools segment, arrow, and price line.
- Preserve one active drawing tool at a time.
- Remember the last selected tool per palette so the palette icon can represent the user's current preferred tool.
- Keep magnet, lock, visibility, delete selected, and clear all as separate sections.
- Use shadcn-native click menus and existing wrappers rather than custom hover-open behavior.
- Enable annotation markers by default when opening the market chart workbench.

**Non-Goals:**

- Do not introduce hover-open menus in this change.
- Do not add drawing persistence, server sync, import/export, color pickers, line-style editors, or keyboard shortcuts for every drawing tool.
- Do not replace KLineChart, add `@klinecharts/pro`, or change chart data contracts.
- Do not add manual symbol/from/to controls or route params for annotation visibility.
- Do not change global shadcn wrappers or theme tokens.

## Decisions

1. Model drawing tools as palette definitions.

   Add a palette model such as `MarketChartDrawingToolPalette` with stable ids for `line`, `channel`, `shape`, `fibonacci`, and `pattern`. Each palette owns an ordered tool list, a default tool, an icon, and dictionary labels. This keeps toolbar rendering data-driven and prevents scattered switch statements as the tool count grows.

2. Use KLineChart built-in overlays where available.

   The line/channel group should map to KLineChart built-ins where possible:

   - `horizontal-line` -> `horizontalStraightLine`
   - `horizontal-ray` -> `horizontalRayLine`
   - `horizontal-segment` -> `horizontalSegment`
   - `vertical-line` -> `verticalStraightLine`
   - `vertical-ray` -> `verticalRayLine`
   - `vertical-segment` -> `verticalSegment`
   - `trend-line` -> `straightLine`
   - `ray` -> `rayLine`
   - `segment` -> `segment`
   - `price-line` -> `priceLine`
   - `price-channel-line` -> `priceChannelLine`
   - `parallel-line` -> `parallelStraightLine`
   - `fibonacci-line` -> `fibonacciLine`

   This avoids rewriting geometry that the chart engine already owns.

3. Keep Signapse-owned custom overlays for missing line, fibonacci/gann, shape, and pattern tools.

   Arrow, circle, and rectangle use custom templates. Add custom templates for arrow, Fibonacci segment, Fibonacci circle, Fibonacci spiral, Fibonacci sector, Fibonacci extension, Gann box, parallelogram, triangle, XABCD pattern, ABCD pattern, three waves, five waves, eight waves, and any waves. These templates should live beside the existing drawing overlay registration so the migration keeps all Signapse drawing overlays in one place.

   Fibonacci/Gann custom overlays should be pragmatic workstation primitives, not full TradingView parity. Use deterministic geometry from the selected anchor points, reuse the existing drawing styles/selection behavior, and keep labels compact so they do not dominate the chart.

4. Use click-open `DropdownMenu`, not hover-open behavior.

   Each palette trigger should be a shadcn `DropdownMenuTrigger asChild` around a compact `Button`. The menu should use `DropdownMenuContent`, `DropdownMenuGroup`, and selectable items. Avoid nesting `DropdownMenuTrigger` inside `ToggleGroupItem` because multiple Radix primitives can compete for `data-state`, and the toolbar already hit active-state issues when extra primitives wrapped toggle items.

5. Keep active state owned by the chart workbench.

   Extend `MarketChartDrawingState` to track `activeTool` and the last selected tool per palette. Selecting a menu item sets both the selected palette tool and the active tool. Drawing completion clears `activeTool` but leaves the palette's last selected tool intact for reuse.

6. Keep state and destructive controls outside drawing palettes.

   Magnet, lock, and visibility remain a `ToggleGroup type="multiple"`. Delete selected and clear all remain `Button`/`AlertDialog` actions separated by shadcn `Separator`. This preserves the recent toolbar cleanup and avoids treating destructive actions as drawing tools.

7. Default annotations to enabled.

   Initialize the annotation layer as enabled, request chart candles with `includeAnnotations=true` by default, and keep the existing toggle so users can disable annotations. The disabled state still sends or refreshes data with `includeAnnotations=false` and hides marker copy.

## Risks / Trade-offs

- Custom pattern/wave overlays have more geometry and interaction complexity than the menu UI. Mitigation: implement them as isolated overlay templates with deterministic point counts and keep the rest of the toolbar data-driven.
- KLineChart 10 beta overlay names may change in later versions. Mitigation: keep all overlay-name mapping in one exported record and verify against installed package during implementation.
- A palette trigger that both opens a menu and activates the last tool can become ambiguous. Mitigation: use menu selection as the primary action; if quick activation is added, it should be explicit and still accessible.
- More tools increase dictionary and icon-maintenance overhead. Mitigation: keep labels and icon mapping keyed by `MarketChartDrawingTool` so missing entries fail at typecheck.
- Enabling annotations by default increases candle payload size. Mitigation: preserve the user-facing toggle to disable annotations and avoid adding new route state.
