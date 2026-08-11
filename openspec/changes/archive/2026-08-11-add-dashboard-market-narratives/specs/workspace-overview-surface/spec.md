## MODIFIED Requirements

### Requirement: Overview prioritizes workspace orientation and tracked-asset readiness

The root workspace overview SHALL render its successful state as a Current Workspace surface followed by a live Trading Snapshot section, a live Event Timeline section, and a paired live Assets in Focus and Market Narratives row. When the user can read news, it SHALL also render an independent Latest News module alongside Event Timeline. Current Workspace SHALL remain focused on active workspace identity and tracked-asset readiness; Trading Snapshot, Event Timeline, Assets in Focus, and Market Narratives SHALL provide separate decision-oriented summaries for the same backend-resolved dashboard context; Latest News SHALL provide a global recent-news view.

#### Scenario: Successful overview renders

- **WHEN** an authenticated user opens the root overview with a readable workspace and news read permission
- **THEN** the page renders one Current Workspace surface, one Trading Snapshot section, one Event Timeline section, one Latest News module, one Assets in Focus section, and one Market Narratives section
- **AND** the Current Workspace surface identifies the active workspace by name
- **AND** the Current Workspace surface presents tracked-asset readiness as its primary content region
- **AND** Trading Snapshot, Event Timeline, Latest News, Assets in Focus, and Market Narratives render only live data or explicit loading, empty, denied, or error states

#### Scenario: Successful overview hides unavailable news

- **WHEN** an authenticated user opens the root overview with a readable workspace but without news read permission
- **THEN** the page renders Current Workspace, Trading Snapshot, Event Timeline, Assets in Focus, and Market Narratives without Latest News
- **AND** Event Timeline uses the available row width while Assets in Focus and Market Narratives retain their paired production composition

#### Scenario: Current Workspace surface uses the accepted hierarchy

- **WHEN** the production overview renders its successful state
- **THEN** it uses the accepted dashboard prototype Card header, action, metadata, count, and responsive Item list hierarchy for Current Workspace
- **AND** it populates that hierarchy with live workspace and tracked-asset data
- **AND** it does not import prototype mock data or scenario controls

#### Scenario: Overview is scanned quickly

- **WHEN** a user scans the overview
- **THEN** they can tell which workspace is active and whether tracked assets are configured without reading repeated explanatory copy
- **AND** they can scan the next key event, the three summary counts, recent event context, latest news titles when eligible, ranked asset context, and ranked Market Narratives without opening a separate dashboard route

### Requirement: Overview composition follows Signapse UI policy

The simplified overview SHALL use existing shadcn wrappers and Signapse layout conventions. At large desktop widths it SHALL pair Assets in Focus and Market Narratives in a seven-to-five twelve-column relationship, and at narrow widths or 200% zoom it SHALL stack them without page-level horizontal overflow. Its loading fallback SHALL mirror the successful Current Workspace, Trading Snapshot, Event Timeline, eligible Latest News, Assets in Focus, and Market Narratives footprints.

#### Scenario: Implementation is reviewed

- **WHEN** the overview implementation is reviewed
- **THEN** it uses existing components such as `Card`, `Item`, `Empty`, `Badge`, `Button`, and `Skeleton` where applicable
- **AND** it does not modify `components/ui/*` to solve overview-specific layout concerns
- **AND** it uses `gap-*` spacing and semantic tokens rather than custom primitive chrome overrides

#### Scenario: Bottom row renders on desktop

- **WHEN** the overview is viewed at a large desktop width
- **THEN** Assets in Focus occupies seven columns and Market Narratives occupies five columns of the shared twelve-column row
- **AND** the grid-span ownership remains in the route composition rather than feature-specific Card chrome

#### Scenario: Bottom row reflows at narrow width or zoom

- **WHEN** the overview is viewed at mobile or tablet width or 200% zoom
- **THEN** Assets in Focus and Market Narratives stack into readable sections
- **AND** the page does not require horizontal scrolling to read or operate either section

#### Scenario: Overview is loading

- **WHEN** the route is suspended while production data loads
- **THEN** the fallback renders Current Workspace, Trading Snapshot, Event Timeline, Assets in Focus, and Market Narratives skeleton footprints
- **AND** it includes a Latest News skeleton footprint when that module is eligible to render
- **AND** the bottom-row skeletons preserve the final seven-to-five desktop relationship and stacked responsive content regions
