# workspace-overview-surface Specification

## MODIFIED Requirements

### Requirement: Overview prioritizes workspace orientation and tracked-asset readiness

The root workspace overview SHALL render its successful state as a Current Workspace surface followed by a live Trading Snapshot section. The Current Workspace surface SHALL remain focused on the active workspace identity and the readiness of its tracked-asset list, while Trading Snapshot provides the separate decision-oriented summary for the same backend-resolved dashboard context.

#### Scenario: Successful overview renders

- **WHEN** an authenticated user opens the root overview with a readable workspace
- **THEN** the page renders one Current Workspace content surface and one Trading Snapshot section
- **AND** the Current Workspace surface identifies the active workspace by name
- **AND** the Current Workspace surface presents tracked-asset readiness as its primary content region
- **AND** the Trading Snapshot renders only live summary metrics or explicit loading/empty/error states

#### Scenario: Current Workspace surface uses the accepted hierarchy

- **WHEN** the successful overview renders
- **THEN** it uses the accepted dashboard prototype Card header, action, metadata, count, and responsive Item list hierarchy for Current Workspace
- **AND** it populates that hierarchy with live workspace and tracked-asset data
- **AND** it does not import prototype mock data or scenario controls

#### Scenario: Overview is scanned quickly

- **WHEN** a user scans the overview
- **THEN** they can tell which workspace is active and whether tracked assets are configured without reading repeated explanatory copy
- **AND** they can scan the next key event and the three summary counts without opening a separate dashboard route
