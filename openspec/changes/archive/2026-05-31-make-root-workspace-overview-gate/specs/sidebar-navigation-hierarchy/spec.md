## ADDED Requirements

### Requirement: Sidebar exposes root overview navigation
The sidebar navigation SHALL expose the protected app root route as a first-class overview destination.

#### Scenario: Sidebar renders protected navigation
- **WHEN** an authenticated user opens the protected app sidebar
- **THEN** the sidebar includes a top-level item labeled `Tổng quan` in Vietnamese and `Overview` in English
- **AND** the item links to `/` through the existing locale-aware link behavior

#### Scenario: Root overview item is active
- **WHEN** the current protected pathname is the locale-normalized root path
- **THEN** the root overview sidebar item is the active item
- **AND** feature items such as Graph View and Market Charts are not active

#### Scenario: Non-root route is active
- **WHEN** the current protected pathname is a feature route such as `/graph-view`
- **THEN** the root overview sidebar item is not active
- **AND** the matching feature item continues to use the existing active treatment

### Requirement: Root overview navigation preserves sidebar behavior
The root overview sidebar item SHALL use the existing sidebar composition, route matching, tooltip, icon, density, and permission-filtering patterns.

#### Scenario: Sidebar implementation is reviewed
- **WHEN** the overview item is added
- **THEN** it is defined through the existing site navigation config rather than hardcoded directly in the sidebar render loop
- **AND** shadcn sidebar primitives remain unchanged

#### Scenario: Sidebar is collapsed
- **WHEN** the sidebar is collapsed to icon mode
- **THEN** the overview item remains reachable with the same tooltip behavior as other top-level items
