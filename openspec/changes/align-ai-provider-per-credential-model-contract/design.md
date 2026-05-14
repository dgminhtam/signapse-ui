## Context

The latest `docs/api_mapping.json` AI provider contract simplifies config metadata and moves model selection into credentials:

- `CreateAiProviderConfigRequest` accepts `providerType`, optional `description`, optional `baseUrl`, optional `defaultProvider`, and required `credentials[]`.
- `CreateAiProviderCredentialRequest` requires `apiKey` and `model`.
- `UpdateAiProviderConfigRequest` no longer accepts `name`, config-level `model`, or `apiKey`.
- `AiProviderConfigResponse` no longer returns `name` or config-level `model`.
- `AiProviderCredentialResponse` returns `model`, not `label`.

The frontend currently reflects an intermediate contract from completed changes: config forms still own `name` and top-level `model`, create credential rows still collect `label`, and the edit credential panel still edits labels. That now conflicts with the backend and with the desired business rule that every credential must be validated and paired with its selected model.

## Goals / Non-Goals

**Goals:**

- Align AI provider DTOs, actions, create/edit/list/detail UI, and docs with the latest backend contract.
- Remove config-level `name` and `model` from payloads, validation schemas, render paths, search/sort assumptions, and skeletons.
- Treat `model` as credential-owned data in create, edit, response rendering, add credential, and update credential flows.
- Require each credential to validate its own API key through model catalog before a model can be selected and submitted.
- Preserve focused form, list table, permission, toast, pending state, destructive confirmation, and Vietnamese UI conventions.
- Update `docs/APIMAPPING.md` to mark AI provider config integration as aligned after implementation.

**Non-Goals:**

- No backend API, permission, or model catalog endpoint changes.
- No credential default/priority model unless the backend adds a field.
- No global theme, shared `components/ui`, sidebar, or unrelated AI prompt behavior changes.
- No full-key display for existing credentials; existing credentials still show only previews.
- No speculative list filtering if the backend contract does not expose a supported searchable field.

## Decisions

1. **Config identity becomes provider-first, not name-first.**

   List/detail/edit surfaces should use the localized provider label as the main identity, with default state, description, base URL, credential count, and credential model summaries as supporting scan signals. This matches the response shape and avoids inventing a frontend-only name that cannot round-trip.

   Alternative considered: keep a UI-only name field and never send it. That would be misleading because list/detail would show data not backed by the backend contract.

2. **Remove config-level model selection completely.**

   The model picker must move from create/update config forms into credential row flows. Config create/update forms should not store a `model` field, call catalog for a global model, or block config metadata save on a global model.

   Alternative considered: keep a hidden top-level model as a convenience and copy it into the first credential. That hides the new backend rule and breaks when multiple credentials target different models.

3. **Each create credential row owns catalog state.**

   Create rows should contain `apiKey`, selected `model`, and transient model catalog options/pending/error state. The row's "validate/select model" action calls `POST /ai-provider-configs/model-catalog` with the current provider type, base URL, and that row's API key. The row can be submitted only after it has a selected model.

   Alternative considered: validate one selected row and reuse the selected model for all credentials. The user explicitly rejected this by requiring every credential to validate and select model.

4. **Existing credential model changes require a fresh API key validation path.**

   Existing credentials expose `model` and `keyPreview`, not the full key. The edit panel should display the saved model, but any add/update flow that changes credential material should require a new API key, validate it via catalog, select a model, and submit `{ apiKey, model }`. This prevents unvalidated model edits while respecting that the full existing key is unavailable.

   Alternative considered: allow free-text model updates without API key validation because `UpdateAiProviderCredentialRequest.model` is optional. That violates the product rule that every credential must validate and select model.

5. **Credential update payloads should be intentional.**

   Add credential requires `apiKey` and `model`. Update credential should send only fields the user is changing, but the UI should couple API key rotation and model selection in one validation flow. If no new API key/model has been selected, update should be disabled or show a validation message instead of submitting an empty payload.

   Alternative considered: submit the existing model with no API key on every credential update. That would be a no-op in many cases and could imply validation that did not happen.

6. **Search and sort must stop depending on removed fields.**

   The list currently searches and sorts by `name`. Because the current snapshot's `SpecificationAiProviderConfig` is empty and `name` is removed, the UI should remove or replace name search/sort only after verifying runtime-supported filters. The safe default is provider/default/id sorting and no name search until a supported query field is confirmed.

   Alternative considered: switch search to `description[containsIgnoreCase]` by assumption. That might silently generate unsupported runtime filters.

7. **APIMAPPING should be updated after code alignment.**

   The current `docs/APIMAPPING.md` correctly marks drift. After implementation, AI provider rows and notes should state that `name`, top-level `model`, and credential `label` have been removed from FE mappings, and that credential model selection is integrated per credential.

## Risks / Trade-offs

- Users may miss the removed display name -> mitigate with provider-first row identity and concise credential model summaries.
- Multi-row catalog state can make create dense -> keep row controls compact and stable inside the focused form body, without nested decorative cards.
- Existing credentials cannot revalidate with stored keys -> require a new API key for model-changing credential updates and explain that it is used for validation/rotation.
- Removing name search may reduce discoverability -> preserve provider/default/id controls and document any remaining runtime search gap in APIMAPPING if no supported replacement exists.
- Prior completed OpenSpec changes may conflict conceptually -> treat this change as the latest source for AI provider UI/DTO behavior and update tasks to remove obsolete fields.
- Full lint may still fail from unrelated repo debt -> run targeted lint for AI provider files and report unrelated failures separately.

## Migration Plan

1. Update AI provider TypeScript definitions to mirror `docs/api_mapping.json`.
2. Update server actions only where payload/return types changed; keep endpoint URLs and `fetchAuthenticated()` behavior.
3. Refactor create form so config fields exclude `name`/top-level `model`, and every credential row validates API key and selects its own model before submit.
4. Refactor edit metadata form to save only provider type, description, base URL, and default flag.
5. Refactor credential panel to display `credential.model`, add credentials through validated `apiKey + model`, and update credentials through a fresh validation/model selection flow.
6. Simplify list/search/sort/detail rendering around fields that still exist in backend responses.
7. Update skeletons, empty states, toast copy, and `docs/APIMAPPING.md`.
8. Verify typecheck, targeted lint, and smoke paths for create, edit, credential CRUD, set-default, model catalog, and list behavior.

Rollback is a normal frontend revert of this change. No persisted frontend data migration is required.

## Open Questions

- Does backend runtime support any AI provider list filters besides the empty OpenAPI `SpecificationAiProviderConfig` schema? If not, name search should be removed rather than replaced speculatively.
- Should credential model update always rotate the API key, or should BE add a catalog lookup by existing credential id later? Current design requires a fresh API key because the frontend cannot read stored secrets.
