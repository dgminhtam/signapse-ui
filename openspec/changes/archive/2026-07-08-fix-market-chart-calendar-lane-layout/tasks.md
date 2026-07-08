## 1. Calendar Lane Layout

- [x] 1.1 Add a local calendar-lane visibility flag and compact lane height in `MarketChartCanvas`.
- [x] 1.2 Resize the KLineCharts container area to reserve bottom space only when the calendar lane is visible.
- [x] 1.3 Render the calendar lane in the reserved space while keeping marker x-coordinates in the same origin as the chart.
- [x] 1.4 Limit the red calendar hover guide line to the chart area, excluding the calendar lane.

## 2. Calendar Marker Counts

- [x] 2.1 Render grouped calendar event counts inside the marker node.
- [x] 2.2 Remove the separate floating count badge outside calendar markers.
- [x] 2.3 Preserve existing marker popover, keyboard focus, hover, and quick-list behavior.

## 3. Verification

- [x] 3.1 Run `openspec.cmd validate fix-market-chart-calendar-lane-layout --type change`.
- [x] 3.2 Run `pnpm.cmd typecheck`.
- [x] 3.3 Run `pnpm.cmd lint`.
