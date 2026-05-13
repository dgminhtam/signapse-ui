## Context

The current frontend AI provider config screen was built against an older backend contract where `apiKey` lived directly on `AiProviderConfig`. The latest OpenAPI snapshot changes that model:

- `CreateAiProviderConfigRequest` requires `credentials[]` instead of direct `apiKey`.
- `UpdateAiProviderConfigRequest` no longer accepts `apiKey`.
- `AiProviderConfigResponse` returns `credentials[]` with previews and timestamps, not full secrets.
- Credential CRUD now lives under `/ai-provider-configs/{id}/credentials*`.
- Provider enums now include `GROQ`.

This affects the data definitions, server actions, create/edit UI, model catalog workflow, permission gates, and `docs/APIMAPPING.md`.

## Goals / Non-Goals

**Goals:**

- Align frontend DTOs and server actions with the backend AI provider credential contract.
- Preserve a clear create flow: configure provider metadata, authenticate with an API key, choose a model, then submit the first credential with the config.
- Split edit responsibilities: metadata edits use `/ai-provider-configs/{id}`, credential changes use credential endpoints.
- Expose credential preview, last-used, rate-limit, created, and updated metadata without ever rendering or storing returned full API keys.
- Add `GROQ` consistently across validation, UI options, DTOs, and model catalog handling.
- Update `docs/APIMAPPING.md` after implementation so the ledger accurately states what is integrated and what changed from the old direct-key contract.

**Non-Goals:**

- No backend endpoint or permission changes.
- No encrypted secret storage work in the frontend.
- No global theme, sidebar, navigation hierarchy, or shared `components/ui` changes.
- No redesign of unrelated AI prompt/model behavior.
- No attempt to infer a default credential unless the backend contract adds such a field.

## Decisions

1. **Treat credentials as a child resource, not a hidden field on config.**

   The frontend will remove `apiKey` from config create/update types and model server responses around `credentials[]`. Credential add/update/delete actions will call the new sub-resource endpoints. This avoids continuing the old sanitize pattern after the backend stopped returning full keys.

   Alternative considered: keep the old `apiKey` field in frontend types and transform it late in the action. That hides the contract change from the UI and makes edit flows misleading, because update config cannot rotate keys anymore.

2. **Keep create as one focused task surface, but submit credentials in the new shape.**

   The create page will still ask for the first API key because BE requires at least one credential for config creation. The submitted payload will become `credentials: [{ label?, apiKey }]`. The create form can offer a simple credential label, defaulting to a sensible label when empty.

   Alternative considered: force users to create metadata first, then add credentials. That conflicts with backend `minItems: 1` on create and adds an unnecessary half-created state.

3. **Separate edit metadata from credential management.**

   The edit page should stop using a mode-branching shared form. Metadata update will save provider type, name, description, model, base URL, and default flag only. A credential panel on the same page will list previews and provide add/update/delete actions with their own pending states and destructive confirmation for delete.

   Alternative considered: leave one edit form with optional API key. That would submit unsupported `apiKey` to `PUT /ai-provider-configs/{id}` and blur the new business rule.

4. **Use temporary API key input for model catalog where needed.**

   `POST /ai-provider-configs/model-catalog` still accepts a raw `apiKey`. Create can use the same key that will be submitted as the first credential. Edit cannot read an existing full key, so model catalog selection must use a fresh temporary key input and must not imply credential rotation unless the user separately saves or updates a credential.

   Alternative considered: fetch model catalog from saved credentials. The current backend contract does not expose `credentialId` catalog lookup, so this would be speculative.

5. **Document APIMAPPING after code alignment, not before.**

   `docs/APIMAPPING.md` should first mark the current drift precisely, then end with integrated status once DTOs, actions, and UI match `docs/api_mapping.json`. The update must avoid overwriting unrelated Telegram mapping edits already present in the worktree.

## Risks / Trade-offs

- Credential ordering may not imply priority -> render credentials as a neutral list and avoid "primary credential" labels unless BE adds a field.
- Existing keys cannot be shown or reused for catalog lookup -> use preview metadata and explicit fresh API key entry for verification.
- Create and edit currently share a submit-owning component -> split carefully to follow repo form rules without broad visual churn.
- `docs/APIMAPPING.md` is already dirty from backend snapshot work -> restrict edits to AI provider lines and cross-cutting summary bullets.
- Credential CRUD creates more UI states -> keep each action locally pending and refresh the route after successful mutations.

## Migration Plan

1. Update AI provider definitions and server actions to match the new backend snapshot.
2. Split create and edit form containers while preserving the existing focused form shell and Vietnamese UI copy.
3. Add a credential management panel to the edit page with list/add/update/delete flows.
4. Update list/detail rendering for credential previews and `GROQ`.
5. Update `docs/APIMAPPING.md` to reflect the final integrated state and any remaining drift.
6. Verify with typecheck/lint and targeted manual smoke checks for create, edit, model catalog, credential CRUD, delete confirmations, and set-default.

Rollback is a normal frontend revert of the OpenSpec change implementation. No backend migration or persisted frontend data migration is required.

## Open Questions

- Does BE intend to add a credential default/priority field later? Current UI should not assume one.
- Should the edit page allow selecting a model by typing when no fresh API key is available, or should model changes always require catalog verification?
