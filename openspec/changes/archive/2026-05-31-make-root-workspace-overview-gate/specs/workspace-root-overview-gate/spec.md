## ADDED Requirements

### Requirement: Root route is the protected workspace overview
The protected app root route SHALL present the current workspace overview as the canonical landing destination after locale normalization.

#### Scenario: User opens protected app root
- **WHEN** an authenticated user opens `/` through a locale-normalized route such as `/vi` or `/en`
- **THEN** the app displays the workspace overview surface for the resolved workspace context
- **AND** the route remains the canonical root route rather than navigating to a separate overview URL

#### Scenario: Current workspace is resolved
- **WHEN** the user has workspace read permission and at least one readable workspace exists
- **THEN** the overview displays the active workspace when one is marked current
- **AND** it may fall back to the first readable workspace when no current marker is available

### Requirement: Root route gates missing workspace context
The protected app root route SHALL be the safe workspace-context gate for users who cannot yet operate workspace-dependent screens.

#### Scenario: Workspace permission is missing
- **WHEN** an authenticated user opens the root overview without workspace read permission
- **THEN** the page displays an access-limited state explaining that workspace read permission is required
- **AND** the page does not attempt to render normal workspace data

#### Scenario: Workspace data cannot be loaded
- **WHEN** the app cannot load the user's readable workspaces
- **THEN** the root overview displays a workspace load error state
- **AND** it does not render stale or placeholder workspace facts as if a workspace were active

#### Scenario: No readable workspace exists
- **WHEN** the user has workspace read permission but no readable workspace can be resolved
- **THEN** the root overview displays a no-active-workspace state
- **AND** the state guides the user toward creating or selecting a workspace according to available permissions

### Requirement: Workspace-dependent screens respect the root gate
Protected app screens that depend on workspace context SHALL NOT operate as normal workspaces when no readable workspace can be resolved.

#### Scenario: Workspace-dependent screen lacks workspace context
- **WHEN** a user opens a protected feature screen that needs an active workspace and no readable workspace can be resolved
- **THEN** the screen blocks the workspace-dependent workflow with an access, empty, or redirect-to-overview treatment
- **AND** it does not submit workspace-scoped mutations or fetch workspace-scoped data using an undefined workspace context

#### Scenario: Workspace context is available
- **WHEN** a user opens a protected feature screen and a readable workspace can be resolved
- **THEN** the screen may load and operate using that workspace context according to its existing feature permissions
