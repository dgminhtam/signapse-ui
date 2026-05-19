## Why

The previous AI provider credential alignment maps the backend contract correctly, but the create screen still looks and behaves like a single-key setup. Since the backend create request already accepts `credentials[]`, the UI should let operators define multiple initial credentials before the provider config exists.

## What Changes

- Update the AI provider create flow to manage a dynamic list of credential rows instead of a single `credentialLabel` and `apiKey` pair.
- Submit all valid create-time credentials through `CreateAiProviderConfigRequest.credentials[]`, preserving the backend requirement that at least one credential is present.
- Keep model catalog verification in the create flow by using the selected or primary create-time credential as the raw API key for `POST /ai-provider-configs/model-catalog`.
- Add form validation, pending states, accessible controls, Vietnamese copy, and skeleton behavior that make multiple credentials clear without adding edit-only credential actions to the create page.
- Update `docs/APIMAPPING.md` so the AI provider mapping notes state that create supports multiple initial credentials.
- Non-goals: no backend API changes, no credential priority/default contract, no change to edit-page credential CRUD, no global theme or shared `components/ui` changes.

## Capabilities

### New Capabilities

- `ai-provider-create-credential-collection`: Defines the frontend behavior for collecting and submitting multiple initial AI provider credentials during config creation.

### Modified Capabilities

None.

## Impact

- Affected docs: `docs/APIMAPPING.md`.
- Affected frontend modules: `app/(main)/ai-provider-configs/ai-provider-config-create-form.tsx`, create-page skeleton/fallbacks if needed, and any local AI provider create helpers introduced for credential rows.
- Affected types/actions: existing `AiProviderConfigCreateRequest` already supports `credentials[]`; no server action shape change is expected beyond passing multiple entries.
- Expected verification: typecheck, targeted lint for touched files, and smoke review of create flow with one credential, multiple credentials, row add/remove, model catalog verification, validation errors, and successful redirect.
