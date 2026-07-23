## Context

The market chart currently pins `klinecharts@10.0.0-beta1`. Its adapter already uses the 10.x DataLoader, symbol, period, overlay lookup, locale, and style APIs, but it still relies on two beta-only contracts: array-based initialization layout and the three-argument `createIndicator` signature.

Stable `10.0.0` replaces the initialization layout with defaults for panes and y-axes, places indicator pane identity on the indicator object, and leaves pane sizing to `setPaneOptions`. The existing adapter boundary and chart lifecycle must remain intact.

## Goals / Non-Goals

**Goals:**

- Pin the supported stable KLineChart release.
- Migrate the two incompatible beta API usages with the smallest adapter-local change.
- Preserve pane IDs, pane dimensions, indicator stacking, candle-axis gap, chart instance lifetime, data loading, overlays, and user controls.
- Leave deterministic repository verification and a focused user-owned interaction checklist.

**Non-Goals:**

- Redesign the market chart UI or add indicators.
- Rewrite the DataLoader, live candle flow, drawing system, annotations, theme, or localization.
- Adopt multiple y-axes, custom hotkeys, continuous drawing, or other new 10.0.0 features.
- Remove the application ResizeObserver solely because KLineChart can resize itself; the observer also schedules annotation and drawing marker positions.

## Decisions

### Use exact stable version `10.0.0`

Update the existing dependency and lockfile without adding a compatibility wrapper or another chart package. An exact version follows the repository's current pinning style and prevents an unreviewed vendor update.

Alternative considered: remain on beta1. Rejected because the prerelease API is no longer the supported 10.x contract.

### Use stable default layout configuration

Replace the beta layout array with `layout.yAxis.gap` and rely on KLineChart's built-in `candle_pane` and x-axis. The existing `CANDLE_PANE_ID` already matches the stable built-in pane identity.

Alternative considered: recreate layout management outside KLineChart. Rejected because the stable initialization API already represents the required axis gap.

### Separate indicator placement from pane presentation

Create each indicator with an object containing its `name` and target `paneId`, pass the existing main-pane stacking flag as the second argument, and apply secondary-pane height, minimum height, and drag settings through `setPaneOptions` after successful creation.

This preserves:

- `MA`, `EMA`, and `BOLL` on `candle_pane`.
- Stable dedicated pane IDs for `MACD`, `RSI`, `KDJ`, and `VOL`.
- The compact, non-draggable Volume pane.
- At most one indicator instance of each supported name.

Alternative considered: allow KLineChart to generate pane IDs. Rejected because stable IDs are used to preserve deterministic pane behavior across toggles.

### Keep already-compatible adapter paths unchanged

Retain `setDataLoader`, `setSymbol`, `setPeriod`, `resetData`, overlay APIs, custom `text` figures, styles, locale registration, and explicit ResizeObserver behavior unless stable typechecking exposes a direct incompatibility.

## Risks / Trade-offs

- **Stable RSI calculation differs from beta1** → Accept vendor-correct stable output and call out the expected value change in user-owned QA.
- **Canvas behavior can compile while interaction regresses** → Run typecheck, scoped lint, build, and provide focused manual checks for indicators, drawings, lazy history, theme, locale, screenshot, and fullscreen.
- **Pane configuration timing could differ after creation** → Apply `setPaneOptions` immediately after a successful new indicator creation and preserve existing pane IDs.
- **Stable automatic resize overlaps the current observer** → Keep the existing observer because it also refreshes app-owned marker positions; revisit only if duplicate resize work is measured.

## Migration Plan

1. Update the dependency and lockfile to exact `10.0.0`.
2. Migrate initialization layout and indicator pane creation in the canvas adapter.
3. Run repository verification and review the final diff for beta-only API remnants.
4. Roll back by reverting the dependency, lockfile, and adapter changes together if stable runtime verification fails.

## Open Questions

None. New KLineChart 10 features remain deferred until a separate product requirement exists.
