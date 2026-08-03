## MODIFIED Requirements

### Requirement: Overview prioritizes workspace orientation and tracked-asset readiness
The root workspace overview SHALL render its successful state as a single Current Workspace surface focused on the active workspace identity and the readiness of its tracked-asset list.

#### Scenario: Successful overview renders
- **WHEN** an authenticated user opens the root overview with a readable workspace
- **THEN** the page renders one Current Workspace content surface
- **AND** the surface identifies the active workspace by name
- **AND** the surface presents tracked-asset readiness as its primary content region
- **AND** the page does not render narrative previews or unrelated dashboard modules

#### Scenario: Current Workspace surface uses the accepted hierarchy
- **WHEN** the successful overview renders
- **THEN** it uses the accepted dashboard prototype Card header, action, metadata, count, and responsive Item list hierarchy
- **AND** it populates that hierarchy with live workspace and tracked-asset data
- **AND** it does not import prototype mock data or scenario controls

#### Scenario: Overview is scanned quickly
- **WHEN** a user scans the overview
- **THEN** they can tell which workspace is active and whether tracked assets are configured without reading repeated explanatory copy

### Requirement: Overview composition follows Signapse UI policy
The simplified overview SHALL use existing shadcn wrappers and Signapse layout conventions, and its loading fallback SHALL mirror the single successful Current Workspace surface.

#### Scenario: Implementation is reviewed
- **WHEN** the overview implementation is reviewed
- **THEN** it uses existing components such as `Card`, `Item`, `Empty`, `Badge`, `Button`, and `Skeleton` where applicable
- **AND** it does not modify `components/ui/*` to solve overview-specific layout concerns
- **AND** it uses `gap-*` spacing and semantic tokens rather than custom primitive chrome overrides

#### Scenario: Overview is loading
- **WHEN** the route is suspended while production data loads
- **THEN** the fallback renders one Current Workspace skeleton
- **AND** the skeleton preserves the final card's header, action, metadata, and responsive tracked-asset footprint
