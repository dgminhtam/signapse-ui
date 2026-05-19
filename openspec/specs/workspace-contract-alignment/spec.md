# workspace-contract-alignment Specification

## Purpose
TBD - created by archiving change align-workspace-api-contract. Update Purpose after archive.
## Requirements
### Requirement: Workspace DTOs match the backend snapshot
The frontend SHALL model workspace create, update, list, detail, and current-workspace contracts according to `docs/api_mapping.json`, without declaring or consuming a workspace `slug` field.

#### Scenario: Workspace create payload excludes slug
- **WHEN** a user creates a workspace
- **THEN** the submitted payload MUST include the supported workspace `name` field and MUST NOT include `slug`

#### Scenario: Workspace update payload excludes slug
- **WHEN** a user renames a workspace
- **THEN** the submitted payload MUST include the supported workspace `name` field and MUST NOT include `slug`

#### Scenario: Workspace responses exclude slug
- **WHEN** frontend code consumes `WorkspaceResponse` or `WorkspaceSummaryResponse`
- **THEN** the TypeScript definitions MUST NOT expose a workspace `slug` field

### Requirement: Workspace shell layout excludes obsolete slug metadata
The workspace switcher and workspace overview SHALL present backend-supported workspace information without rendering obsolete slug fields, controls, or placeholder values.

#### Scenario: Workspace switcher renders available workspaces
- **WHEN** the workspace menu lists available workspaces
- **THEN** each item MUST show supported user-facing workspace context such as the workspace name and current-state indicator without reading `workspace.slug`

#### Scenario: User creates a workspace
- **WHEN** the create workspace dialog renders
- **THEN** the dialog MUST ask only for supported workspace fields and MUST NOT show a slug input or slug helper copy

#### Scenario: User renames a workspace
- **WHEN** the rename workspace dialog renders
- **THEN** the dialog MUST let the user edit the workspace name and MUST NOT show a slug input or slug helper copy

#### Scenario: Workspace overview renders current workspace facts
- **WHEN** the workspace overview page renders the active workspace
- **THEN** the overview and technical details MUST omit slug metrics and MUST continue to show supported facts such as name, active state, ID, created date, and last modified date where useful

### Requirement: User response definitions match current workspace summary
The frontend SHALL type the `/me` response using backend-supported fields, including `currentWorkspace` and media-object `mainImage`.

#### Scenario: Current user permissions are loaded
- **WHEN** server code loads the current user for permissions
- **THEN** the response type MUST expose `permissions[]` and MUST NOT require a legacy `workspace` field

#### Scenario: Current workspace summary is consumed
- **WHEN** frontend code consumes the current workspace summary from `/me`
- **THEN** it MUST read `currentWorkspace` with the backend-supported workspace summary shape and MUST NOT read `workspace.slug`

### Requirement: API mapping documents workspace contract alignment
`docs/APIMAPPING.md` SHALL describe the workspace and user contract implementation state without contradicting the current backend snapshot or remaining frontend drift.

#### Scenario: Workspace drift is resolved
- **WHEN** workspace DTOs, actions, switcher UI, and overview layout no longer use `slug`
- **THEN** `docs/APIMAPPING.md` MUST no longer state that workspace frontend code still sends, reads, or displays workspace `slug`

#### Scenario: User response drift is resolved
- **WHEN** `/me` frontend definitions use `currentWorkspace` and media-object `mainImage`
- **THEN** `docs/APIMAPPING.md` MUST no longer state that the user response type still maps the legacy `workspace` or string `mainImage` contract

