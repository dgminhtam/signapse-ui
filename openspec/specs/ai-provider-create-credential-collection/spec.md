# ai-provider-create-credential-collection Specification

## Purpose
TBD - created by archiving change support-multiple-ai-credentials-on-create. Update Purpose after archive.
## Requirements
### Requirement: Create flow collects multiple initial credentials
The AI provider create flow SHALL allow users to maintain a collection of one or more initial credential rows before submitting the provider config.

#### Scenario: User adds credential rows
- **WHEN** a user chooses to add another credential while creating an AI provider config
- **THEN** the frontend SHALL append a new credential row with label and API key inputs.

#### Scenario: User removes credential rows
- **WHEN** a user removes a credential row and more than one row exists
- **THEN** the frontend SHALL remove that row from the create payload candidate list without calling credential sub-resource endpoints.

#### Scenario: Only one credential remains
- **WHEN** the create form has exactly one credential row
- **THEN** the frontend SHALL prevent removing the final row so the backend `credentials[]` minimum remains satisfiable.

### Requirement: Create credentials are validated as request payload data
The create form SHALL validate create-time credentials as unsaved request payload data, requiring at least one credential and an API key for each submitted credential row.

#### Scenario: User submits without credential API key
- **WHEN** a user submits the create form with any credential row missing an API key
- **THEN** the frontend SHALL block submission and show row-level validation feedback for the missing API key.

#### Scenario: User submits labels with surrounding whitespace
- **WHEN** a user submits credential labels with leading or trailing whitespace
- **THEN** the frontend SHALL trim labels before building `CreateAiProviderConfigRequest.credentials[]`.

#### Scenario: User leaves an optional label empty
- **WHEN** a user submits a credential row with a valid API key and an empty label
- **THEN** the frontend SHALL include the credential API key and omit the empty label from the request entry.

### Requirement: Create submit sends all initial credentials
The AI provider create flow SHALL send all valid create-time credentials through `CreateAiProviderConfigRequest.credentials[]` and SHALL NOT send a top-level `apiKey`.

#### Scenario: User creates with multiple credentials
- **WHEN** a user submits a valid create form containing multiple credential rows
- **THEN** the frontend SHALL call `POST /ai-provider-configs` with a `credentials[]` entry for each submitted row.

#### Scenario: User creates with one credential
- **WHEN** a user submits a valid create form containing one credential row
- **THEN** the frontend SHALL call `POST /ai-provider-configs` with a one-item `credentials[]` array and no top-level `apiKey`.

### Requirement: Model catalog uses one selected create credential
The create flow SHALL use one selected credential row as the raw API key source for model catalog verification and SHALL NOT imply that the selected row is a saved default or priority credential.

#### Scenario: User verifies model catalog
- **WHEN** a user requests model catalog verification during create
- **THEN** the frontend SHALL call `POST /ai-provider-configs/model-catalog` with provider type, optional base URL, and the API key from the selected credential row.

#### Scenario: Selected catalog credential is missing API key
- **WHEN** a user requests model catalog verification and the selected credential row has no API key
- **THEN** the frontend SHALL block the catalog request and show validation feedback on that row.

#### Scenario: Catalog-critical input changes
- **WHEN** a user changes provider type, base URL, or the selected catalog credential API key after a model has been verified
- **THEN** the frontend SHALL clear the selected model and require verification again before final submit.

#### Scenario: Non-selected credential changes
- **WHEN** a user changes a credential row that is not selected for catalog verification
- **THEN** the frontend SHALL preserve the selected model unless another catalog-critical input changes.

### Requirement: Create credential collection follows Signapse UI conventions
The create credential collection SHALL follow Signapse focused form, accessibility, loading, and Vietnamese UI copy conventions.

#### Scenario: Create form renders credential collection
- **WHEN** a user opens the AI provider create page
- **THEN** the frontend SHALL render the credential collection inside the focused form body using Vietnamese labels, accessible inputs, stable row controls, and no nested card shell used only for decoration.

#### Scenario: Create submission is pending
- **WHEN** a create submission is pending
- **THEN** the frontend SHALL disable the submit button and show the existing inline `Spinner` feedback.

#### Scenario: Create succeeds
- **WHEN** the backend accepts a provider config created with one or more credentials
- **THEN** the frontend SHALL show a `sonner` success toast, navigate back to the AI provider config list with `router.push()`, and call `router.refresh()`.

### Requirement: API mapping documents multi-credential create behavior
The API mapping ledger SHALL document that the AI provider create UI submits multiple initial credentials through `credentials[]`.

#### Scenario: APIMAPPING is updated
- **WHEN** this change is implemented
- **THEN** `docs/APIMAPPING.md` SHALL state that `POST /ai-provider-configs` create integration supports multiple initial credential entries and no top-level `apiKey`.

