## Context

KLineChart already provides `VOL` as a built-in indicator. Signapse currently keeps Volume outside the curated indicator model: the workbench derives `showVolumePane` directly from candle availability, and the canvas owns a separate effect that creates or removes the `VOL` pane. Consequently, usable volume is always shown and the indicator selector cannot control it.

The existing indicator boundary already owns optional indicator state in the workbench and synchronizes selected indicators through `MarketChartCanvas`. The change should reuse that path and keep volume validation based on the existing `hasUsableVolumeData` helper.

## Goals / Non-Goals

**Goals:**

- Make Volume a default-off option in the existing indicator selector.
- Render `VOL` only when the user selects it and the active candle data has usable volume.
- Keep unavailable volume distinct from real zero volume.
- Remove the parallel automatic-volume synchronization path.

**Non-Goals:**

- Changing backend candle or live-stream contracts.
- Classifying provider volume as exchange, consolidated, or tick volume.
- Persisting indicator selection in the URL or across sessions.
- Adding a custom Volume calculation or another chart/technical-analysis dependency.
- Changing other indicator behavior or pane configuration.

## Decisions

### Use the existing active-indicator state as the single source of truth

`VOL` will join `MarketChartIndicatorName`, the curated option list, and `syncChartIndicators`. The independent `showVolumePane` canvas prop and synchronization effect will be removed.

This avoids a second `volumeEnabled` state that could disagree with the indicator selector. Keeping the current automatic effect and merely adding a toolbar toggle was rejected because it would preserve two owners for the same KLineChart indicator.

### Gate Volume at both the control and adapter boundaries

The workbench will derive volume availability with `hasUsableVolumeData`. The Volume option will be disabled when a successfully loaded chart has no usable volume, and an unavailable `VOL` selection will be removed from the active selection. The canvas synchronization boundary will receive only valid active indicators and will continue to avoid creating indicators that are already mounted.

The adapter boundary remains defensive so an empty Volume pane is not created because of stale or malformed UI state.

### Preserve the dedicated Volume pane configuration

Although `VOL` joins the common synchronization loop, it will retain its dedicated pane identity and compact pane options. This keeps removal deterministic and preserves the existing Volume layout while eliminating the separate effect.

### Keep Volume default-off and local to the mounted workbench

The existing empty initial indicator selection remains unchanged. Indicator state is not added to route query parameters or persistent storage because the requested behavior only requires an explicit per-session toggle.

## Risks / Trade-offs

- [A selected Volume indicator becomes unavailable after changing assets] → Remove `VOL` from the active selection after the new successful dataset proves that no usable volume exists, and disable its control.
- [Duplicate Volume panes during repeated toggles] → Reuse the existing `getIndicators` check before `createIndicator` and remove by the stable Volume pane/indicator identity.
- [Live data introduces volume after an initially volume-less response] → Recompute availability through the existing historical/live helper so the option can become available without synthesizing volume.
- [Volume selection is not restored after moving back to an asset with volume] → Treat deselection as the predictable default-off behavior; persistence is outside this change.

## Migration Plan

1. Extend the curated indicator type and option list with `VOL`, displayed with the locale-neutral technical label `Volume`.
2. Route `VOL` through common indicator synchronization while preserving its pane options.
3. Remove the automatic `showVolumePane` prop and canvas effect.
4. Verify default-off, enable/disable, unavailable-data, and repeated-toggle behavior.

Rollback is a source revert; there is no stored data or backend migration.

## Open Questions

None.
