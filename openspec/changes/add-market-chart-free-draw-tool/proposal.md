## Why

Market chart users need a lightweight way to sketch non-standard paths that do not fit fixed line, shape, fibonacci, or wave tools. The chart already supports multi-point drawing overlays, so this can be added as a small extension to the existing drawing palette instead of introducing a separate brush engine.

## What Changes

- Add a `free-draw` drawing tool to the market chart line palette.
- Define free draw as a multi-segment polyline: users place multiple points and double-click to finish.
- Reuse the existing Signapse drawing overlay lifecycle: active tool state, selection, lock, visibility, magnet mode, style metadata, delete, clear-all, and timeframe-local caching.
- Add localized English and Vietnamese labels for the new tool.
- Do not add continuous pointer-drag brush drawing, arbitrary smoothing, persistence, or backend changes.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `market-chart-drawing-tool-palettes`: The line palette gains a free draw tool that creates a stable multi-segment drawing overlay.

## Impact

- Affected files are expected under `app/[lang]/(main)/market-charts/` for drawing tool definitions, overlay registration, and toolbar icon mapping.
- Localized copy changes are expected in `app/lib/i18n/dictionaries/en.ts` and `app/lib/i18n/dictionaries/vi.ts`.
- No API, database, dependency, or backend contract changes are expected.
