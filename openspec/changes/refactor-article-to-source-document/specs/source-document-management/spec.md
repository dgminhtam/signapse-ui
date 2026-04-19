## ADDED Requirements

### Requirement: Canonical content management uses source documents
The system SHALL present backend-ingested content through a canonical source-document management surface instead of relying on removed `articles` endpoints.

#### Scenario: Load source-document list
- **WHEN** an authorized user opens the canonical source-document management screen
- **THEN** the system loads source documents from the backend source-document list endpoint and displays them using the repo's URL-driven paging, sorting, and filtering conventions

#### Scenario: Filter by document type
- **WHEN** an authorized user filters source documents by document type
- **THEN** the system shows only source documents matching the selected type without switching to a separate backend domain

### Requirement: Users can inspect source-document details with type-aware metadata
The system SHALL let authorized users open a source-document detail view that presents shared content fields and any document-type-specific metadata exposed by the backend.

#### Scenario: News-like source document detail
- **WHEN** a user opens a source document whose type represents article-style content
- **THEN** the detail screen shows the title, description, source, publication time, content, and feature image when available

#### Scenario: Economic-calendar source document detail
- **WHEN** a user opens a source document whose type is `ECONOMIC_CALENDAR`
- **THEN** the detail screen shows the shared content fields and the available economic fields such as scheduled time, importance, previous value, forecast value, and actual value

### Requirement: Authorized users can run source-document lifecycle actions
The system SHALL let authorized users perform the supported content-management actions that remain available on source documents.

#### Scenario: Analyze source document
- **WHEN** an authorized user triggers analysis for a source document
- **THEN** the system calls the backend source-document analyze endpoint, shows pending feedback, and refreshes the UI after the action completes

#### Scenario: Delete source document
- **WHEN** an authorized user confirms deletion of a source document
- **THEN** the system calls the backend delete endpoint, shows destructive confirmation before submission, and refreshes the list after successful deletion

### Requirement: Legacy content routes no longer behave as primary domains
The system MUST NOT keep `/articles` and `/economic-calendar` as independent primary frontend domains after the source-document migration is complete.

#### Scenario: Legacy article entry point
- **WHEN** a user navigates to a legacy article management route
- **THEN** the system redirects or hands off the user to the canonical source-document management flow

#### Scenario: Legacy economic calendar entry point
- **WHEN** a user navigates to a legacy economic calendar route
- **THEN** the system redirects or hands off the user to a source-document flow that preserves the user's intent through document-type-aware presentation
