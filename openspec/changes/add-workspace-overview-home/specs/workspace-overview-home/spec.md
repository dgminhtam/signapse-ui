## ADDED Requirements

### Requirement: Authenticated home page presents workspace overview
The system SHALL render the protected home page `/` as a workspace overview for authenticated users who can read workspaces.

#### Scenario: Current workspace is available
- **WHEN** an authenticated user with workspace read permission opens `/` and the backend returns a current workspace
- **THEN** the page displays "Tổng quan không gian làm việc" with the current workspace name, current status, concise description, and primary workspace actions

#### Scenario: No workspace is available
- **WHEN** an authenticated user with workspace read permission opens `/` and no workspace is available
- **THEN** the page displays a professional empty state explaining that a workspace is needed before workspace-scoped features can be used

#### Scenario: Workspace read permission is unavailable
- **WHEN** an authenticated user without workspace read permission opens `/`
- **THEN** the page displays a permission-aware blocked state instead of an empty dashboard or broken workspace controls

### Requirement: Workspace overview uses current workspace semantics
The system SHALL use backend current-workspace semantics for workspace selection, resolution, and user-facing copy.

#### Scenario: Current workspace is resolved
- **WHEN** workspace data is loaded from `/me/workspaces`
- **THEN** the active workspace is resolved from the `currentWorkspace` field and not from legacy `defaultWorkspace`

#### Scenario: User switches workspace
- **WHEN** a user selects another workspace through a workspace switch control
- **THEN** the frontend calls `/me/workspaces/{id}/set-current` and refreshes workspace-scoped UI after a successful response

#### Scenario: User-facing workspace copy is rendered
- **WHEN** the workspace overview or workspace switcher is visible
- **THEN** visible labels use current-workspace language such as "Đang hoạt động" and do not expose legacy "default" wording

### Requirement: Workspace overview summarizes tracked assets
The system SHALL summarize the active workspace's tracked assets on the home page when the user has the required watchlist and asset permissions.

#### Scenario: Tracked assets exist
- **WHEN** an authenticated user with asset and watchlist read permissions opens `/` and the active workspace has tracked assets
- **THEN** the overview displays the tracked-asset count and a compact preview of representative asset symbols or names

#### Scenario: No tracked assets exist
- **WHEN** an authenticated user with asset and watchlist read permissions opens `/` and the active workspace has no tracked assets
- **THEN** the overview displays an empty state that explains the workspace is not tracking assets yet

#### Scenario: User can manage tracked assets
- **WHEN** the user has the active workspace plus asset read, watchlist read, watchlist create, and watchlist delete permissions
- **THEN** the overview exposes an action that opens the existing workspace tracked-asset editor

#### Scenario: User cannot manage tracked assets
- **WHEN** the user can view the workspace overview but lacks the permissions needed to edit tracked assets
- **THEN** the overview does not show an enabled edit action for tracked assets

### Requirement: Workspace overview keeps a professional UI hierarchy
The system SHALL keep the workspace overview concise, Vietnamese, and aligned with the repository's page layout rules.

#### Scenario: Overview layout is rendered
- **WHEN** `/` is rendered
- **THEN** the page uses a Card shell with CardHeader, CardTitle, CardDescription, Separator, and content sections that prioritize workspace name, status, tracked assets, and primary actions before technical metadata

#### Scenario: Technical metadata is shown
- **WHEN** workspace technical fields such as `id`, `slug`, `createdDate`, or `lastModifiedDate` are displayed
- **THEN** they appear in a lower-priority detail area rather than the primary hero content

#### Scenario: Loading state is rendered
- **WHEN** the workspace overview is loading
- **THEN** the skeleton follows the final overview layout closely enough to avoid large layout shifts

#### Scenario: Vietnamese copy is rendered
- **WHEN** any workspace overview label, description, button, empty state, or toast is visible
- **THEN** the text is professional Vietnamese, does not mix unnecessary English, and contains no mojibake
