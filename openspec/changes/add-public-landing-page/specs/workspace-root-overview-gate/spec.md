## REMOVED Requirements

### Requirement: Root route is the protected workspace overview
**Reason**: The locale root is becoming the public Signapse landing page.
**Migration**: Move the protected workspace overview behavior to the localized dashboard route.

### Requirement: Root route gates missing workspace context
**Reason**: Workspace gating still matters, but it no longer belongs to the public locale root.
**Migration**: Apply the same missing-workspace access, load-error, and empty states at the localized dashboard route.

## ADDED Requirements

### Requirement: Dashboard route is the protected workspace overview
The protected dashboard route SHALL present the current workspace overview as the canonical authenticated app landing destination after locale normalization.

#### Scenario: User opens protected dashboard route
- **WHEN** an authenticated user opens `/vi/dashboard` or `/en/dashboard`
- **THEN** the app displays the workspace overview surface for the resolved workspace context
- **AND** the protected app route remains at the explicit dashboard path

#### Scenario: Current workspace is resolved
- **WHEN** the user has workspace read permission and at least one readable workspace exists
- **THEN** the overview displays the active workspace when one is marked current
- **AND** it may fall back to the first readable workspace when no current marker is available

### Requirement: Dashboard route gates missing workspace context
The protected dashboard route SHALL be the safe workspace-context gate for users who cannot yet operate workspace-dependent screens.

#### Scenario: Workspace permission is missing
- **WHEN** an authenticated user opens the dashboard overview without workspace read permission
- **THEN** the page displays an access-limited state explaining that workspace read permission is required
- **AND** the page does not attempt to render normal workspace data

#### Scenario: Workspace data cannot be loaded
- **WHEN** the app cannot load the user's readable workspaces
- **THEN** the dashboard overview displays a workspace load error state
- **AND** it does not render stale or placeholder workspace facts as if a workspace were active

#### Scenario: No readable workspace exists
- **WHEN** the user has workspace read permission but no readable workspace can be resolved
- **THEN** the dashboard overview displays a no-active-workspace state
- **AND** the state guides the user toward creating or selecting a workspace according to available permissions

