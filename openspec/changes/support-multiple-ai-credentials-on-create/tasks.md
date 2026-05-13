## 1. Scope Review

- [x] 1.1 Review the current AI provider create form schema, default values, submit payload, model catalog handler, and create-page skeleton to identify every single-key assumption.
- [x] 1.2 Confirm the existing `AiProviderConfigCreateRequest.credentials[]` and `createAiProviderConfig` server action already support multiple credential entries without API changes.

## 2. Credential Collection

- [x] 2.1 Replace create form `credentialLabel` and `apiKey` fields with a `credentials[]` schema and default one-row credential collection.
- [x] 2.2 Implement dynamic credential rows with label and API key inputs, accessible add/remove controls, and a guard that prevents removing the final row.
- [x] 2.3 Add row-level validation so every submitted credential row requires an API key while label remains optional and length-limited.
- [x] 2.4 Build the create request payload by trimming each credential row, omitting empty labels, and sending every row through `credentials[]` with no top-level `apiKey`.

## 3. Model Catalog Verification

- [x] 3.1 Add a selected catalog credential row state, defaulting to the first credential row, without presenting it as a saved primary/default credential.
- [x] 3.2 Update `handleAuthenticateAndSelectModel` to validate and use the selected credential row API key for `POST /ai-provider-configs/model-catalog`.
- [x] 3.3 Clear selected model and catalog options when provider type, base URL, or the selected catalog credential API key changes after verification.
- [x] 3.4 Preserve selected model state when non-selected credential rows change, unless another catalog-critical input changes.
- [x] 3.5 Handle removal of the selected credential by selecting a remaining row and clearing stale catalog/model state.

## 4. UI Copy, Skeleton, And Docs

- [x] 4.1 Update create form Vietnamese copy so the credential area reads as multiple initial credentials rather than a single API key setting.
- [x] 4.2 Keep the credential collection inside the focused form body with stable row controls, no decorative nested card shell, and existing submit spinner/disabled behavior.
- [x] 4.3 Update create-page Suspense skeleton or loading mirror if the visible credential collection shape changes materially.
- [x] 4.4 Update `docs/APIMAPPING.md` AI provider notes to state that create supports multiple initial credential entries through `credentials[]`.

## 5. Verification

- [x] 5.1 Run TypeScript verification for the touched frontend code.
- [x] 5.2 Run lint verification for touched files where the project tooling supports it; document unrelated existing lint failures if full lint remains dirty.
- [x] 5.3 Smoke review the create flow for one credential, multiple credentials, row add/remove, selected catalog credential verification, validation errors, successful create redirect, and APIMAPPING alignment.
