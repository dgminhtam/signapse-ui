## Context

The market chart currently exposes a curated indicator set from the workbench and synchronizes that selection through the KLineCharts canvas adapter. Main-pane indicators are stacked on `candle_pane`; all other indicators receive deterministic secondary panes. This existing synchronization already handles creation, removal, duplicate prevention, and chart-instance reuse.

KLineCharts `10.0.0` includes DMI with default parameters `[14, 6]` and the PDI, MDI, ADX, and ADXR figures, but it does not include ATR. Market candles already provide sanitized high, low, and close values, so ATR requires no API or DTO changes.

## Goals / Non-Goals

**Goals:**

- Expose ATR and DMI in the existing indicator control surface.
- Calculate ATR(14) with Wilder smoothing and display it in a secondary pane.
- Use KLineCharts' built-in DMI under the unchanged `DMI` name.
- Reuse the current indicator synchronization and mounted chart instance.
- Leave one dependency-free runnable calculation check for the custom ATR logic.

**Non-Goals:**

- Ichimoku support.
- User-editable indicator parameters.
- Persisting indicator selection in the URL, browser storage, or backend.
- Reimplementing DMI or exposing ADX as a separate indicator.
- Adding a general-purpose custom-indicator framework.

## Decisions

### Register one feature-local custom ATR indicator

Add a small `market-chart-atr.ts` module containing a pure ATR calculator and an idempotent registration function. Register ATR immediately before the existing KLineCharts `init()` call.

The indicator uses:

- name and short name `ATR`;
- fixed calculation parameters `[14]`;
- `series: "price"` so values follow instrument price precision;
- one line figure keyed as `atr`;
- missing results during warm-up rather than synthetic zeroes.

For candle index `i`, true range is:

`max(high[i] - low[i], abs(high[i] - close[i - 1]), abs(low[i] - close[i - 1]))`

The first ATR is the arithmetic mean of the first 14 true ranges. Later values use Wilder recurrence:

`(previousATR * 13 + currentTR) / 14`

The first candle uses `high - low` because there is no previous close. The calculation is one linear pass.

Alternatives considered:

- A rolling SMA was rejected because it is not Wilder ATR.
- A new indicator dependency was rejected because the calculation is small and KLineCharts already provides the registration API.
- Embedding the calculation inside the canvas was rejected because a pure exported function gives the non-trivial formula one direct runnable check without exercising browser chart state.

### Use built-in DMI without an adapter or alias

Add `DMI` to the supported indicator catalog and let the existing synchronization call KLineCharts by that name. The built-in implementation already supplies PDI, MDI, ADX, and ADXR, so no custom calculation or separate ADX entry is needed.

Alternatives considered:

- A custom DMI was rejected as duplicate logic.
- Renaming DMI to ADX was rejected because it hides the directional lines and conflicts with the agreed UI name.

### Reuse the current secondary-pane synchronization

ATR and DMI remain outside the main-pane indicator set. The existing fallback therefore assigns each a deterministic pane ID and the established secondary-pane height, minimum height, and drag behavior. Repeated toggles continue to query existing indicators before creating one and remove by indicator name when disabled.

No effect dependency or chart initialization path will be added for these indicators. Active-selection changes flow through the existing synchronization effect, preserving the mounted chart instance.

### Keep one shared indicator catalog

Export the supported indicator tuple and derive `MarketChartIndicatorName` from it in the canvas module. The workbench imports that tuple instead of maintaining a second list. The existing Volume-specific availability rule remains in the workbench.

This is a narrow removal of duplicated source-of-truth data, not a generalized registry.

### Keep labels locale-neutral

Add `ATR` and `DMI` keys to both English and Vietnamese market chart dictionaries, with the exact values `ATR` and `DMI`. Existing localized control text and selected-state semantics remain unchanged.

### Verify the custom formula without adding a test framework

Add one Node assert script for the pure ATR calculator. It covers warm-up, a flat series, a previous-close gap, the initial 14-period average, and the next Wilder recurrence. Typecheck, lint, build, and OpenSpec validation remain the repository-level checks.

## Risks / Trade-offs

- [ATR can differ from platforms that seed or smooth it differently] → Specify and assert the Wilder seed and recurrence explicitly.
- [KLineCharts indicator registration is global] → Make registration idempotent and call it once in the existing mount path before `init()`.
- [DMI lines appear at different warm-up points] → Preserve KLineCharts' missing early values instead of fabricating zeroes; PDI/MDI, ADX, and ADXR naturally become available at different candle counts.
- [Importing two indicator lists can drift] → Replace the workbench duplicate with the exported tuple.

## Migration Plan

1. Register ATR and extend the shared supported-indicator catalog.
2. Expose ATR and DMI through the existing workbench control and dictionaries.
3. Run the ATR assertion script and repository validation.

The change is frontend-only and requires no data migration. Rollback consists of removing ATR registration and both catalog entries; stored user or backend data is unaffected.

## Open Questions

None. Parameter editing and Ichimoku require separate future changes.
