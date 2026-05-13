## Context

`align-ai-provider-credentials-contract` moved the frontend from a legacy direct `apiKey` config field to the backend credential model. The current create form now submits `credentials: [{ label?, apiKey }]`, but the screen still presents one credential field pair, so operators reasonably read it as a single-key setting.

The backend create contract already accepts an array of credentials and requires at least one entry. The frontend therefore can support multiple initial credentials without new endpoints, but model catalog lookup still accepts only one raw `apiKey` at a time.

## Goals / Non-Goals

**Goals:**

- Let users add, edit, and remove multiple credential rows while creating an AI provider config.
- Submit the full create-time credential collection through `CreateAiProviderConfigRequest.credentials[]`.
- Keep model catalog verification available before submit by making one credential row the catalog verification credential.
- Keep create as a focused form shell with clear Vietnamese copy, accessible row controls, pending states, and no broad layout churn.
- Update `docs/APIMAPPING.md` to describe the create flow as multiple initial credentials, not a single initial key.

**Non-Goals:**

- No backend API, permission, or credential priority/default changes.
- No change to edit-page credential CRUD, except preserving compatibility with configs created with multiple credentials.
- No saved credential selection for model catalog; the backend does not expose a credential-id catalog lookup.
- No global UI theme, shared `components/ui`, sidebar, or unrelated AI behavior changes.

## Decisions

1. **Use a form-owned credential collection instead of a shared credential editor.**

   The create form should own `credentials[]` via local form state, most likely `useFieldArray`, because create-time rows are unsaved request payload data. The edit page credential panel manages persisted child resources and calls credential endpoints, so sharing it would mix two different lifecycles.

   Alternative considered: reuse `AiProviderCredentialPanel` on create. That panel requires a saved provider id and endpoint-backed mutations, so it cannot run before the config exists.

2. **Make one visible row the model catalog credential.**

   The UI should keep a selected credential row for `POST /ai-provider-configs/model-catalog`, defaulting to the first row. Operators can add multiple credentials, but catalog verification uses one explicit row because the current backend request accepts one `apiKey`.

   Alternative considered: call the catalog endpoint once per credential and merge model options. That creates unclear failure handling and implies all credentials are equivalent for model availability, which the backend contract does not promise.

3. **Invalidate selected model when catalog-critical inputs change.**

   Provider type, base URL, and the selected catalog credential's API key determine the catalog request. Changing any of those after successful verification should clear the selected model and show the existing re-authentication feedback. Editing non-selected credential rows should not invalidate the model because they were not used for catalog verification.

   Alternative considered: invalidate model on any credential row edit. That is safer but frustrating when the user is only adding fallback credentials unrelated to the verified model.

4. **Validate all submitted credential rows strictly.**

   The form should require at least one credential, require `apiKey` for every visible row, trim optional labels, and omit empty labels from the payload. Removing a row should be disabled or hidden when only one row remains, preserving the backend `minItems` rule.

   Alternative considered: silently drop blank rows on submit. That can hide user mistakes and makes row-level validation less predictable.

5. **Keep create-time copy factual, not explanatory-heavy.**

   The form can label the section as initial credentials and show compact row labels/actions. It should avoid long backend-contract copy in the main workspace; APIMAPPING and OpenSpec carry the technical detail.

   Alternative considered: add a paragraph explaining the old single-key behavior. That would preserve confusion instead of making the new interaction obvious.

## Risks / Trade-offs

- Selected catalog credential is not persisted as primary -> mitigate by avoiding "primary/default credential" labels and using wording tied only to model verification.
- Removing the selected credential can leave stale model state -> reset the catalog selection to a remaining row and clear the selected model when the verified key is removed.
- Dynamic rows can make the form feel dense -> keep row surfaces compact, stable, and inside the existing focused form body rather than adding nested cards.
- Permissions may hide model catalog access -> preserve current `ai-provider-config:model-catalog` gating and keep submit validation independent from catalog permission errors.
- Existing lint debt can obscure verification -> run typecheck and targeted lint on touched files; report unrelated lint failures separately if full lint remains dirty.

## Migration Plan

1. Replace create form single `credentialLabel` and `apiKey` fields with a `credentials[]` field array.
2. Add row add/remove controls, row-level validation, and selected catalog credential state.
3. Update catalog request construction and invalidation logic to read from the selected credential row.
4. Update create payload mapping so every credential row is trimmed and submitted through `credentials[]`.
5. Update create skeleton/copy and `docs/APIMAPPING.md`.
6. Verify with typecheck, targeted lint, and manual smoke checks for one credential, multiple credentials, remove selected credential, catalog verification, and successful create redirect.

Rollback is a normal frontend revert of this change. No persisted data migration is required.

## Open Questions

- Should duplicate credential labels be allowed at create time? The current proposal allows them unless the backend rejects them, because no uniqueness rule is documented.
- If a user adds many credentials, should there be a product cap in the UI? The current proposal defers to backend validation unless a concrete limit appears in the contract.
