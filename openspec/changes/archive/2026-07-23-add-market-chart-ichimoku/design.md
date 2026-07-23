## Context

The market chart exposes one shared indicator catalog through the workbench and synchronizes selected indicators into a mounted KLineCharts `10.0.0` instance. MA, EMA, and BOLL stack on `candle_pane`; other indicators use deterministic secondary panes. ATR established the feature-local pattern for registering a custom indicator before chart initialization.

KLineCharts `10.0.0` does not include Ichimoku, but its stable custom-indicator contract provides price-series registration, line figures, a calculation callback, a custom drawing callback, visible-range access, and data-index-to-pixel conversion. Signapse candles already provide normalized high, low, and close values, so no transport or DTO change is required.

Classic Ichimoku has an additional rendering constraint: Senkou Span A and B are plotted 26 indexes after their source candles, including indexes beyond the latest real candle. The chart currently starts with a fixed 24-pixel right offset, which is insufficient to expose that projection.

## Goals / Non-Goals

**Goals:**

- Add the complete classic Ichimoku Kinko Hyo system with fixed parameters `[9, 26, 52, 26]`.
- Render Tenkan, Kijun, Senkou A, Senkou B, Chikou, and a correctly split bullish/bearish Kumo on `candle_pane`.
- Preserve the 26-index leading and trailing displacement without synthetic warm-up zeroes.
- Show the 26-bar future projection by adjusting right-side space only when Ichimoku changes enabled state.
- Reuse the existing indicator catalog, selection control, live updates, lazy history, theme updates, screenshots, and mounted chart instance.
- Leave one dependency-free runnable check for calculation, displacement, and Kumo-crossing logic.

**Non-Goals:**

- Editable indicator parameters or alternative Ichimoku presets.
- Independent visibility controls for individual lines or Kumo.
- Trading signals, alerts, interpretations, or strategy execution.
- Persistence of indicator selection.
- A general custom-indicator framework or a new technical-analysis dependency.
- A custom y-axis implementation for projected data outside KLineCharts' normal auto-scale inputs.

## Decisions

### Register one feature-local `ICHIMOKU` indicator

Add `market-chart-ichimoku.ts` beside the existing market chart adapter files. It will export the fixed displacement, a pure calculator, the small pure Kumo-crossing geometry helper, and an idempotent registration function.

The registered indicator will use:

- name `ICHIMOKU` and short name `Ichimoku`;
- calculation parameters `[9, 26, 52, 26]`;
- `series: "price"` so it uses the candle pane price scale and instrument precision;
- line figures for Tenkan, Kijun, Senkou A, Senkou B, and Chikou;
- a custom `draw` callback for Kumo and future-only leading-span edges.

Registration will check `getSupportedIndicators()` before calling `registerIndicator()` and will run immediately before the existing KLineCharts `init()` call.

Alternatives considered:

- A third-party technical-analysis package was rejected because the formulas are small and KLineCharts already owns the rendering extension point.
- Embedding all logic in the canvas component was rejected because the pure calculation and crossing logic need a direct runnable check.
- A generalized indicator registry was rejected because there is only one new custom indicator and the shared tuple already owns selection.

### Calculate fixed windows with direct bounded scans

For each source index, calculate the midpoint of the highest high and lowest low over the required fixed window:

- Tenkan: 9;
- Kijun: 26;
- Senkou B: 52.

Senkou A is the midpoint of available Tenkan and Kijun. Senkou A and B are assigned to `sourceIndex + 26`; the source close is assigned to Chikou at `sourceIndex - 26`. Missing warm-up fields remain absent. The returned result can extend 26 items beyond the candle list so the custom renderer can access the future projection.

The bounded scans cost at most 87 high/low comparisons per candle, which is negligible for the current chart windows and simpler to verify than maintaining three monotonic queues.

Alternatives considered:

- Rolling SMA or EMA was rejected because Ichimoku uses range midpoints.
- Monotonic deques were rejected as unnecessary complexity for fixed maximum period 52.
- Truncating results at the last candle was rejected because it would omit the defining future projection.

### Let KLineCharts draw the five line figures

The custom draw callback will return `false`, allowing KLineCharts to render the configured line figures and their standard tooltip legends after the cloud is painted. This keeps line interpolation, tooltip formatting, price precision, and real-index y-axis participation inside the stable chart engine.

The custom callback will draw only translucent Kumo between adjacent Senkou A/B points. KLineCharts' stable line renderer iterates the real visible range, including result indexes in reserved future space, so the Senkou line figures already render beyond the latest candle without duplicate raw-canvas strokes.

It will clip drawing to the candle-pane bounds and limit work to `realFrom` through `realTo` plus adjacent points needed to connect segments. The clamped `from` and `to` range cannot be used because it ends at the latest real candle.

Alternatives considered:

- Reimplementing all five lines in raw canvas was rejected because it duplicates stable KLineCharts behavior.
- Returning `true` from custom draw was rejected because it would require rebuilding tooltip, line style, and interpolation behavior.

### Split Kumo at an interpolated crossing

For adjacent target indexes, compare `A - B` at both endpoints. If the sign does not change, fill one quadrilateral with the corresponding bullish or bearish treatment. If the sign changes, linearly interpolate the crossing and fill the two sides separately.

The bullish fill uses the current chart candle up color; the bearish fill uses the current candle down color. Canvas alpha supplies a subdued fill without changing global tokens. Reading current chart styles inside the draw callback makes theme changes effective after the existing `chart.setStyles()` update.

The crossing splitter remains a small pure helper so the assertion script can verify same-order and crossing cases without a browser canvas.

Alternatives considered:

- Coloring an entire crossing segment from one endpoint was rejected because it creates a visibly incorrect self-intersecting cloud near reversals.
- New Ichimoku theme tokens were rejected because the chart already has deterministic bullish and bearish colors.

### Reserve 26 bars only on the Ichimoku enabled-state transition

The existing indicator synchronization will compare whether an `ICHIMOKU` instance existed before and after synchronization.

- On disabled-to-enabled transition, call `setOffsetRightDistance(chart.getBarSpace().bar * 26)`.
- On enabled-to-disabled transition, restore the existing 24-pixel default offset.
- When other indicators change while Ichimoku state is unchanged, do not touch the offset.

KLineCharts stores the offset as a bar-count relationship internally, so it scales with later zoom changes. The existing right minimum visible bar count remains unchanged.

Alternatives considered:

- Keeping 26 empty bars permanently was rejected because it wastes candle space when Ichimoku is off.
- Updating offset on every indicator synchronization was rejected because it would unexpectedly snap a user-adjusted viewport.
- Rebuilding the chart with different initialization options was rejected because the existing imperative API handles the transition.

### Reuse the shared catalog and main-pane routing

Add `ICHIMOKU` to the exported indicator tuple and to the existing main-pane set. The workbench already derives its options, selected values, and active count from that tuple, so it needs no new control component or handler.

Add `ICHIMOKU: "Ichimoku"` to the English and Vietnamese dictionaries. The line titles use locale-neutral Ichimoku names.

The new module remains imported only from the client-only market chart canvas path. Server pages and server components will not import KLineCharts through this feature.

### Verify logic without a new test framework

Add one Node assertion script with the same narrow browser shim used by the ATR check. It will cover:

- missing warm-up fields;
- flat-price output;
- hand-calculated range midpoints;
- first Tenkan and Kijun indexes;
- Senkou A/B positive displacement;
- Chikou negative displacement;
- empty input;
- same-order and crossing Kumo geometry.

Repository verification will also run scoped lint, typecheck, production build, and strict OpenSpec validation. The production build is required because a direct KLineCharts server import previously caused `window is not defined`.

## Risks / Trade-offs

- [Projected result indexes have no real candles] → Keep them only in the custom indicator result and use KLineCharts' stable real visible range and data-index pixel conversion; do not fabricate candle data or timestamps.
- [Cloud crossing can be colored incorrectly] → Split at the interpolated A/B crossing and cover both branches in the runnable assertion.
- [Indicator synchronization runs through both props and the imperative toolbar call] → Detect actual pre/post `ICHIMOKU` existence so duplicate calls neither duplicate the indicator nor reset the right offset.
- [Theme changes can leave stale cloud colors] → Read the current KLineCharts candle colors during each custom draw rather than snapshotting CSS variables.
- [Live or prepended data changes source indexes] → Let KLineCharts rerun the pure calculation over the current chronological list; do not cache index-derived output outside the indicator.
- [KLineCharts imports can regress SSR] → Keep imports behind the existing client-only workbench boundary and require a production build.

## Migration Plan

1. Register the custom indicator and add it to the shared catalog and main-pane set.
2. Add Kumo rendering, future projection, and transition-based right-offset handling.
3. Add localized labels and the focused assertion script.
4. Run calculation checks and repository verification before enabling the control.

The change is frontend-only and needs no data migration. Rollback removes the registration, catalog entry, labels, and custom module; no stored data is affected.

## Open Questions

None. Parameter editing and projected-value auto-scale customization remain deliberately outside this change.
