## Why

The market chart currently creates the KLineChart `VOL` pane automatically whenever usable volume data exists, so users cannot reclaim chart space or treat volume consistently with the other optional indicators. Volume should be an explicit, default-off indicator controlled from the existing indicator selector while still refusing to imply data that the provider did not supply.

## What Changes

- Add Volume to the curated market chart indicator selector.
- Keep Volume disabled by default and render its pane only after the user enables it.
- Prevent the Volume option and pane from becoming active when the selected chart has no usable numeric volume.
- Manage KLineChart `VOL` through the same indicator synchronization boundary as the other supported indicators, removing the independent automatic-volume-pane path.
- Preserve the existing distinction between unavailable volume and real zero volume.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `market-chart-control-toolbar`: Add Volume to the Signapse-owned indicator control surface with data-aware availability.
- `market-chart-klinechart-engine`: Change the volume pane from automatic data-driven rendering to explicit user-controlled indicator rendering.
- `market-chart-candle-workbench`: Require available volume to remain hidden until the user enables the Volume indicator.

## Impact

- Affects the market chart workbench indicator state and toolbar option list.
- Affects the KLineChart canvas indicator type and synchronization logic.
- Uses the locale-neutral technical label `Volume` without adding dictionary entries.
- Does not change backend candle contracts, URL state, dependencies, or KLineChart vendor choice.
