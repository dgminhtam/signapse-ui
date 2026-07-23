## Why

The indicator popover currently presents persistent chart-layer settings as toggle buttons, making their on/off state less explicit than the established Event settings pattern. Aligning both popovers will improve visual hierarchy, state clarity, and consistency without changing indicator behavior.

## What Changes

- Add a localized purpose description beneath the indicator settings title.
- Present every curated indicator in its own muted item surface.
- Replace the multiple toggle-button list with individually labeled switches.
- Preserve the existing controlled selection, active-count, Volume availability, chart update, and error behavior.
- Keep the popover usable on short and narrow viewports.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `market-chart-control-toolbar`: Refine the indicator control surface to use a descriptive header and explicit per-indicator switches in muted item rows.

## Impact

- Market Chart toolbar UI in `market-chart-workbench.tsx`.
- Vietnamese and English market-chart indicator dictionaries.
- Existing indicator state and canvas adapter contracts remain unchanged.
- No API, persistence, URL-state, dependency, or backend changes.
