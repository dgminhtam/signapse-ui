## Why

The market chart annotation popup already uses the shadcn Popover wrapper, but its content overrides Popover chrome with `p-0` and a custom header/body shell. Standardizing the popup composition keeps the visual system aligned with shadcn while preserving the existing annotation behavior.

## What Changes

- Refactor the annotation popup content to use shadcn Popover composition for the shared header area.
- Move the popup title/count and close action into `PopoverHeader`/`PopoverTitle` instead of a custom bordered header wrapper.
- Replace the popup body's native overflow container with shadcn `ScrollArea` so long annotation groups scroll with the standard treatment.
- Preserve the existing annotation grouping, selection, close, mobile fallback, event opening, outcome rendering, and color logic.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `market-chart-annotation-popup-surface`: Standardize the market chart annotation popup shell on shadcn Popover composition and ScrollArea containment without changing annotation logic.

## Impact

- Affected UI: market chart annotation popup and narrow-screen selected annotation fallback.
- Affected components: market chart workbench popup rendering and shadcn `ScrollArea` usage if already installed.
- APIs/dependencies: no backend contract changes and no new dependency expected; use the existing shadcn wrapper if present.
