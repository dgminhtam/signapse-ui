## ADDED Requirements

### Requirement: Source-document surfaces SHALL expose event-derivation status
The system SHALL map backend event-derivation fields for source documents and surface the current derivation status in both list and detail views.

#### Scenario: List view shows derivation status for each source document
- **WHEN** an authorized user opens the source-document list
- **THEN** each row SHALL display the current event-derivation status returned by the backend alongside the other operational statuses

#### Scenario: Detail view shows derivation status metadata
- **WHEN** an authorized user opens a source-document detail page
- **THEN** the page SHALL show the current event-derivation status and the latest attempted time, completed time, and error information when those fields are present

### Requirement: Authorized users SHALL be able to derive the primary event for a news source document
The system SHALL provide a single-document action that triggers backend primary-event derivation for `NEWS` source documents and reports the backend outcome clearly.

#### Scenario: Derive primary event for a news document
- **WHEN** an authorized user triggers primary-event derivation for a `NEWS` source document
- **THEN** the system SHALL call the single-document derive endpoint, show pending feedback, refresh the affected source-document routes, and display a success or failure summary using the backend result

#### Scenario: Non-news documents do not expose the derive action
- **WHEN** an authorized user opens a source document whose `documentType` is not `NEWS`
- **THEN** the UI MUST NOT show a primary-event derive action for that document

### Requirement: Authorized users SHALL be able to derive pending news events in batch
The system SHALL provide a batch action from the source-document management surface to trigger backend derivation for pending news documents.

#### Scenario: Run pending-news derivation from the list toolbar
- **WHEN** an authorized user runs the batch derive action from the source-document list
- **THEN** the system SHALL call the pending-news derivation endpoint, disable the action while pending, refresh the source-document list, and show a summary of the returned batch counts

#### Scenario: Batch derive reports mixed outcomes
- **WHEN** the backend batch response includes created, updated, no-event, skipped, or failed results
- **THEN** the system SHALL summarize those outcomes in operator feedback without requiring the user to inspect raw JSON

### Requirement: Event-derivation feedback SHALL remain within the source-document operator workflow
The system SHALL present event-derivation feedback in the existing source-document UX rather than redirecting users to a separate event-management surface.

#### Scenario: Single-document derivation completes
- **WHEN** a single-document derivation request completes
- **THEN** the user SHALL remain in the current source-document list or detail workflow and see refreshed source-document data in place

#### Scenario: Batch derivation completes
- **WHEN** a batch derivation request completes from the list page
- **THEN** the user SHALL remain on the source-document list and receive feedback in that same management flow
