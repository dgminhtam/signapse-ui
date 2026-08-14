## Why

Signapse currently duplicates Clerk account provisioning through a thin dashboard form that adds no application-specific onboarding value. Public Clerk registration is enabled, Clerk Dashboard remains available for exceptional testing accounts, and every supported creation source already provisions the Signapse user through the existing `user.created` webhook.

## What Changes

- **BREAKING** Remove the `Tạo người dùng` action and Clerk account creation dialog from Signapse user management.
- Remove the Signapse server action that calls Clerk's user creation API and its create-only request types, validation branches, messages, and error handling.
- Keep the protected user management route, user search/list, and application-user update flow unchanged.
- Treat public Clerk registration as the normal account creation path and Clerk Dashboard as the manual path for testing or exceptional administration.
- Preserve backend provisioning through the existing Clerk `user.created` webhook for both supported account creation paths.
- Do not introduce invitations, approval, initial role/workspace assignment, or a dedicated `/sign-up` route.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `user-management`: Remove the requirement for authorized operators to create Clerk accounts from the Signapse dashboard while retaining user access control, search, inspection, and update behavior.

## Impact

- Affects the `/users` toolbar and user form dialog under `app/[lang]/(main)/users/`.
- Affects the Clerk-backed create action in `app/api/user/action.ts`, create-only definitions in `app/lib/users/definitions.ts`, and related Vietnamese/English dictionary entries.
- Modifies the `user-management` specification to remove dashboard account creation scenarios and create-oriented empty-state guidance.
- Does not change Clerk authentication dependencies, public registration configuration, backend APIs, the Clerk webhook contract, user update permissions, or role/workspace behavior.
- Removes one server-side use of `CLERK_SECRET_KEY`; Clerk authentication continues to require the existing Clerk configuration.
