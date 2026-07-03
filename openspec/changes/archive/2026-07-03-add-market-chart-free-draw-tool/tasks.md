## 1. Drawing Tool Wiring

- [x] 1.1 Add `free-draw` to `MarketChartDrawingTool`, the tool list, the line palette, and the KLineCharts overlay mapping.
- [x] 1.2 Register a Signapse-owned free draw overlay template that renders connected line segments and completes through KLineCharts double-click completion.
- [x] 1.3 Ensure the free draw overlay uses existing drawing metadata, style, group, lock, visibility, magnet, selection, delete, clear-all, and chart-context cache behavior.

## 2. Toolbar And Localization

- [x] 2.1 Add a toolbar icon mapping for `free-draw` using the existing drawing palette menu path.
- [x] 2.2 Add synchronized English and Vietnamese dictionary labels for the free draw tool.

## 3. Verification

- [x] 3.1 Run `openspec.cmd validate add-market-chart-free-draw-tool --strict` or the repo-supported OpenSpec validation command.
- [x] 3.2 Run `pnpm.cmd typecheck`.
- [x] 3.3 Run `pnpm.cmd lint`.
- [x] 3.4 Perform a deterministic code review that confirms no continuous brush engine, new dependency, backend API change, or toolbar layout change was added.
