## Why

The reviewed Market Chart event-settings popover is still disconnected from the chart, while the separate Events and Economic Calendar toolbar toggles remain the only working controls. Connecting the approved popover to the existing layer behavior and adding impact filtering completes the intended single-command event settings workflow.

## What Changes

- Replace the two separate Events and Economic Calendar toolbar toggles with the approved Events settings command and popover.
- Connect the popover Events and Economic Calendar switches to the existing workbench layer state and enable handlers.
- Add local High, Medium, and Low impact selection state, defaulting to all three levels.
- Filter already-loaded economic calendar events before marker grouping, lane rendering, popover content, legend, and counts without refetching when impact selections change.
- Preserve impact selections while the Economic Calendar layer is disabled and restore the filtered view when it is enabled again.
- Normalize raw impact values through one shared economic-calendar helper so existing labels, badges, and Market Chart filtering classify impacts consistently.
- Keep settings session-local; do not add URL parameters, persistence, new dependencies, or a new backend API contract.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `market-chart-control-toolbar`: Replace the review-only prototype boundary with functional consolidated event settings and client-side economic-calendar impact filtering.

## Impact

- Market Chart workbench toolbar state, derived calendar events, marker groups, lane content, legend, and status counts.
- Shared economic-calendar impact normalization used by existing label and badge helpers.
- Existing Market Chart calendar loading continues to use the current authenticated action and backend endpoints without contract changes.
- The archived review-only prototype remains historical context; this change updates the active main specification.
