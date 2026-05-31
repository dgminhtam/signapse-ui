## ADDED Requirements

### Requirement: System prompt data contract matches the backend schema
The system SHALL model system prompts using the current backend `system-prompts` contract, including prompt type enum values, localized display names, and response schema payloads.

#### Scenario: Load system prompt list with schema metadata
- **WHEN** a user with `system-prompt:read` opens the system prompt list
- **THEN** the frontend MUST fetch `GET /system-prompts` with authenticated fetch and accept items containing `promptType`, `name`, `localizedNames`, `content`, `responseSchema`, `createdDate`, and `lastModifiedDate`

#### Scenario: Load system prompt detail with schema metadata
- **WHEN** a user with `system-prompt:update` opens a valid system prompt detail route
- **THEN** the frontend MUST fetch `GET /system-prompts/{promptType}` with the URL-encoded prompt type and load `content`, `localizedNames`, and `responseSchema` into the edit form

#### Scenario: Create system prompt with required response schema
- **WHEN** a user submits the create form with valid prompt content and a valid response schema
- **THEN** the frontend MUST call `POST /system-prompts` with `promptType`, trimmed `content`, parsed `responseSchema`, and any edited `localizedNames`

#### Scenario: Update system prompt with response schema
- **WHEN** a user submits the edit form with valid prompt content and a valid response schema
- **THEN** the frontend MUST call `PUT /system-prompts/{promptType}` with trimmed `content`, parsed `responseSchema`, and any edited `localizedNames`

#### Scenario: Prompt type options reflect backend enum
- **WHEN** the create form renders prompt type options
- **THEN** the frontend MUST offer only prompt types from the current backend enum and MUST NOT default to a removed legacy prompt type

### Requirement: System prompt surfaces prioritize localized prompt identity
The system SHALL present backend-provided localized names as the primary user-facing identity while preserving the raw prompt type as technical metadata.

#### Scenario: Display localized prompt name
- **WHEN** a prompt has a `localizedNames` value for the current app language
- **THEN** the list and edit surfaces MUST display that localized name as the primary prompt label

#### Scenario: Fallback prompt label
- **WHEN** a prompt does not have a localized name for the current app language
- **THEN** the system MUST fall back to backend `name`, then the dictionary label for `promptType`, then the raw `promptType`

#### Scenario: Preserve technical identifier
- **WHEN** a prompt is shown in list or edit context
- **THEN** the raw `promptType` MUST remain available as low-priority technical metadata

### Requirement: Create and edit forms include prompt content and response schema
The system SHALL provide a focused system prompt form where prompt content and response schema are both required editing concerns.

#### Scenario: Open create form
- **WHEN** a user with `system-prompt:create` opens the create route
- **THEN** the form MUST show prompt type selection, localized name inputs, prompt content input, and a response schema editor initialized with a valid minimal object schema

#### Scenario: Open edit form
- **WHEN** a user with `system-prompt:update` opens an existing prompt
- **THEN** the form MUST show the prompt type as read-only, load localized names, load prompt content, and load the persisted response schema

#### Scenario: Cancel edit changes
- **WHEN** a user clicks cancel while editing an existing prompt
- **THEN** the form MUST reset prompt content, localized names, and response schema to the initial loaded values

#### Scenario: Successful submit
- **WHEN** create or update succeeds
- **THEN** the system MUST show a localized success toast, navigate to the localized `/system-prompts` list route, and refresh the route

### Requirement: Response schema editor supports structured and raw JSON modes
The system SHALL provide a response schema editor with both a structured builder mode and a raw JSON mode.

#### Scenario: Switch schema editor modes
- **WHEN** a user switches between builder and JSON modes
- **THEN** both modes MUST represent the same parsed `responseSchema` value without losing valid schema data

#### Scenario: Edit supported object schema
- **WHEN** a user edits an object schema in builder mode
- **THEN** the builder MUST support properties, required field toggles, and `additionalProperties`

#### Scenario: Edit supported array schema
- **WHEN** a user edits an array schema in builder mode
- **THEN** the builder MUST support editing the schema for `items`

#### Scenario: Edit supported primitive constraints
- **WHEN** a user edits a string, number, or boolean field in builder mode
- **THEN** the builder MUST support string enum values, number `minimum` and `maximum`, and boolean type selection

#### Scenario: Edit map-like schema
- **WHEN** a schema uses `additionalProperties` with a nested schema value
- **THEN** the builder MUST allow editing that value as a map item schema

#### Scenario: Raw JSON mode parses schema
- **WHEN** a user enters valid JSON in raw JSON mode and applies it
- **THEN** the parsed value MUST become the canonical `responseSchema` used by the builder and submit payload

### Requirement: Schema validation prevents unsafe submit behavior
The system SHALL block malformed schema payloads and avoid silently discarding unsupported schema content.

#### Scenario: Malformed JSON blocks submit
- **WHEN** the raw JSON editor contains malformed JSON
- **THEN** the form MUST show a field-level validation error and MUST NOT submit the mutation request

#### Scenario: Unsupported schema remains editable
- **WHEN** the current schema contains JSON Schema keywords outside the supported builder subset
- **THEN** the system MUST preserve the parsed schema and direct the user to raw JSON mode instead of dropping unsupported keywords

#### Scenario: Empty schema is not submitted
- **WHEN** a user attempts to submit without a parsed response schema
- **THEN** the form MUST show a validation error and MUST NOT call create or update

### Requirement: API mapping ledger documents system prompt contract drift
The system SHALL keep the system prompt API mapping notes aligned with the current backend snapshot used by the frontend implementation.

#### Scenario: Document current system prompt enum
- **WHEN** `docs/APIMAPPING.md` documents system prompt prompt type values
- **THEN** it MUST list the current enum values from `docs/api_mapping.json` and MUST NOT state that removed legacy values are still present

#### Scenario: Document response schema integration status
- **WHEN** `docs/APIMAPPING.md` documents the `system-prompts` endpoints
- **THEN** it MUST describe `name`, `localizedNames`, and `responseSchema` support and the frontend files that own the integration
