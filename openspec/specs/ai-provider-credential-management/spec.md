# ai-provider-credential-management Specification

## Purpose
TBD - created by archiving change align-ai-provider-credentials-contract. Update Purpose after archive.
## Requirements
### Requirement: Contract-aligned AI provider types
The frontend SHALL model AI provider config data using the current backend credential contract, including `GEMINI`, `GROQ`, `OPENAI`, and `ZAI` provider types, `credentials[]` on config responses, and no full `apiKey` field on config responses.

#### Scenario: Provider enum includes GROQ
- **WHEN** the backend returns or accepts provider type `GROQ`
- **THEN** the frontend types, validation schema, provider selector, and model catalog request SHALL accept it without falling back to an unknown state.

#### Scenario: Response contains credential previews only
- **WHEN** the frontend loads an AI provider config response
- **THEN** it SHALL read credential data from `credentials[]` and SHALL NOT expect or expose a full `apiKey` field on the config response.

### Requirement: Create config submits an initial credential
The create flow SHALL submit AI provider metadata and at least one initial credential using `CreateAiProviderConfigRequest.credentials[]`, while preserving model catalog verification before final submit.

#### Scenario: User creates a provider config
- **WHEN** a user submits a valid create form with provider metadata, model, and API key
- **THEN** the frontend SHALL call `POST /ai-provider-configs` with `credentials: [{ label?, apiKey }]` and SHALL NOT send a top-level `apiKey`.

#### Scenario: User chooses a model during create
- **WHEN** a user requests the model catalog before creating a config
- **THEN** the frontend SHALL call `POST /ai-provider-configs/model-catalog` with provider type, API key, and optional base URL, then allow the user to choose a returned model.

### Requirement: Edit config separates metadata from credentials
The edit flow SHALL update provider config metadata through `PUT /ai-provider-configs/{id}` and SHALL manage API keys only through the credential sub-resource endpoints.

#### Scenario: User saves metadata changes
- **WHEN** a user saves edited provider type, name, description, model, base URL, or default-provider state
- **THEN** the frontend SHALL call `PUT /ai-provider-configs/{id}` without an `apiKey` field.

#### Scenario: User changes credential material
- **WHEN** a user adds or updates an API key for an existing provider config
- **THEN** the frontend SHALL call the matching credential endpoint under `/ai-provider-configs/{id}/credentials*` instead of the config update endpoint.

### Requirement: Credential management UI
The edit page SHALL provide a credential management surface that lists credential previews and supports credential create, update, and delete actions according to the backend permissions.

#### Scenario: User views credentials
- **WHEN** a user opens an AI provider config edit page with read permission
- **THEN** the frontend SHALL show available credential labels, key previews, last-used timestamp, rate-limit timestamp, created date, and last-modified date when present.

#### Scenario: User deletes a credential
- **WHEN** a user chooses to delete a credential
- **THEN** the frontend SHALL require an `AlertDialog` confirmation before calling `DELETE /ai-provider-configs/{id}/credentials/{credentialId}`.

#### Scenario: Credential mutation succeeds
- **WHEN** credential create, update, or delete succeeds
- **THEN** the frontend SHALL show a `sonner` success toast, refresh the route data, and keep the user on the provider edit page.

### Requirement: Model catalog on edit uses fresh verification input
The edit flow SHALL allow model catalog verification with a fresh API key input when the user needs to change models, and SHALL NOT imply that the temporary key has been saved as a credential unless a credential mutation is performed.

#### Scenario: User fetches model catalog while editing
- **WHEN** a user enters a temporary API key and requests model catalog on the edit page
- **THEN** the frontend SHALL use the key only for `POST /ai-provider-configs/model-catalog` unless the user separately saves it through a credential action.

### Requirement: Focused form and page conventions
The AI provider create and edit surfaces SHALL follow Signapse focused form, list, loading, permission, and Vietnamese UI copy conventions while keeping create and update submit-owning form containers separate.

#### Scenario: Create and edit forms are rendered
- **WHEN** a user opens the AI provider create or edit page
- **THEN** each flow SHALL render through a focused form shell with header, body, footer action zone, pending submit spinner, disabled submit while pending, and a safe cancel/reset action.

#### Scenario: Unauthorized user opens a protected action
- **WHEN** a user lacks the required AI provider permission for a route or mutation control
- **THEN** the frontend SHALL gate the route or control using existing Signapse permission patterns.

### Requirement: API mapping ledger alignment
The API mapping ledger SHALL document the final frontend integration state for AI provider configs against `docs/api_mapping.json`, including credential endpoints, request/response shape changes, provider enum changes, and any remaining drift.

#### Scenario: Implementation updates APIMAPPING
- **WHEN** the AI provider credential contract implementation is complete
- **THEN** `docs/APIMAPPING.md` SHALL mark the AI provider config rows and notes according to the actual integrated frontend behavior.

#### Scenario: Drift remains after implementation
- **WHEN** any backend AI provider contract field or endpoint remains unimplemented
- **THEN** `docs/APIMAPPING.md` SHALL explicitly document that remaining drift instead of marking the surface fully integrated.

