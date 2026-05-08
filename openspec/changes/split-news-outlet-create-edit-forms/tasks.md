## 1. Rule Update

- [x] 1.1 Update `AGENTS.md` under the create/update form layout rules to state that create and edit screens must not share one submit-owning form component.
- [x] 1.2 Add the allowed exception: mode-agnostic field primitives/helpers may be shared only if they do not own submit behavior and do not branch on `initialData`, `mode`, or `isEdit`.

## 2. Form Split

- [x] 2.1 Inspect the current news outlet form and identify logic that is create-only, update-only, or field-level shared code.
- [x] 2.2 Create a `NewsOutletCreateForm` component that owns create title/description, defaults, validation, payload construction, submit state, success/error copy, cancel behavior, and `createNewsOutlet` mutation.
- [x] 2.3 Create a `NewsOutletUpdateForm` component that owns update title/description, initial values, metadata display, validation, payload construction, submit state, success/error copy, reset-to-original behavior, and `updateNewsOutlet` mutation.
- [x] 2.4 Extract only mode-agnostic field primitives/helpers if useful, ensuring shared code has no submit logic and no create/edit branching.
- [x] 2.5 Remove or retire the shared submit-owning `NewsOutletForm` component so no component switches create/edit behavior by `initialData`, `mode`, or `isEdit`.

## 3. Route Wiring

- [x] 3.1 Update `app/(main)/news-outlets/create/page.tsx` to render the create-specific form.
- [x] 3.2 Update `app/(main)/news-outlets/[id]/page.tsx` to render the update-specific form with fetched news outlet data.
- [x] 3.3 Preserve current route model, permissions, focused form shell, redirect to `/news-outlets`, and `router.refresh()` behavior.

## 4. Type and Payload Clarity

- [x] 4.1 Split news outlet request typing into create/update-specific types if the implementation needs clearer requiredness.
- [x] 4.2 Verify create payloads include the create-supported fields and do not include removed `slug`.
- [x] 4.3 Verify update payloads include only supported update fields and do not include removed `slug`.

## 5. Verification

- [x] 5.1 Search the news outlet feature to confirm there is no shared submit-owning form that branches on `initialData`, `mode`, or `isEdit`.
- [x] 5.2 Run targeted lint/type validation for touched news outlet form, action/definition, page, and rule files.
- [ ] 5.3 Smoke check create/edit form rendering when a local authenticated browser session is available.
