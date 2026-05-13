## Why

The backend AI provider config contract now separates provider metadata from credentials, adds multiple API key credentials per provider config, and introduces `GROQ` as a provider type. The current frontend still treats `apiKey` as a direct config field, so create/update flows and `docs/APIMAPPING.md` no longer describe or call the backend contract accurately.

## What Changes

- **BREAKING**: Replace direct `apiKey` create/update payload handling with the backend credential model: create config sends `credentials[]`, while credential updates use `/ai-provider-configs/{id}/credentials*`.
- Add frontend DTOs, Zod validation, and server actions for listing, creating, updating, and deleting AI provider credentials.
- Update AI provider create UI so the initial API key is submitted as the first credential while preserving model catalog verification before submit.
- Update AI provider edit UI so config metadata edits are separate from credential management; API key rotation/add/delete happens through credential-specific actions.
- Add `GROQ` to provider type definitions, validation, provider selection, and model catalog handling.
- Update list/detail rendering to use backend credential previews and usage/rate-limit metadata instead of sanitizing a legacy full `apiKey` response.
- Update `docs/APIMAPPING.md` to mark the precise AI provider contract drift and document the integrated credential sub-resource once implementation is complete.
- Non-goals: no backend API changes, no global theme/token changes, no unrelated AI prompt/model behavior changes, and no broad redesign of the AI provider navigation surface.

## Capabilities

### New Capabilities

- `ai-provider-credential-management`: Defines the frontend behavior for managing AI provider config metadata and credential sub-resources against the current backend contract.

### Modified Capabilities

None.

## Impact

- Affected docs: `docs/APIMAPPING.md`.
- Affected API snapshot reference: `docs/api_mapping.json`.
- Affected frontend modules: `app/api/ai-provider-configs/action.ts`, `app/lib/ai-provider-configs/definitions.ts`, `app/(main)/ai-provider-configs/*`, and any AI provider permission or UI helpers touched by the current route.
- Uses existing `fetchAuthenticated()`, `ActionResult`, `revalidatePath`, `router.push()`, `router.refresh()`, `sonner`, shadcn/ui primitives, and app-level list/form surfaces.
- Expected verification: lint/typecheck plus targeted smoke review of create, edit, credential add/update/delete, set-default, model catalog, and APIMAPPING alignment.
