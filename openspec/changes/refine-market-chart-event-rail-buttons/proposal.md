## Why

The market chart bottom event rail currently uses custom chip-like buttons for event milestones, which feels less aligned with the shadcn control language used across the rest of the screen. Refining the rail to use outline buttons keeps event navigation clear while reducing bespoke styling and visual noise.

## What Changes

- Replace the custom event milestone chip buttons in the bottom rail with shadcn `Button` composition using `variant="outline"`.
- Keep the bottom rail compact and chart-adjacent, with a subdued event count on the leading side and horizontal milestone actions on the trailing side.
- Preserve the current event selection behavior: clicking a milestone opens or focuses the corresponding annotation popup.
- Keep multi-event count badges only when a milestone groups more than one event.
- Keep loading and empty states simple and aligned with the existing rail surface.
- Do not add a custom timeline scrubber, drawing toolbar, chart header, new dependency, or route state in this change.

## Capabilities

### New Capabilities

- `market-chart-event-rail-buttons`: Covers the market chart bottom event rail milestone control treatment and interaction expectations.

### Modified Capabilities

- None.

## Impact

- Affected frontend file: `app/(main)/market-charts/market-chart-workbench.tsx`.
- No backend API, chart engine, annotation data contract, dependency, global theme token, or shadcn primitive changes are required.
- Verification should include targeted market chart lint, typecheck, build, OpenSpec validation, and visual smoke when an authenticated chart session with annotations is available.
