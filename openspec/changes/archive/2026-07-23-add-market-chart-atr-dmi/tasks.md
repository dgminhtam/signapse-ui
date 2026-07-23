## 1. ATR Calculation

- [x] 1.1 Add a feature-local ATR module that calculates Wilder ATR(14), leaves warm-up values missing, and registers the price-series line indicator idempotently with KLineCharts.
- [x] 1.2 Add one dependency-free Node assertion script covering warm-up, flat candles, previous-close gaps, the initial average, and Wilder recurrence.

## 2. Indicator Integration

- [x] 2.1 Extend the shared market chart indicator tuple and derived type with ATR and DMI, register ATR before chart initialization, and route both through the existing secondary-pane synchronization.
- [x] 2.2 Replace the workbench's duplicate indicator list with the shared tuple while preserving Volume availability and active-count behavior.
- [x] 2.3 Add exact `ATR` and `DMI` labels to the English and Vietnamese market chart dictionaries.

## 3. Verification

- [x] 3.1 Run the ATR assertion script and confirm all formula checks pass.
- [x] 3.2 Run `pnpm typecheck` and `pnpm lint`.
- [x] 3.3 Run `pnpm build`.
- [x] 3.4 Run OpenSpec validation for `add-market-chart-atr-dmi`.

User-owned manual QA: toggle ATR and DMI independently and together, confirm no duplicate panes after repeated toggles, and confirm active indicators recalculate without rebuilding the chart when the asset or timeframe changes.

Verification note: typecheck and scoped lint pass. The repository-wide lint command remains blocked by pre-existing editor/UI errors outside this change.
