## Why

The market chart drawing toolbar is currently a flat set of a few tools, while the product direction needs a more complete chart workstation without rebuilding a full TradingView-style shell from scratch. Expanding drawing tools into click-open shadcn-native palettes gives users broader chart markup capability while keeping the implementation clean and maintainable.

## What Changes

- Replace the flat drawing tool list with grouped drawing tool palettes opened by click using shadcn `DropdownMenu`.
- Add the full tool set represented by the agreed KLineChart-style groups:
  - Line tools: horizontal line, horizontal ray, horizontal segment, vertical line, vertical ray, vertical segment, trend line, and ray.
  - Channel tools: price channel line and parallel line.
  - Shape tools: circle, rectangle, parallelogram, and triangle.
  - Pattern tools: XABCD pattern, ABCD pattern, three waves, five waves, eight waves, and any waves.
- Keep magnet, lock, visibility, delete selected, and clear all as separate toolbar sections rather than mixing them into drawing tool palettes.
- Use click-open menus instead of hover-open behavior to avoid custom timer/state complexity and preserve shadcn/Radix accessibility semantics.
- Preserve one active drawing tool at a time and remember the last selected tool per palette for quick reuse.
- Default the annotation marker layer to enabled when the market chart workbench loads.

## Capabilities

### New Capabilities

- `market-chart-drawing-tool-palettes`: Defines grouped drawing palettes, supported drawing tool set, interaction behavior, and shadcn composition requirements for the market chart drawing toolbar.

### Modified Capabilities

- `market-chart-annotation-markers`: Annotation markers should be enabled by default on the market chart workbench while still allowing users to disable them.

## Impact

- Affected code: `app/[lang]/(main)/market-charts/market-chart-drawing.ts`, `app/[lang]/(main)/market-charts/market-chart-drawing-toolbar.tsx`, `app/[lang]/(main)/market-charts/market-chart-workbench.tsx`, and related dictionary entries.
- May require additional Signapse-owned KLineChart overlay templates for drawing tools not provided by KLineChart base.
- Uses existing shadcn wrappers such as `DropdownMenu`, `Button`, `ToggleGroup`, `Separator`, and `AlertDialog`; no new dependency is expected.
- No backend API, route-state, chart data contract, global theme token, or chart engine replacement changes.
