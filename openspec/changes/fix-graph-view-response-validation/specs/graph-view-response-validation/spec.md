## ADDED Requirements

### Requirement: Frontend MUST accept nullable optional node metadata from graph-view
The system SHALL treat optional node metadata fields in `GET /graph-view` as compatible when the backend returns either an omitted value or an explicit `null`, provided the rest of the graph payload remains structurally valid.

#### Scenario: Event metadata with null optional fields still validates
- **WHEN** a graph-view response contains an `event` node whose optional metadata fields such as `assetType`, `sourceName`, `symbol`, or `url` are `null`
- **THEN** the frontend MUST accept the response and continue rendering the graph page

#### Scenario: Non-event nodes with null optional fields still validate
- **WHEN** a graph-view response contains `asset`, `theme`, or `source-document` nodes whose optional metadata fields are explicitly `null`
- **THEN** the frontend MUST accept the response without treating those `null` values as a contract failure

### Requirement: Graph-view browse UI MUST degrade gracefully when metadata is null
The graph-view browse surface SHALL continue to render node details from the original payload even when some optional metadata fields are absent or `null`.

#### Scenario: Null metadata fields are omitted from node detail presentation
- **WHEN** a selected node has optional metadata fields with `null` values
- **THEN** the detail panel MUST continue to render the node label, node kind, and any remaining available metadata without crashing or showing broken actions

#### Scenario: Missing source URL does not expose an invalid outbound link
- **WHEN** a selected node has no usable metadata URL because the field is absent or `null`
- **THEN** the graph-view panel MUST omit the outbound source-link action for that node

### Requirement: Graph-view validation MUST remain strict for true structural mismatches
The frontend SHALL keep runtime validation for the graph-view payload so unsupported node kinds, malformed identifiers, or incompatible structural fields still fail fast instead of being silently accepted.

#### Scenario: Unsupported structural values still fail validation
- **WHEN** `GET /graph-view` returns a payload with an invalid required field such as an unsupported node kind or malformed required identifier
- **THEN** the frontend MUST reject the response instead of rendering the graph with unchecked data

#### Scenario: Validation failures remain diagnosable
- **WHEN** graph-view response validation fails for a true structural mismatch
- **THEN** the frontend MUST emit bounded diagnostic details that identify the mismatched paths clearly enough for developers to investigate the contract drift
