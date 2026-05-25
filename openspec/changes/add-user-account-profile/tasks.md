## 1. User Profile Contract

- [x] 1.1 Extend `BackendMeResponse` with `birthDay`, `phoneNumber`, and `role_name`.
- [x] 1.2 Add a profile update request type that includes `firstName`, `lastName`, `birthDay`, and `mobilePhone`, excluding email.
- [x] 1.3 Add or update user server actions to submit editable profile fields through `fetchAuthenticated()` and return localized action errors.
- [x] 1.4 Add role display fallback when `role_name` is empty.

## 2. Account Route And Navigation

- [x] 2.1 Create `app/[lang]/(main)/account/page.tsx` as a protected Server Component that loads initial profile data.
- [x] 2.2 Create `app/[lang]/(main)/account/error.tsx` for local account route errors.
- [x] 2.3 Wire the existing sidebar avatar menu account item to `/account` using locale-preserving navigation.
- [x] 2.4 Add account breadcrumb/dictionary entries without hardcoded user-facing copy in components, including role classification and upgrade CTA copy.

## 3. Personal Information Form

- [x] 3.1 Build `account-profile-form.tsx` with `AppFormShell`, `FieldGroup`, shadcn form controls, Zod validation, sonner toast, and pending submit spinner.
- [x] 3.2 Render avatar from the current profile image/Clerk fallback without adding upload behavior unless an existing compatible endpoint is available.
- [x] 3.3 Make first name, last name, date of birth, and phone number required and editable.
- [x] 3.4 Render email as required account information but disabled, and exclude email from the update request.
- [x] 3.5 Add a cancel action with `variant="ghost"` that resets the form to initial profile data.
- [x] 3.6 Render role classification as read-only profile information and keep it out of the update request.
- [x] 3.7 Add an upgrade account button next to role classification that opens or navigates to the billing area without starting a fake checkout.

## 4. Billing Placeholder Tab

- [x] 4.1 Add tabs for personal information and billing using existing shadcn tab wrappers.
- [x] 4.2 Add `account-billing-placeholder.tsx` with an `<Empty>` placeholder and no billing API, form, or fake billing data.
- [x] 4.3 Ensure the upgrade account button can take the user to the billing placeholder area.
- [x] 4.4 Keep tab layout responsive without page-level horizontal overflow.

## 5. Verification

- [x] 5.1 Attempt `openspec validate add-user-account-profile --strict`; OpenSpec CLI is not available in PATH.
- [x] 5.2 Run typecheck.
- [x] 5.3 Run lint.
- [x] 5.4 Static-review account/profile source for locale-preserving links, no hardcoded UI copy, disabled email submit exclusion, read-only role submit exclusion, shadcn wrapper composition, and `(main)` route placement.

User-owned manual QA note: confirm the backend profile update endpoint persists request fields `birthDay` and `mobilePhone`, and that `/me` returns `role_name`, once backend support is available.
