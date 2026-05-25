## Why

Authenticated users currently have an avatar menu in the sidebar with an account item, but that item does not take them to a dedicated profile screen. Users need a protected account profile area where they can review and maintain required personal information without leaving the main Signapse shell.

The profile form also needs backend contract support for date of birth and phone number. Email should be visible because it is required identity information, but it should remain disabled because the login identity is managed by Clerk/backend authentication.

## What Changes

- Add a protected account profile route under `app/[lang]/(main)/account/`.
- Wire the existing sidebar avatar menu account item to the account route using locale-preserving navigation.
- Add a tabbed account screen with personal information and billing sections.
- Add a personal information form for avatar, full name, date of birth, disabled email, phone number, and role classification.
- Extend the user profile contract with `dateOfBirth`, `phoneNumber`, and `role_name`.
- Add a profile update request that updates full name, date of birth, and phone number only.
- Add an upgrade account button near the role classification while keeping payment/billing implementation out of scope.
- Add a billing tab placeholder without billing fields, billing APIs, or fake billing data.

## Capabilities

### New Capabilities
- `user-account-profile`: Enables authenticated users to open and maintain their own profile from the sidebar avatar account menu.

### Modified Capabilities
- None.

## Impact

- Affects account/profile route files under `app/[lang]/(main)/account/`.
- Affects sidebar user menu behavior in `components/app-sidebar.tsx`.
- Affects user API and type definitions under `app/api/user/` and `app/lib/users/`.
- Requires localized Vietnamese and English dictionary copy for labels, validation messages, tabs, actions, role classification, upgrade CTA, and placeholder content.
- Requires shadcn wrapper composition for tabs, form fields, avatar, empty state, buttons, and spinner.
- Does not add payment provider integration, billing contract, avatar upload flow, or email editing.
