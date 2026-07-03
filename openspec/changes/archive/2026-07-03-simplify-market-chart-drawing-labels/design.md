## Context

Market chart drawing labels come from two places: Signapse-owned overlay templates in `market-chart-drawing.ts` and KLineCharts default selected-overlay axis figures. The current selected state can show Fibonacci price-plus-percent labels, selected anchor dates on the X axis, selected anchor prices on the Y axis, and translucent selection bands, which makes dense chart analysis harder.

## Goals / Non-Goals

**Goals:**
- Keep all Fibonacci percentage labels visible.
- Remove detailed price values from Fibonacci labels.
- Hide selected drawing anchor dates and selection bands on the X axis.
- Hide selected drawing anchor prices and selection bands on the Y axis except for explicit price-level tools.
- Make drawing text readable against the chart background.

**Non-Goals:**
- Add a user-facing compact/full label toggle.
- Change drawing persistence metadata or backend contracts.
- Rework the drawing toolbar, palettes, or chart theme tokens globally.
- Remove chart tick labels, crosshair labels, or the `price-line` value label.

## Decisions

1. Replace built-in `fibonacciLine` with a Signapse-owned overlay template.

   Rationale: KLineCharts built-in `fibonacciLine` formats labels as `price (percent%)`. A custom template lets Signapse keep every percent label while omitting price values without patching vendor code.

   Alternative considered: hide labels entirely. Rejected because Fibonacci levels lose too much meaning without percentages.

2. Keep full Fibonacci percentage coverage.

   Rationale: The final product decision is to retain every configured Fibonacci percentage label. The clutter fix should remove price detail and selected-axis helpers, not Fibonacci percentages.

   Alternative considered: show only major Fibonacci levels. Rejected by product preference.

3. Disable default selected-axis figures by default.

   Rationale: `needDefaultXAxisFigure` and `needDefaultYAxisFigure` create anchor date/price labels and selection bands only for the selected overlay. These duplicate chart crosshair and axis inspection affordances and create most of the date clutter in the screenshots.

   Alternative considered: restyle the default selected-axis figures. Rejected because the extra labels remain noisy even if restyled.

4. Allow selected Y-axis value labels only for price-level tools.

   Rationale: `price-line` and horizontal price-level tools can reasonably expose the selected price value. Shape, channel, Fibonacci, Gann, and pattern drawings do not need anchor price labels for normal analysis.

   Alternative considered: disable all Y-axis selected labels. Rejected because price-line loses useful feedback.

5. Use readable drawing text styling independent of stroke color.

   Rationale: Text that inherits the drawing stroke color can become low contrast against the chart background. Text should use a chart-readable text color while line, border, and point styles continue to use the selected drawing color.

   Alternative considered: add text color as another user-selected style. Rejected as unnecessary configuration.

## Risks / Trade-offs

- Custom Fibonacci line may differ slightly from KLineCharts built-in geometry -> keep the implementation minimal and mirror the existing Signapse Fibonacci level helper.
- Hiding selected-axis anchor labels removes always-visible exact anchor timestamps -> users can still inspect exact time with crosshair/tick labels and exact values through chart axis/crosshair.
- KLineCharts text figure support may not support background fill for overlay text -> use readable text color first; add background only if the engine supports it cleanly.
