## 1. Contract And Actions

- [x] 1.1 Update `app/lib/ai-provider-configs/definitions.ts` for `GROQ`, credential request/response DTOs, `credentials[]` config responses, and create/update payloads without top-level config `apiKey`.
- [x] 1.2 Update `app/api/ai-provider-configs/action.ts` so config create submits `credentials[]`, config update omits `apiKey`, and config/list responses no longer use legacy full-key sanitizers.
- [x] 1.3 Add server actions for `GET`, `POST`, `PUT`, and `DELETE` under `/ai-provider-configs/{id}/credentials*` with `ActionResult`, `fetchAuthenticated()`, and targeted `revalidatePath()` calls.
- [x] 1.4 Update provider option constants, Zod schemas, and model catalog request typing so `GROQ` works consistently across create and edit flows.

## 2. Create And Edit Flows

- [x] 2.1 Split the current mode-branching AI provider form into separate create and update submit-owning containers, keeping only mode-neutral field helpers shared.
- [x] 2.2 Update the create form to collect provider metadata, initial credential label/API key, model catalog verification, selected model, and submit `credentials: [{ label?, apiKey }]`.
- [x] 2.3 Update the edit metadata form to remove saved API key fields, save only backend-supported metadata fields, and preserve safe cancel/reset behavior.
- [x] 2.4 Add fresh temporary API key handling for edit-time model catalog lookup without persisting that key unless a credential action is submitted separately.

## 3. Credential Management UI

- [x] 3.1 Add an edit-page credential panel that renders labels, key previews, last-used, rate-limit, created, and last-modified metadata from backend credential responses.
- [x] 3.2 Add credential create and update controls with validation, permission gates, pending spinners, `sonner` success/error toasts, and route refresh on success.
- [x] 3.3 Add credential delete with `AlertDialog` confirmation, disabled/pending state, destructive copy, `sonner` feedback, and route refresh on success.
- [x] 3.4 Add empty/loading states for credential data that match the final panel layout and avoid implying a default credential not present in the backend contract.

## 4. AI Provider Page Polish

- [x] 4.1 Update list/detail rendering to account for credential previews or counts without exposing secret material or widening table columns.
- [x] 4.2 Keep list toolbar, table surface, pagination, focused form shell, skeletons, and Vietnamese UI copy aligned with repo conventions.
- [x] 4.3 Verify AI provider permissions are applied consistently for read, create, update, delete, set-default, model-catalog, and credential-specific controls.

## 5. Documentation And Verification

- [x] 5.1 Update `docs/APIMAPPING.md` AI provider rows and summary notes to document `GROQ`, `credentials[]`, removed config-level `apiKey`, credential endpoints, and final frontend integration status.
- [x] 5.2 Check `docs/APIMAPPING.md` edits against `docs/api_mapping.json` and avoid changing unrelated Telegram/API mapping content in the dirty worktree.
- [x] 5.3 Run `/typecheck` and `/lint`, or document why either command could not be run.
- [x] 5.4 Smoke check create, edit metadata save, model catalog, credential create/update/delete, set-default, permission-gated states, and delete confirmations.
