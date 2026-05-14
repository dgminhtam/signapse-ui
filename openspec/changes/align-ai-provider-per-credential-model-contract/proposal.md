## Why

The latest backend AI provider contract moves model selection from the provider config to each credential and removes `name` from config payloads/responses. The current frontend still sends and renders config-level `name`, config-level `model`, and credential `label`, so create/edit/list flows can no longer map cleanly to the backend.

## What Changes

- **BREAKING**: Update AI provider config DTOs and UI to remove config-level `name` and `model`; config metadata is now `providerType`, `description`, `baseUrl`, and `defaultProvider`.
- **BREAKING**: Replace credential `label` with credential `model` across create, update, response rendering, and credential CRUD payloads.
- Move model validation and model selection into each credential row: every credential must authenticate with its own API key, open model catalog, select a model, and submit `{ apiKey, model }`.
- Update create flow so multiple initial credentials each carry their own validated selected model before `POST /ai-provider-configs`.
- Update edit credential panel so add/update credential actions validate API key and model together through the model catalog workflow instead of editing a label.
- Simplify list/detail/edit UI hierarchy around provider type, description/base URL, default state, credential count, credential models, key previews, and timestamps.
- Update search/sort/filter assumptions that currently depend on removed `name` or config-level `model` fields.
- Update `docs/APIMAPPING.md` after implementation so AI provider rows no longer show drift for removed fields or credential `label`.
- Non-goals: no backend API changes, no new credential default/priority behavior, no global theme/sidebar changes, no redesign of unrelated AI prompt/model catalog surfaces.

## Capabilities

### New Capabilities

- `ai-provider-per-credential-model-management`: Defines the frontend behavior for AI provider config metadata and credential-scoped model validation/selection against the latest backend contract.

### Modified Capabilities

None.

## Impact

- Affected docs: `docs/APIMAPPING.md`.
- Source-of-truth snapshot: `docs/api_mapping.json`.
- Affected frontend modules: `app/lib/ai-provider-configs/definitions.ts`, `app/api/ai-provider-configs/action.ts`, `app/(main)/ai-provider-configs/*`, and local AI provider form/list/search helpers.
- Existing completed changes superseded in part: `align-ai-provider-credentials-contract` and `support-multiple-ai-credentials-on-create`.
- Expected verification: typecheck, targeted lint for touched AI provider files, and smoke review for create, edit metadata, credential add/update/delete, per-credential model catalog validation, list/search/sort behavior, set-default, and APIMAPPING alignment.
