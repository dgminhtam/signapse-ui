## ADDED Requirements

### Requirement: P0 app-shell navigation covers responsive permission-aware behavior

The fixture-backed P0 browser suite SHALL cover the protected app sidebar through the real server-rendered app shell across expanded desktop, collapsed desktop flyout, and mobile sheet states without reconstructing the interaction in a parallel component-test harness.

#### Scenario: Fresh and persisted desktop states are exercised

- **WHEN** the P0 journey opens the app shell with no sidebar cookie and with explicit expanded or collapsed cookie values
- **THEN** it verifies the agreed default and persisted state behavior through the rendered sidebar

#### Scenario: Collapsed grouped navigation is exercised

- **WHEN** the P0 journey activates a collapsed group by pointer and keyboard
- **THEN** it verifies child reachability, unchanged workspace width, selection navigation, Escape dismissal, and focus restoration

#### Scenario: Permission personas are exercised

- **WHEN** the P0 journey loads full, restricted, single-child, and empty-section permission collections
- **THEN** it verifies visible hierarchy, stable order, retained single-child parents, and omitted empty parents and sections

#### Scenario: Mobile navigation is exercised

- **WHEN** the P0 journey opens the sidebar at a narrow viewport
- **THEN** it verifies localized assistive metadata, visible dismissal, accepted target geometry, scrollable content, and reachable account navigation

#### Scenario: Current-page and accessibility behavior are exercised

- **WHEN** the P0 journey visits direct, child, and descendant routes in Vietnamese and English
- **THEN** it verifies localized labels, unique `aria-current="page"`, keyboard/focus behavior, and no serious or critical axe violations in agreed sidebar states

### Requirement: Fixture permission personas use one general control

The P0 fixture SHALL expose one per-test-run control for the `/me` permission collection that app-shell and feature journeys can use without adding a second permission source.

#### Scenario: Test configures current-user permissions

- **WHEN** a P0 test sets a synthetic permission collection for its `testRunId`
- **THEN** the fixture `/me` response returns that collection to normal application permission loading
- **AND** another test run does not observe the change

#### Scenario: Existing feedback journey configures permissions

- **WHEN** feedback browser coverage migrates to or temporarily aliases the general permission control
- **THEN** its existing permission scenarios remain deterministic
- **AND** there is no competing feedback-only permission state in the final fixture contract
