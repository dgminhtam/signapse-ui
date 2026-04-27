## 1. Data Layer

- [x] 1.1 Create `app/lib/system-prompts/definitions.ts` with `SystemPromptType`, request/response types, prompt type enum list, label helpers, workflow group helpers, and content length helpers.
- [x] 1.2 Create `app/lib/system-prompts/permissions.ts` with read, create, update, delete, and nav permission constants using `system-prompt:*`.
- [x] 1.3 Create `app/api/system-prompts/action.ts` with list, detail, create, update, and delete server actions using `fetchAuthenticated()`.
- [x] 1.4 Ensure mutation actions return `ActionResult`, URL-encode `promptType`, and revalidate list/detail paths after create/update/delete.

## 2. List Route

- [x] 2.1 Create `app/(main)/system-prompts/page.tsx` with permission guard, Card shell, CardHeader, CardDescription, Separator, Suspense, and skeleton.
- [x] 2.2 Create `system-prompt-search.tsx` with controlled URL-backed live search, `300ms` debounce, trim behavior, page reset, `type="search"`, sr-only label, and inline `Spinner`.
- [x] 2.3 Create `system-prompt-list.tsx` with toolbar, create action, sort, page size selector, shared table surface, empty state, pagination, and row actions.
- [x] 2.4 Render list columns for prompt type, workflow group, content length, last modified date, created date, and actions.
- [x] 2.5 Gate create, update, and delete controls with `system-prompt:create`, `system-prompt:update`, and `system-prompt:delete`.

## 3. Forms And Detail Route

- [x] 3.1 Create `system-prompt-form.tsx` using React Hook Form and Zod validation for `promptType` and `content`.
- [x] 3.2 Enforce non-empty trimmed content and max `10000` characters in frontend validation, with a visible character counter.
- [x] 3.3 Implement create mode with editable `promptType` select and content textarea.
- [x] 3.4 Implement edit mode with readonly prompt type context and content textarea.
- [x] 3.5 Ensure submit buttons show `Spinner`, are disabled while pending, and redirect to `/system-prompts` with `router.push()` and `router.refresh()` after success.
- [x] 3.6 Ensure edit cancel safely resets to initial backend data or returns to the list without persisting changes.
- [x] 3.7 Create `app/(main)/system-prompts/create/page.tsx` with permission guard and Card shell.
- [x] 3.8 Create `app/(main)/system-prompts/[promptType]/page.tsx` with Back button, permission guard, server-side detail fetch, Card shell, and not-found handling.

## 4. Destructive Action And Error Boundary

- [x] 4.1 Implement delete action with `AlertDialog`, explicit warning copy, pending state, success/error toast, and route refresh.
- [x] 4.2 Create `app/(main)/system-prompts/error.tsx` with professional Vietnamese copy and retry action.
- [x] 4.3 Ensure every user-facing label, placeholder, toast, empty state, loading state, access denied message, and error message is Vietnamese with proper diacritics.

## 5. Navigation And Documentation

- [x] 5.1 Add `Prompt hệ thống` to `config/site.ts` under `Cài đặt`, gated by `SYSTEM_PROMPT_NAV_PERMISSIONS`.
- [x] 5.2 Update `docs/APIMAPPING.md` to mark all `system-prompts` endpoints as implemented and list the new frontend files.
- [x] 5.3 Confirm `docs/APIMAPPING.md` endpoint count and `operationId` mapping still match `docs/api_mapping.json`.

## 6. Verification

- [x] 6.1 Run targeted lint for `app/(main)/system-prompts`, `app/api/system-prompts`, `app/lib/system-prompts`, and `config/site.ts`.
- [x] 6.2 Run `pnpm run typecheck`.
- [x] 6.3 Search the new system prompt feature for mojibake patterns and English user-facing copy.
- [x] 6.4 Validate OpenSpec apply readiness for `add-system-prompt-management`.
