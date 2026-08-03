# workspace-overview-surface Specification

## Purpose
TBD - created by archiving change simplify-workspace-overview-surface. Update Purpose after archive.
## Requirements
### Requirement: Overview prioritizes workspace orientation and tracked-asset readiness
The root workspace overview SHALL render its successful state as a Current Workspace surface followed by a live Trading Snapshot section and a live Event Timeline section. The Current Workspace surface SHALL remain focused on the active workspace identity and the readiness of its tracked-asset list, while Trading Snapshot and Event Timeline provide separate decision-oriented summaries for the same backend-resolved dashboard context.

#### Scenario: Successful overview renders
- **WHEN** an authenticated user opens the root overview with a readable workspace
- **THEN** the page renders one Current Workspace content surface, one Trading Snapshot section, and one Event Timeline section
- **AND** the Current Workspace surface identifies the active workspace by name
- **AND** the Current Workspace surface presents tracked-asset readiness as its primary content region
- **AND** Trading Snapshot and Event Timeline render only live summary metrics or explicit loading/empty/error states

#### Scenario: Current Workspace surface uses the accepted hierarchy
- **WHEN** the production overview renders its successful state
- **THEN** it uses the accepted dashboard prototype Card header, action, metadata, count, and responsive Item list hierarchy for Current Workspace
- **AND** it populates that hierarchy with live workspace and tracked-asset data
- **AND** it does not import prototype mock data or scenario controls

#### Scenario: Overview is scanned quickly
- **WHEN** a user scans the overview
- **THEN** they can tell which workspace is active and whether tracked assets are configured without reading repeated explanatory copy
- **AND** they can scan the next key event, the three summary counts, and recent event context without opening a separate dashboard route

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
The simplified overview SHALL use existing shadcn wrappers and Signapse layout conventions, and its loading fallback SHALL mirror the successful Current Workspace, Trading Snapshot, and Event Timeline footprints.

#### Scenario: Implementation is reviewed
- **WHEN** the overview implementation is reviewed
- **THEN** it uses existing components such as `Card`, `Item`, `Empty`, `Badge`, `Button`, and `Skeleton` where applicable
- **AND** it does not modify `components/ui/*` to solve overview-specific layout concerns
- **AND** it uses `gap-*` spacing and semantic tokens rather than custom primitive chrome overrides

#### Scenario: Overview is loading
- **WHEN** the route is suspended while production data loads
- **THEN** the fallback renders Current Workspace, Trading Snapshot, and Event Timeline skeleton footprints
- **AND** the skeletons preserve the final cards, header actions, and responsive content regions
