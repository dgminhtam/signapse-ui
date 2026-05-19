# news-outlet-contract-alignment Specification

## Purpose
TBD - created by archiving change align-news-outlet-slug-contract. Update Purpose after archive.
## Requirements
### Requirement: News outlet DTOs match the backend snapshot
The frontend SHALL model news outlet create, update, detail, and list contracts according to `docs/api_mapping.json`, without declaring or consuming a `slug` field.

#### Scenario: News outlet request payload excludes slug
- **WHEN** a user creates or updates a news outlet
- **THEN** the submitted payload MUST include only supported news outlet request fields and MUST NOT include `slug`

#### Scenario: News outlet responses exclude slug
- **WHEN** frontend code consumes news outlet list or detail responses
- **THEN** the TypeScript response definitions MUST NOT expose `slug`

### Requirement: News outlet form excludes obsolete slug controls
The create/edit news outlet form SHALL remove editable and read-only `slug` UI because the backend no longer exposes this field.

#### Scenario: User edits a news outlet
- **WHEN** the edit form renders for an existing news outlet
- **THEN** the form MUST show supported fields such as name, description, homepage URL, RSS URL, active state, and useful timestamps without showing slug metadata or controls

#### Scenario: User creates a news outlet
- **WHEN** the create form renders
- **THEN** the form MUST NOT ask the user to enter or leave blank a slug

### Requirement: API mapping documents remaining implementation state accurately
`docs/APIMAPPING.md` SHALL describe the news outlet contract and frontend implementation status without contradicting the current backend snapshot or known frontend drift.

#### Scenario: Detail and update rows are reviewed
- **WHEN** a developer scans the `news-outlets` endpoint table
- **THEN** the `GET /news-outlets/{id}` and `PUT /news-outlets/{id}` rows MUST accurately state whether frontend DTO/form code is still drifting from the removed `slug` contract

#### Scenario: Drift is resolved
- **WHEN** frontend DTOs and form payloads no longer use `slug`
- **THEN** `docs/APIMAPPING.md` MUST no longer claim that news outlet form/DTO code still renders or sends optional `slug`

