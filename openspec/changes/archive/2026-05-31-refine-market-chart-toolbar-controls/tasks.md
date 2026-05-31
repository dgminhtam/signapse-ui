## 1. Toolbar Refinement

- [x] 1.1 Adjust the market chart timeframe control wrapper so toggle borders, rounded corners, and focus rings are not clipped by the horizontal overflow container.
- [x] 1.2 Apply the smallest practical common shadcn-supported compact size to timeframe toggles, annotation toggle, indicator, screenshot, and fullscreen toolbar controls.
- [x] 1.3 Add an inline-start icon to the annotation/event toolbar toggle using the existing icon convention without explicit icon sizing classes.

## 2. Skeleton And Review

- [x] 2.1 Update market chart skeleton toolbar cues if compact control dimensions make the loading state drift from the final toolbar.
- [x] 2.2 Review the toolbar code for shadcn conformance: no ad hoc primitive height, radius, padding, typography, or icon-size overrides.
- [x] 2.3 Confirm the refresh command is not reintroduced and existing chart commands, route state, and watchlist-only asset selection remain unchanged.

## 3. Verification

- [x] 3.1 Run `openspec validate refine-market-chart-toolbar-controls --strict`.
- [x] 3.2 Run `pnpm typecheck`.
- [x] 3.3 Run a static code review/search for toolbar control sizing and event icon composition.
