## 1. Contract And Scope Review

- [x] 1.1 Reconfirm AI provider schemas in `docs/api_mapping.json`: config create/update/response, credential create/update/response, model catalog request/response, and required fields.
- [x] 1.2 Review current AI provider frontend files for removed `name`, config-level `model`, and credential `label` assumptions.
- [x] 1.3 Confirm whether AI provider list runtime supports any replacement search/filter fields; if not, plan to remove name search rather than guessing.

## 2. Types And Actions

- [x] 2.1 Update `app/lib/ai-provider-configs/definitions.ts` so config create/update/response types remove `name` and config-level `model`.
- [x] 2.2 Update credential DTOs so create requires `apiKey` and `model`, update accepts optional `apiKey` and `model`, and response reads `model` instead of `label`.
- [x] 2.3 Keep model catalog request/response definitions aligned with `providerType`, `apiKey`, optional `baseUrl`, and returned model options.
- [x] 2.4 Review `app/api/ai-provider-configs/action.ts` for type fallout, response handling, `ActionResult`, and existing endpoint paths without adding backend assumptions.

## 3. Create Flow

- [x] 3.1 Remove create-form `name` and config-level `model` schema fields, default values, controls, submit payload fields, and skeleton traces.
- [x] 3.2 Refactor create credential rows to store `apiKey`, selected `model`, row-local model options, and row-local catalog pending/error state.
- [x] 3.3 Add per-row validate/select model action that calls model catalog with provider type, base URL, and that row's API key.
- [x] 3.4 Clear only affected credential row model selections when that row's API key changes; clear all row selections when provider type or base URL changes.
- [x] 3.5 Block create submission unless every credential row has a trimmed API key and selected model, then submit `credentials: [{ apiKey, model }, ...]`.
- [x] 3.6 Keep add/remove credential behavior, final-row guard, submit spinner, disabled submit, redirect, refresh, and Vietnamese copy consistent with repo rules.

## 4. Edit Metadata Flow

- [x] 4.1 Remove edit-form `name`, config-level `model`, temporary API key, and config-level model catalog selection controls.
- [x] 4.2 Update edit metadata validation and submit payload to include only provider type, description, base URL, and default provider.
- [x] 4.3 Update edit form shell copy, cancel/reset behavior, skeleton assumptions, and APIMAPPING-related notes to avoid config-level model language.

## 5. Credential Panel

- [x] 5.1 Replace credential `label` display and state with credential `model` display in the existing credential panel.
- [x] 5.2 Refactor add credential flow so the user enters API key, validates via model catalog, selects model, and submits `{ apiKey, model }`.
- [x] 5.3 Refactor update credential flow so changing credential material requires a fresh API key validation and selected model before submit.
- [x] 5.4 Keep credential delete `AlertDialog`, local pending states, `sonner` toasts, route refresh, and permission gates intact.
- [x] 5.5 Ensure existing credentials display `model`, `keyPreview`, last-used, rate-limit, created, and last-modified metadata without exposing full API keys.

## 6. List, Search, Detail, And Loading UI

- [x] 6.1 Update AI provider list rows to use provider label, default state, description/base URL, credential count, credential models/previews, and timestamps instead of removed `name` or config-level `model`.
- [x] 6.2 Remove or revise name-based search and name sort controls according to confirmed backend runtime support.
- [x] 6.3 Update delete confirmation, toast copy, empty states, and row action labels so they identify configs without relying on `provider.name`.
- [x] 6.4 Update list, create, and edit skeletons so loading UI mirrors the final field hierarchy and credential model surfaces.

## 7. Documentation

- [x] 7.1 Update `docs/APIMAPPING.md` AI provider endpoint rows and notes after implementation to reflect resolved `name`/config-level `model`/credential `label` drift.
- [x] 7.2 Document any remaining AI provider search/filter drift if runtime behavior cannot be verified against the latest snapshot.

## 8. Verification

- [x] 8.1 Run TypeScript verification for AI provider changes.
- [x] 8.2 Run targeted lint for touched AI provider files and document unrelated full-lint failures if present.
- [x] 8.3 Manual QA transferred out of the agent-owned archive gate.
  User-owned manual QA: Smoke review create with one credential, create with multiple credentials, per-credential model validation, provider/base URL invalidation, edit metadata save, credential add/update/delete, set-default, list controls, and APIMAPPING alignment.
