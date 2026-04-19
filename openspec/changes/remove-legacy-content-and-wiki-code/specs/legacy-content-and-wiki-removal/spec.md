## ADDED Requirements

### Requirement: Frontend MUST expose only the canonical content domains
The system SHALL expose `source-documents` and `sources` as the only supported content-management domains in the frontend, and MUST stop exposing dedicated `articles`, `economic-calendar`, or `wiki` application surfaces.

#### Scenario: Content navigation shows only supported domains
- **WHEN** a user opens the main navigation for content management
- **THEN** the frontend MUST not show dedicated navigation entries for `articles`, `economic-calendar`, or `wiki`

#### Scenario: Legacy content routes are no longer supported surfaces
- **WHEN** a user or developer inspects the protected route tree
- **THEN** the frontend MUST not contain dedicated route implementations for `/articles`, `/economic-calendar`, or `/wiki`

### Requirement: Source-document management MUST operate without wiki integration
The system SHALL keep `source-documents` usable as a standalone content-management surface and MUST remove wiki-specific actions, redirects, and UI affordances from its list and detail experiences.

#### Scenario: Source-document list has no wiki actions
- **WHEN** a user views the source-document list
- **THEN** the action row for each source document MUST not show any wiki ingest action or wiki redirect control

#### Scenario: Source-document detail has no wiki actions
- **WHEN** a user views a source-document detail page
- **THEN** the header actions MUST not include any wiki ingest or wiki navigation affordance

### Requirement: Frontend codebase MUST not retain dead modules for removed domains
The system SHALL remove dedicated frontend actions, definitions, and feature components that only serve the removed `articles`, `economic-calendar`, or `wiki` domains.

#### Scenario: Legacy API helpers are removed
- **WHEN** a developer reviews the frontend server-action layer
- **THEN** there MUST be no dedicated `app/api` modules for `articles`, `economic-calendar`, or `wiki`

#### Scenario: Legacy type modules are removed
- **WHEN** a developer reviews the frontend definition layer
- **THEN** there MUST be no dedicated `app/lib` definition modules for `articles`, `economic-calendar`, or `wiki`

### Requirement: Documentation MUST align with the post-cleanup frontend surface
The system SHALL update active frontend-facing documentation so removed domains are no longer described as supported application features.

#### Scenario: API mapping reflects current frontend scope
- **WHEN** a developer reads `docs/APIMAPPING.md`
- **THEN** the document MUST not describe `articles`, `economic-calendar`, or `wiki` as active frontend integration surfaces

#### Scenario: Cleanup change leaves a single canonical mental model
- **WHEN** a developer reviews active content-management change artifacts after this cleanup
- **THEN** the remaining implementation plan MUST treat `source-documents` as the canonical content domain and MUST not depend on reviving wiki or legacy content routes
