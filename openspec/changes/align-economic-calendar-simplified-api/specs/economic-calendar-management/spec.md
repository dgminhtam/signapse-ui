## ADDED Requirements

### Requirement: Economic calendar data contract alignment
The system SHALL align economic calendar frontend types and data access with the simplified backend schema in `docs/api_mapping.json`.

#### Scenario: Frontend receives list entries
- **WHEN** `GET /economic-calendar` returns economic calendar entries
- **THEN** the frontend MUST model and consume the supported list fields `id`, `title`, `currencyCode`, `impact`, `forecastValue`, `previousValue`, `actualValue`, `contentAvailable`, `status`, `scheduledAt`, `syncedAt`, `createdDate`, and `lastModifiedDate`

#### Scenario: Frontend receives detail entry
- **WHEN** `GET /economic-calendar/{id}` returns an economic calendar entry
- **THEN** the frontend MUST model and consume the supported detail fields `id`, `title`, `currencyCode`, `impact`, `forecastValue`, `previousValue`, `actualValue`, `content`, `contentAvailable`, `status`, `scheduledAt`, `syncedAt`, `createdDate`, and `lastModifiedDate`

#### Scenario: Removed fields are not consumed
- **WHEN** economic calendar UI renders list or detail data
- **THEN** the frontend MUST NOT rely on removed fields such as `description`, `url`, `externalKey`, `provider`, `countryCode`, `importance`, `ingestedAt`, `rawContent`, or `rawMetadata`

### Requirement: Economic calendar simplified list
The system SHALL render the economic calendar list using only fields available in the simplified backend contract.

#### Scenario: Authorized user views list
- **WHEN** a user with economic calendar read permission opens `/economic-calendar`
- **THEN** the system MUST render a Card-based list page with columns for event, currency, impact, status, scheduled time, values, and actions

#### Scenario: List item has content status
- **WHEN** a list entry includes `status` and `contentAvailable`
- **THEN** the system MUST show a clear Vietnamese status indicator that distinguishes pending content from available content

#### Scenario: List item has missing optional values
- **WHEN** optional values such as `currencyCode`, `impact`, `actualValue`, `forecastValue`, `previousValue`, `scheduledAt`, or `syncedAt` are missing
- **THEN** the system MUST render a professional Vietnamese fallback instead of blank or broken UI

### Requirement: Economic calendar search and sort use current fields
The system SHALL keep economic calendar search and sort URL-backed while avoiding fields removed from the backend contract.

#### Scenario: User searches entries
- **WHEN** the user types in the economic calendar search input
- **THEN** the system MUST debounce input by 300ms, trim the query, reset `page` to `1`, and write a filter using only current backend fields

#### Scenario: Search avoids removed fields
- **WHEN** the search filter is built
- **THEN** the system MUST NOT include removed fields such as `description` or `countryCode`

#### Scenario: User changes sort
- **WHEN** the user selects a sort option
- **THEN** the system MUST update the URL sort parameter using supported fields such as `scheduledAt`, `syncedAt`, or `createdDate`

#### Scenario: Sort avoids removed fields
- **WHEN** sort options are rendered
- **THEN** the system MUST NOT offer sort values based on removed fields such as `importance`

### Requirement: Economic calendar content-centered detail
The system SHALL render economic calendar detail as a simplified, content-centered read-only page.

#### Scenario: Authorized user views detail
- **WHEN** a user with economic calendar read permission opens `/economic-calendar/{id}`
- **THEN** the system MUST render title, currency, impact, status, scheduled time, actual value, forecast value, previous value, synced time, and content when available

#### Scenario: Detail content is available
- **WHEN** `contentAvailable` is true and `content` has text
- **THEN** the system MUST render the content in the primary reading path

#### Scenario: Detail content is not available
- **WHEN** `contentAvailable` is false or `content` is empty
- **THEN** the system MUST render a clear Vietnamese empty/info state explaining that detailed content is not available yet

#### Scenario: Technical information is minimized
- **WHEN** detail technical metadata is rendered
- **THEN** the system MUST limit the technical section to fields still present in the simplified contract, such as `id`, `createdDate`, and `lastModifiedDate`

### Requirement: Economic calendar copy and documentation
The system SHALL keep economic calendar UI copy and API mapping documentation aligned with the simplified contract.

#### Scenario: Economic calendar UI renders user-facing text
- **WHEN** list, search, detail, empty, loading, access denied, sync, toast, or error states render
- **THEN** all user-facing text MUST be professional Vietnamese with proper diacritics and no mojibake

#### Scenario: API mapping is updated
- **WHEN** the frontend is aligned with the simplified economic calendar contract
- **THEN** `docs/APIMAPPING.md` MUST document the new economic calendar fields and remove notes that describe removed fields as active frontend dependencies
