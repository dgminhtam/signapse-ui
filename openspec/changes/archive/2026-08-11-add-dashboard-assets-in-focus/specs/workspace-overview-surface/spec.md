## MODIFIED Requirements

### Requirement: Overview prioritizes workspace orientation and tracked-asset readiness

The root workspace overview SHALL render its successful state as a Current Workspace surface followed by a live Trading Snapshot section, a live Event Timeline section, and a live Assets in Focus section. When the user can read news, it SHALL also render an independent Latest News module alongside Event Timeline. Current Workspace SHALL remain focused on active workspace identity and tracked-asset readiness; Trading Snapshot, Event Timeline, and Assets in Focus SHALL provide separate decision-oriented summaries for the same backend-resolved dashboard context; Latest News SHALL provide a global recent-news view.

#### Scenario: Successful overview renders

- **WHEN** an authenticated user opens the root overview with a readable workspace and news read permission
- **THEN** the page renders one Current Workspace surface, one Trading Snapshot section, one Event Timeline section, one Latest News module, and one Assets in Focus section
- **AND** Current Workspace identifies the active workspace by name and presents tracked-asset readiness as its primary content region
- **AND** Trading Snapshot, Event Timeline, Latest News, and Assets in Focus render only live data or explicit loading, empty, denied, or error states

#### Scenario: Successful overview hides unavailable news

- **WHEN** an authenticated user opens the root overview with a readable workspace but without news read permission
- **THEN** the page renders Current Workspace, Trading Snapshot, Event Timeline, and Assets in Focus without Latest News
- **AND** Event Timeline and Assets in Focus use the available content width for their current production composition

#### Scenario: Current Workspace surface uses the accepted hierarchy

- **WHEN** the production overview renders its successful state
- **THEN** it uses the accepted dashboard prototype Card header, action, metadata, count, and responsive Item list hierarchy for Current Workspace
- **AND** it populates that hierarchy with live workspace and tracked-asset data
- **AND** it does not import prototype mock data or scenario controls

#### Scenario: Overview is scanned quickly

- **WHEN** a user scans the overview
- **THEN** they can tell which workspace is active and whether tracked assets are configured without reading repeated explanatory copy
- **AND** they can scan the next key event, the three summary counts, recent event context, latest news titles when eligible, and ranked asset context without opening a separate dashboard route

### Requirement: Overview composition follows Signapse UI policy

The simplified overview SHALL use existing shadcn wrappers and Signapse layout conventions, and its loading fallback SHALL mirror the successful Current Workspace, Trading Snapshot, Event Timeline, eligible Latest News, and Assets in Focus footprints.

#### Scenario: Implementation is reviewed

- **WHEN** the overview implementation is reviewed
- **THEN** it uses existing components such as `Card`, `Item`, `Empty`, `Badge`, `Button`, and `Skeleton` where applicable
- **AND** it does not modify `components/ui/*` to solve overview-specific layout concerns
- **AND** it uses `gap-*` spacing and semantic tokens rather than custom primitive chrome overrides

#### Scenario: Overview is loading

- **WHEN** the route is suspended while production data loads
- **THEN** the fallback renders Current Workspace, Trading Snapshot, Event Timeline, and Assets in Focus skeleton footprints
- **AND** it includes a Latest News skeleton footprint when that module is eligible to render
- **AND** the skeletons preserve the final Cards, eligible header actions, and responsive content regions

## ADDED Requirements

### Requirement: Current Workspace remains the only tracked-asset management surface

Adding Assets in Focus SHALL NOT duplicate the tracked-asset management action already owned by Current Workspace. Assets in Focus SHALL describe an empty ranking without rendering a second trigger for the same watchlist editor or a no-op link back to the current dashboard.

#### Scenario: Assets in Focus is empty and management is available

- **WHEN** the current user can manage tracked assets and `assetsInFocus.state = "EMPTY"`
- **THEN** Current Workspace retains the overview's one clear management action
- **AND** Assets in Focus does not render another action that opens the same editor or navigates to the current page without changing state

