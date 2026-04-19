## ADDED Requirements

### Requirement: Source forms cover the backend source configuration schema
The system SHALL let authorized users create and update sources using the backend source fields that control source type, provider identity, crawl behavior, and activation state.

#### Scenario: Create source with extended configuration
- **WHEN** an authorized user creates a source
- **THEN** the form captures the required basic fields and supports the backend source configuration fields for type, provider metadata, crawl timing, exclusion tags, default fetch limit, raw configuration, and active state

#### Scenario: Edit source with persisted configuration
- **WHEN** an authorized user opens an existing source for editing
- **THEN** the form loads the persisted backend values for the supported source configuration fields and allows the user to submit updates

### Requirement: Source management surfaces display ingest and source-type metadata
The system SHALL present the source metadata needed to understand how a source behaves in the source-document pipeline.

#### Scenario: Render source list metadata
- **WHEN** a user views the source list
- **THEN** the system shows the source type and other high-signal source metadata needed to distinguish different source configurations

#### Scenario: Render source detail metadata
- **WHEN** a user views or edits a source with ingest history
- **THEN** the system shows the latest ingest status, the latest ingest timestamp, and any backend-provided ingest error information when available

### Requirement: Advanced source configuration remains operable without provider-specific custom UI
The system SHALL support backend `configuration` data without requiring a provider-specific structured editor for every source type.

#### Scenario: Save raw configuration data
- **WHEN** an authorized user enters valid raw configuration data for a source
- **THEN** the system submits that configuration to the backend as part of the source create or update request
