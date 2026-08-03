# workspace-overview-surface Specification

## MODIFIED Requirements

### Requirement: Overview prioritizes workspace orientation and tracked-asset readiness

The root workspace overview SHALL render its successful state as a Current Workspace surface followed by a live Trading Snapshot section and a live Event Timeline section. When the user can read news, it SHALL also render an independent Latest News module alongside Event Timeline. The Current Workspace surface SHALL remain focused on the active workspace identity and the readiness of its tracked-asset list, while Trading Snapshot and Event Timeline provide separate decision-oriented summaries for the same backend-resolved dashboard context and Latest News provides a global recent-news view.

#### Scenario: Successful overview renders

- **WHEN** an authenticated user opens the root overview with a readable workspace and news read permission
- **THEN** the page renders one Current Workspace content surface, one Trading Snapshot section, one Event Timeline section, and one Latest News module
- **AND** the Current Workspace surface identifies the active workspace by name
- **AND** the Current Workspace surface presents tracked-asset readiness as its primary content region
- **AND** Trading Snapshot, Event Timeline, and Latest News render only live data or explicit loading/empty/error states

#### Scenario: Successful overview hides unavailable news

- **WHEN** an authenticated user opens the root overview with a readable workspace but without news read permission
- **THEN** the page renders Current Workspace, Trading Snapshot, and Event Timeline without Latest News
- **AND** Event Timeline uses the available content width

#### Scenario: Current Workspace surface uses the accepted hierarchy

- **WHEN** the production overview renders its successful state
- **THEN** it uses the accepted dashboard prototype Card header, action, metadata, count, and responsive Item list hierarchy for Current Workspace
- **AND** it populates that hierarchy with live workspace and tracked-asset data
- **AND** it does not import prototype mock data or scenario controls

#### Scenario: Overview is scanned quickly

- **WHEN** a user scans the overview
- **THEN** they can tell which workspace is active and whether tracked assets are configured without reading repeated explanatory copy
- **AND** they can scan the next key event, the three summary counts, recent event context, and the latest news titles without opening a separate dashboard route

### Requirement: Overview composition follows Signapse UI policy

The simplified overview SHALL use existing shadcn wrappers and Signapse layout conventions, and its loading fallback SHALL mirror the successful Current Workspace, Trading Snapshot, Event Timeline, and eligible Latest News footprints.

#### Scenario: Implementation is reviewed

- **WHEN** the overview implementation is reviewed
- **THEN** it uses existing components such as `Card`, `Item`, `Empty`, `Badge`, `Button`, and `Skeleton` where applicable
- **AND** it does not modify `components/ui/*` to solve overview-specific layout concerns
- **AND** it uses `gap-*` spacing and semantic tokens rather than custom primitive chrome overrides

#### Scenario: Overview is loading

- **WHEN** the route is suspended while production data loads
- **THEN** the fallback renders Current Workspace, Trading Snapshot, and Event Timeline skeleton footprints
- **AND** it includes a Latest News skeleton footprint when the module is eligible to render
- **AND** the skeletons preserve the final cards, header actions, and responsive content regions
