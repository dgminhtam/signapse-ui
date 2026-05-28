## 1. Volume-Aware Chart Layout

- [x] 1.1 Add a market chart helper that detects finite numeric `volume` from historical and live candle-like data without treating missing volume as zero.
- [x] 1.2 Derive a `showVolumePane` boundary value in the market chart workbench from loaded candles and the latest known live candle.
- [x] 1.3 Pass `showVolumePane` into the KLineChart canvas adapter.
- [x] 1.4 Build the KLineChart layout conditionally so the `VOL` pane is only included when `showVolumePane` is true.
- [x] 1.5 Keep candle data mapping unchanged for missing volume: omit `volume` unless it is a finite number.
- [x] 1.6 Ensure live candle updates do not cause chart reinitialization on every tick solely because the live candle object changed.

## 2. Drawing Rail Simplification

- [x] 2.1 Remove `isCollapsed` from market chart drawing state and default/reset state.
- [x] 2.2 Remove the drawing toolbar collapse/expand button and related labels from render logic.
- [x] 2.3 Ensure the drawing rail starts directly with drawing tool controls and keeps existing disabled, tooltip, lock, magnet, visibility, delete-selected, and clear-all behavior.
- [x] 2.4 Remove any now-unused collapse imports, dictionary keys, and references.

## 3. Chart Font And Drawing Style Polish

- [x] 3.1 Extend KLineChart style creation so exposed chart text surfaces use the Signapse app font family, including overlay text and indicator last value mark text where supported.
- [x] 3.2 Lighten drawing overlay line, circle, rectangle, and selected-point styling through the chart-local palette/style helper.
- [x] 3.3 Keep drawing style changes scoped to the market chart KLineChart adapter and avoid global shadcn token changes.

## 4. Runtime Safety Review

- [x] 4.1 Review the volume/no-volume paths to confirm missing volume does not create a `VOL` pane or synthetic zero values.
- [x] 4.2 Review the live update path to confirm raw `liveCandle` object identity does not become a chart initialization dependency.
- [x] 4.3 Review the drawing toolbar path to confirm collapse state is fully removed rather than hidden.
- [x] 4.4 Review chart font styling to confirm remaining CSS variable reads are non-theme-color reads and intentionally scoped.

## 5. Verification

- [x] 5.1 Run `openspec validate refine-market-chart-volume-and-drawing-polish --strict`.
- [x] 5.2 Run `pnpm typecheck`.
- [x] 5.3 Run `pnpm lint`.
- [x] 5.4 Run static search for `isCollapsed`, `collapse`, `expand`, `VOLUME_PANE_ID`, `content: ["VOL"]`, `showVolumePane`, and `volume: 0` to confirm cleanup and volume handling.
- [x] 5.5 Deterministically review the final diff against the proposal to confirm no backend API, dependency, global token, route, annotation, lazy-history, screenshot, fullscreen, or top-toolbar behavior changed outside scope.

User-owned manual QA note: after implementation, compare one asset with volume and one asset without volume on `/vi/market-charts`, then draw circle/line/rectangle to confirm the pane layout, stroke weight, font, and drawing rail feel correct in light and dark mode.
