## 1. Copy Polish

- [x] 1.1 Replace mojibake and unaccented Vietnamese in `app/(main)/news-outlets/news-outlet-form.tsx` title and description copy.
- [x] 1.2 Replace mojibake and unaccented Vietnamese in form validation messages, field labels, helper text, toast messages, submit pending text, submit labels, and cancel label.
- [x] 1.3 Review adjacent create/edit page copy only if it is part of the same visible form surface, without changing route semantics or permissions.

## 2. Accessible Validation State

- [x] 2.1 Add `aria-invalid={fieldState.invalid}` to each news outlet `Input` controlled by validation state.
- [x] 2.2 Add `aria-invalid={fieldState.invalid}` to the description `Textarea`.
- [x] 2.3 Confirm existing `Field data-invalid` and `FieldError` wiring remains intact.

## 3. Verification

- [x] 3.1 Search the news outlet form surface for remaining mojibake or unaccented Vietnamese user-facing strings.
- [x] 3.2 Run targeted lint/type validation for touched news outlet form files.
- [x] 3.3 Manual QA transferred out of the agent-owned archive gate.
  User-owned manual QA: Smoke check the create/edit form rendering when a local authenticated browser session is available, focusing on copy wrapping and validation state.
