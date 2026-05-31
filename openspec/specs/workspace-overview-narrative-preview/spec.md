# workspace-overview-narrative-preview Specification

## Purpose
TBD - created by archiving change add-overview-narrative-preview. Update Purpose after archive.
## Requirements
### Requirement: Overview loads narratives from backend
The root overview SHALL load its narrative preview from `GET /narratives` when the user has narrative read permission.

#### Scenario: Narrative preview is requested
- **WHEN** an authenticated user with `narrative:read` opens the root overview
- **THEN** the frontend requests narrative summaries from `GET /narratives`
- **AND** the request is limited to an overview-sized page of results
- **AND** the frontend renders the narratives returned by the backend

#### Scenario: Backend relevance is authoritative
- **WHEN** the narrative API returns a page of narratives for the overview request
- **THEN** the frontend MUST NOT client-filter the returned narratives by workspace, watchlist assets, primary asset, theme, or graph relationships
- **AND** relevance, filtering, and ranking are treated as backend-owned behavior

### Requirement: Overview renders a compact narrative preview
The root overview SHALL present narratives as a compact read-only section below the workspace and tracked-asset overview surface.

#### Scenario: Narratives are available
- **WHEN** the narrative API returns one or more summaries
- **THEN** the overview shows a separate `Luận điểm nổi bật` section after the workspace and tracked-asset overview panel
- **AND** the section displays no more than three narratives
- **AND** each visible narrative prioritizes title, thesis or summary, status, confidence, primary asset symbol or name, and updated time when those fields are available

#### Scenario: Narrative module routes are absent
- **WHEN** the overview renders narrative preview rows
- **THEN** the rows do not expose create, update, archive, refresh, or detail navigation controls unless those narrative workflows already exist in the frontend

### Requirement: Narrative preview handles permission and data states
The narrative preview SHALL handle permission, empty, and error states without blocking the rest of the overview.

#### Scenario: User lacks narrative read permission
- **WHEN** the current user does not have `narrative:read`
- **THEN** the overview does not render the narrative preview section
- **AND** it does not show an access-denied message for narratives on the root overview

#### Scenario: No narratives are returned
- **WHEN** the user has `narrative:read` and `GET /narratives` returns an empty page
- **THEN** the overview shows a compact localized empty state inside the narrative section
- **AND** the workspace identity and tracked-asset preview remain visible

#### Scenario: Narrative loading fails
- **WHEN** the user has `narrative:read` and the narrative request fails
- **THEN** the overview shows a compact localized non-blocking error state inside the narrative section
- **AND** the workspace identity and tracked-asset preview remain visible

### Requirement: Narrative preview follows overview composition policy
The narrative preview SHALL follow Signapse overview composition and UI policy.

#### Scenario: Implementation is reviewed
- **WHEN** the narrative preview implementation is reviewed
- **THEN** it uses existing shadcn wrappers and semantic tokens
- **AND** it does not add nested cards inside the narrative section
- **AND** it uses `gap-*` spacing rather than `space-y-*`
- **AND** user-facing copy is localized through the existing dictionary system

