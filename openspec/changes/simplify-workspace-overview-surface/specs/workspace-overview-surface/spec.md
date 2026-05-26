## ADDED Requirements

### Requirement: Overview prioritizes workspace orientation and tracked-asset readiness
The root workspace overview SHALL focus the successful state on the active workspace identity and the readiness of its tracked-asset list.

#### Scenario: Successful overview renders
- **WHEN** an authenticated user opens the root overview with a readable workspace
- **THEN** the page identifies the active workspace by name
- **AND** the page presents tracked-asset readiness as the primary content region
- **AND** the page does not present unrelated dashboard metrics as first-viewport content

#### Scenario: Overview is scanned quickly
- **WHEN** a user scans the overview
- **THEN** they can tell which workspace is active and whether tracked assets are configured without reading repeated explanatory copy

### Requirement: Overview avoids repeated status and metadata
The overview SHALL NOT show the same workspace status, scope, update time, or action in multiple primary locations.

#### Scenario: Active workspace is resolved
- **WHEN** the overview renders an active workspace
- **THEN** it does not show both an active badge and a separate active-status stat for the same state
- **AND** it does not repeat the same updated timestamp in both a primary stat and a technical details panel

#### Scenario: Watchlist management is available
- **WHEN** the user has permission to manage tracked assets
- **THEN** the overview shows one clear watchlist management action
- **AND** it does not render duplicate buttons that open the same watchlist editor in separate regions

### Requirement: Technical workspace details are secondary
The overview SHALL keep support/debug identifiers out of the default primary reading path.

#### Scenario: Workspace technical fields exist
- **WHEN** the workspace has an ID, created date, and last modified date
- **THEN** the overview does not present those fields as a first-viewport panel competing with tracked-asset readiness
- **AND** any retained technical details use a low-priority secondary treatment

### Requirement: Tracked-asset preview is compact and non-duplicative
The overview SHALL show tracked assets using one compact preview representation.

#### Scenario: Workspace has tracked assets
- **WHEN** the tracked-asset preview loads with one or more assets
- **THEN** each previewed asset appears once in the overview
- **AND** the page does not show the same asset list as both a chip group and a separate repeated card/list group

#### Scenario: Workspace has many tracked assets
- **WHEN** the tracked-asset list contains more assets than can comfortably fit in the overview
- **THEN** the preview caps the visible items
- **AND** the overview provides the watchlist management action as the path to review or edit the full list

### Requirement: Gate and watchlist states remain clear
The simplified overview SHALL preserve existing workspace and watchlist state handling.

#### Scenario: Workspace gate state renders
- **WHEN** the user lacks workspace read permission, workspace loading fails, or no readable workspace can be resolved
- **THEN** the overview displays a clear localized `Empty` state for that condition
- **AND** it does not render the successful workspace overview content

#### Scenario: Watchlist state renders
- **WHEN** tracked assets are unavailable because of missing permissions, load failure, or an empty list
- **THEN** the tracked-asset region displays the appropriate localized state
- **AND** the page does not fill the state with unrelated technical metadata or repeated status cards

### Requirement: Overview composition follows Signapse UI policy
The simplified overview SHALL use existing shadcn wrappers and Signapse layout conventions.

#### Scenario: Implementation is reviewed
- **WHEN** the overview implementation is reviewed
- **THEN** it uses existing components such as `Empty`, `Badge`, `Button`, and `Skeleton` where applicable
- **AND** it does not modify `components/ui/*` to solve overview-specific layout concerns
- **AND** it uses `gap-*` spacing and semantic tokens rather than custom primitive chrome overrides
