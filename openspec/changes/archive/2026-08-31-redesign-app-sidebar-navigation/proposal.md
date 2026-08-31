## Why

The protected app sidebar is visually consistent but its current hierarchy mixes editorial, market-data, system-configuration, access-control, moderation, and personal credential workflows. Collapsed mode also hides every child destination behind nonfunctional disclosure controls, so a persisted or first-visit collapsed sidebar removes access to most protected routes.

## What Changes

- Reorganize protected navigation into the localized `Analysis`, `Data`, and `Administration` sections with the agreed destination order, labels, and distinct Lucide icons.
- Group News, System configuration, and Users & permissions while keeping Events, Economic calendar, and Feedback review as direct destinations.
- Move the personal API access token destination from Administration into the authenticated account menu.
- Make a missing sidebar preference default to expanded while preserving explicit expanded or collapsed preferences.
- Add click- and keyboard-accessible flyout navigation for grouped destinations in collapsed desktop mode without changing workspace width.
- Keep active groups initially open in expanded mode, allow independent disclosure, and avoid persisting temporary group state.
- Preserve stable permission-aware hierarchy: hide empty groups and sections, retain single-child groups, and keep canonical order.
- Expose current destinations semantically with `aria-current="page"` and complete the mobile sheet with localized assistive copy, a visible close control, and touch-friendly targets.
- Extend the fixture-backed P0 app-shell journey to cover permission personas, collapsed flyouts, mobile navigation, keyboard/focus behavior, localization, and serious/critical axe checks.
- Reconcile the overlapping sidebar specifications so the neutral selected-surface contract remains authoritative and obsolete accent-only or behavior-unchanged requirements no longer conflict with the redesigned navigation.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `sidebar-navigation-hierarchy`: Define the canonical section hierarchy, labels, icons, account-menu placement, default state, expanded/collapsed interaction, active semantics, responsive behavior, and permission filtering contract.
- `sidebar-navigation-state-treatment`: Remove obsolete accent-only and expanded-parent emphasis requirements that conflict with the accepted neutral selected-surface treatment.
- `sidebar-selected-surface-treatment`: Preserve neutral selected navigation while adding semantic current-page behavior across direct and child destinations.
- `browser-test-foundation`: Cover the redesigned app-shell navigation through the existing fixture-backed P0 browser seam and generalized permission-persona control.

## Impact

- Affects protected app-shell navigation configuration, sidebar composition, persisted default state, account-menu composition, and Vietnamese/English navigation dictionaries.
- May add a narrow generic accessibility-only input to the shared sidebar wrapper for localized mobile sheet metadata; feature-specific chrome remains composed outside the wrapper.
- Extends the existing synthetic HTTP fixture controls and browser journeys without changing production APIs, permission keys, destination routes, or backend contracts.
- Adds no runtime dependency and preserves the existing Lucide, shadcn/Base UI, locale-aware link, and semantic token systems.
