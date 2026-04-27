## ADDED Requirements

### Requirement: Workspace selector appears in the application header

The system SHALL render the active workspace selector in the top application header near the breadcrumb instead of inside the sidebar header.

#### Scenario: Workspace read permission is available

- **WHEN** an authenticated user has workspace read permission and opens a protected route
- **THEN** the top header displays a workspace selector that shows the active workspace name or an empty state label

#### Scenario: Workspace read permission is unavailable

- **WHEN** an authenticated user does not have workspace read permission
- **THEN** the top header does not show a broken workspace selector or leave an obvious empty control gap

### Requirement: Sidebar header preserves Signapse brand identity

The system SHALL render a dedicated Signapse brand/logo treatment in the sidebar header that is visually distinct from workspace selection.

#### Scenario: Sidebar is expanded

- **WHEN** the sidebar is expanded
- **THEN** the sidebar header shows the Signapse logo and brand text without using the workspace name as the primary header content

#### Scenario: Sidebar is collapsed

- **WHEN** the sidebar is collapsed to icon mode
- **THEN** the sidebar header still shows a compact brand mark and does not render the workspace selector in the collapsed rail

### Requirement: Workspace selection uses one canonical component

The system SHALL use one canonical workspace selector implementation for workspace switching and workspace management entry points.

#### Scenario: Developer reviews workspace selector files

- **WHEN** a developer searches for workspace switcher implementations
- **THEN** there is only one active workspace selector component and no `WorkspaceSwitcherV2` usage remains

#### Scenario: Legacy duplicate is removed

- **WHEN** the canonical selector has replaced the old sidebar implementation
- **THEN** the duplicate legacy workspace switcher file or export is removed or converted into the canonical implementation, not kept as a second competing path

### Requirement: Workspace menu preserves existing actions

The system SHALL preserve existing workspace actions from the canonical menu according to current permissions.

#### Scenario: User can switch workspace

- **WHEN** a user can set the default workspace and selects a different workspace
- **THEN** the system calls the existing set-default workspace action, shows pending feedback, refreshes the UI, and keeps the selected workspace visible after completion

#### Scenario: User can create workspace

- **WHEN** a user has workspace create permission
- **THEN** the workspace menu exposes a create action with professional Vietnamese copy, pending feedback, and disabled duplicate submission while saving

#### Scenario: User can rename workspace

- **WHEN** a user has workspace update permission and the active workspace can be renamed
- **THEN** the workspace menu exposes a rename action with professional Vietnamese copy, pending feedback, and disabled duplicate submission while saving

#### Scenario: User can manage tracked assets

- **WHEN** a user has the required active workspace, asset, and watchlist permissions
- **THEN** the workspace menu exposes an action that opens the existing workspace tracked-asset editor

### Requirement: Workspace shell copy is readable Vietnamese

The system SHALL use readable, professional Vietnamese copy for all touched workspace selector, workspace dialogs, watchlist editor entry points, sidebar brand, and breadcrumb labels.

#### Scenario: Workspace surfaces are rendered

- **WHEN** a user opens the workspace selector, create dialog, rename dialog, or tracked-asset editor
- **THEN** visible labels, descriptions, buttons, empty states, and toast messages contain readable Vietnamese and no mojibake

### Requirement: Workspace header remains responsive

The system SHALL keep the header usable across desktop, collapsed-sidebar, and narrow viewport states.

#### Scenario: Desktop header

- **WHEN** the viewport has desktop width
- **THEN** the sidebar trigger and breadcrumb remain on the left while workspace selector and mode toggle remain discoverable without crowding the breadcrumb

#### Scenario: Narrow header

- **WHEN** the viewport is narrow
- **THEN** the workspace selector remains accessible in compact form or wraps safely without hiding the sidebar trigger or current page breadcrumb
