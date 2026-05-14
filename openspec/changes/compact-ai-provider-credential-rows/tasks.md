## 1. Scope Review

- [x] 1.1 Review current AI provider create credential rows, credential panel add/update controls, model picker trigger copy, and create skeleton against the compact row spec.
- [x] 1.2 Decide whether to keep model summary markup local in each component or extract a small feature-local helper if duplication becomes noisy.

## 2. Create Form Credential Rows

- [x] 2.1 Rename the create form credential section legend from `Credential ban đầu` to `API key và model` and reduce legend hierarchy to align with other form labels.
- [x] 2.2 Demote `Credential 1`, `Credential 2`, and similar row indexes to secondary descriptive text.
- [x] 2.3 Move each row's validate/select model action into the row header beside the delete button.
- [x] 2.4 Replace the model action icon with `KeyRound` and use compact labels `Chọn model`, `Đổi model`, and `Đang kiểm tra...`.
- [x] 2.5 Place API key input and selected model summary on the same row for desktop, with stacked behavior on mobile.
- [x] 2.6 Replace the tall dashed model display with an input-height model summary that handles empty and long model ids without overflow.
- [x] 2.7 Remove repeated helper copy from each credential row while preserving required markers, validation errors, disabled states, and toast behavior.
- [x] 2.8 Update create form skeleton so it mirrors the compact credential row hierarchy.

## 3. Detail Credential Panel

- [x] 3.1 Apply the same compact API key/model/action pattern to the add credential controls.
- [x] 3.2 Apply the same compact API key/model/action pattern to existing credential update controls.
- [x] 3.3 Preserve saved credential display for model, key preview, last-used, rate-limit, created, and last-modified metadata.
- [x] 3.4 Keep credential delete `AlertDialog`, permission gates, route refresh, pending states, and `sonner` toasts intact.

## 4. Verification

- [x] 4.1 Run TypeScript verification for touched AI provider files.
- [x] 4.2 Run targeted lint for touched AI provider files and document unrelated full-lint failures if present.
- [x] 4.3 Smoke review create with one credential, create with multiple credentials, model validation pending state, provider/base URL model invalidation, credential add/update, and mobile stacking.
- [x] 4.4 Run `openspec validate compact-ai-provider-credential-rows --strict`.
