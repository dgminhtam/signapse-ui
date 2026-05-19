# ai-provider-per-credential-model-management Specification

## Purpose
TBD - created by archiving change align-ai-provider-per-credential-model-contract. Update Purpose after archive.
## Requirements
### Requirement: AI provider types match latest backend contract
The frontend SHALL model AI provider config data according to the latest backend contract, with config metadata separated from credential-owned model data.

#### Scenario: Config request is created
- **WHEN** the frontend builds `CreateAiProviderConfigRequest`
- **THEN** it SHALL include `providerType`, optional `description`, optional `baseUrl`, optional `defaultProvider`, and `credentials[]`, and SHALL NOT include config-level `name` or config-level `model`.

#### Scenario: Config metadata is updated
- **WHEN** the frontend builds `UpdateAiProviderConfigRequest`
- **THEN** it SHALL include only supported metadata fields and SHALL NOT send `name`, config-level `model`, or `apiKey`.

#### Scenario: Config response is read
- **WHEN** the frontend reads `AiProviderConfigResponse`
- **THEN** it SHALL read credential model data from `credentials[].model` and SHALL NOT require `name`, config-level `model`, credential `label`, or full `apiKey`.

### Requirement: Create flow validates and selects model per credential
The AI provider create flow SHALL require every initial credential row to validate its own API key through model catalog and select its own model before config submission.

#### Scenario: User adds a create credential row
- **WHEN** a user adds a credential row while creating an AI provider config
- **THEN** the row SHALL contain API key input, row-local model selection state, and a validate/select model action for that row.

#### Scenario: User validates a create credential row
- **WHEN** a user triggers model selection for a create credential row
- **THEN** the frontend SHALL call `POST /ai-provider-configs/model-catalog` with the current provider type, optional base URL, and that row's API key.

#### Scenario: Model catalog succeeds for a create credential row
- **WHEN** model catalog returns models for a create credential row
- **THEN** the frontend SHALL let the user select one returned model and store it on that credential row.

#### Scenario: User edits a validated create credential API key
- **WHEN** a user changes the API key for a credential row after selecting a model
- **THEN** the frontend SHALL clear that row's selected model and require validation again for that row.

#### Scenario: User submits create form
- **WHEN** a user submits the create form
- **THEN** every credential entry SHALL include trimmed `apiKey` and selected `model`, and the frontend SHALL block submission if any credential lacks either value.

### Requirement: Create flow has no config-level model
The AI provider create flow SHALL remove config-level model selection and SHALL NOT maintain a global selected model for the provider config.

#### Scenario: Create form renders
- **WHEN** the create form is displayed
- **THEN** it SHALL show provider metadata fields and credential rows, and SHALL NOT show a standalone config-level model field.

#### Scenario: Provider type or base URL changes
- **WHEN** provider type or base URL changes after credential rows selected models
- **THEN** the frontend SHALL invalidate credential row model selections that were validated against the previous provider catalog inputs.

### Requirement: Edit metadata excludes removed config fields
The AI provider edit metadata flow SHALL update only fields supported by `UpdateAiProviderConfigRequest`.

#### Scenario: Edit metadata form renders
- **WHEN** a user opens an AI provider config edit page
- **THEN** the metadata form SHALL show provider type, description, base URL, and default provider controls, and SHALL NOT show config-level name or model controls.

#### Scenario: User saves metadata
- **WHEN** a user saves AI provider metadata changes
- **THEN** the frontend SHALL call `PUT /ai-provider-configs/{id}` without `name`, config-level `model`, or `apiKey`.

### Requirement: Credential panel manages model-owned credentials
The credential panel SHALL display and mutate credential `model` data instead of credential `label` data.

#### Scenario: User views credentials
- **WHEN** a user views an AI provider config edit page
- **THEN** each credential row SHALL show `model`, key preview, last-used timestamp, rate-limit timestamp, created date, and last-modified date when present.

#### Scenario: User adds a credential
- **WHEN** a user adds a credential to an existing provider config
- **THEN** the frontend SHALL require API key validation through model catalog, require a selected model, and call `POST /ai-provider-configs/{id}/credentials` with `{ apiKey, model }`.

#### Scenario: User updates credential material
- **WHEN** a user updates an existing credential's API key or model
- **THEN** the frontend SHALL require a fresh API key validation and selected model before calling `PUT /ai-provider-configs/{id}/credentials/{credentialId}`.

#### Scenario: User deletes a credential
- **WHEN** a user chooses to delete a credential
- **THEN** the frontend SHALL keep the existing `AlertDialog` confirmation before calling the credential delete endpoint.

### Requirement: List and detail surfaces avoid removed fields
AI provider list and detail surfaces SHALL render only fields present in the latest backend response or derived from stable frontend provider labels.

#### Scenario: List row renders
- **WHEN** the frontend renders an AI provider config list row
- **THEN** it SHALL use provider type, default state, description or base URL, credential count, credential models, key previews, and timestamps instead of config `name` or config-level `model`.

#### Scenario: Search and sort controls render
- **WHEN** the AI provider list controls render
- **THEN** they SHALL NOT offer search or sort options based on removed `name` or config-level `model` fields.

#### Scenario: Detail or delete copy renders
- **WHEN** detail, toast, or delete confirmation copy references an AI provider config
- **THEN** it SHALL identify the config using provider type and supported metadata instead of a removed `name`.

### Requirement: API mapping ledger reflects resolved AI provider drift
The API mapping ledger SHALL document the final frontend integration state for the latest AI provider contract.

#### Scenario: Implementation updates APIMAPPING
- **WHEN** this change is implemented
- **THEN** `docs/APIMAPPING.md` SHALL state that AI provider config create/update/list/detail no longer use config-level `name`, config-level `model`, or credential `label`.

#### Scenario: Remaining drift exists
- **WHEN** any AI provider field, endpoint, permission, search behavior, or UI mapping remains unaligned after implementation
- **THEN** `docs/APIMAPPING.md` SHALL explicitly document the remaining drift instead of marking the surface fully aligned.

