## Context

The protected Signapse app is routed through `app/[lang]/(main)/layout.tsx`. This layout already performs Clerk authentication, loads the current user for the sidebar footer, provides the sidebar/header shell, and supplies i18n context. The account profile page should live inside the `(main)` route group so it inherits that protected shell while exposing the runtime URL `/{lang}/account`.

The sidebar user dropdown already renders account, billing, notifications, and sign-out menu items. The account item exists as a non-navigating `DropdownMenuItem`; it should become the entry point to the new profile screen through `LocalizedLink` so locale routing is preserved.

The current backend user response type includes `email`, `firstName`, `lastName`, `mainImage`, workspace summary, and permissions. It also includes `role_name` for the current user's role classification.

## Goals / Non-Goals

**Goals:**

- Add a protected account profile page under `app/[lang]/(main)/account/`.
- Let signed-in users reach the page from the existing avatar account menu.
- Present account content as two tabs: personal information and billing.
- Provide a personal information edit form for avatar, full name, date of birth, disabled email, phone number, and role classification.
- Treat full name, date of birth, email, and phone number as required profile information.
- Keep email disabled and exclude it from profile update requests.
- Extend the user profile contract with `dateOfBirth`, `phoneNumber`, and `role_name`.
- Show an upgrade account button next to the role classification.
- Use existing Signapse form shell, shadcn wrappers, i18n dictionaries, sonner toast, and route localization helpers.

**Non-Goals:**

- Do not create a public account route outside `[lang]/(main)`.
- Do not add billing provider integration, billing settings, invoices, plans, or payment methods.
- Do not implement a real upgrade checkout or subscription-management flow in this change.
- Do not implement email editing or Clerk email verification flows.
- Do not implement avatar upload/crop/delete unless an existing user avatar endpoint is available; the MVP can display the current avatar and keep upload as follow-up scope.
- Do not add permission-gated sidebar navigation for account; the route is available to any authenticated user.

## Decisions

### Place the account screen in the protected route group

The route files should be created under:

```text
app/[lang]/(main)/account/
├── page.tsx
├── error.tsx
├── account-profile-form.tsx
└── account-billing-placeholder.tsx
```

This matches the project's protected feature route pattern. The runtime URL remains `/{lang}/account` because `(main)` is a route group, not a URL segment.

### Use sidebar avatar menu as the entry point

The existing account menu item in `components/app-sidebar.tsx` should navigate to `/account` through `LocalizedLink`. The menu item should keep shadcn dropdown composition rules, including `DropdownMenuItem` inside `DropdownMenuGroup`, and preserve locale with the existing localized link helper.

The billing menu item can remain non-functional until billing scope is defined, or later link to `/account?tab=billing` if tab URL state is explicitly desired. This change only requires the account item to enter the profile screen.

### Keep page composition cardless with a focused form surface

`account/page.tsx` should be a Server Component that fetches initial profile data and renders the account workspace directly in the `(main)` layout content area. It should not add a main Card shell that repeats breadcrumb identity.

The personal information tab should use `AppFormShell`, `AppFormShellBody`, and `AppFormShellFooter` as the focused edit surface. Fields should use `FieldGroup`, `Field`, `FieldLabel`, `FieldError`, and existing input/button/spinner wrappers.

### Add contact fields and roles to user profile data

The backend user response should include:

```ts
dateOfBirth: string | null
phoneNumber: string | null
role_name: string | null
```

The update request should only send editable profile fields:

```ts
interface UpdateUserProfileRequest {
  fullName: string
  dateOfBirth: string
  phoneNumber: string
}
```

Email remains part of the response and form display, but not part of the update request.

The role name is display-only in the profile form. The UI should render `role_name` returned by `/me`; it should not derive the user's role from permissions on the client. If no role is returned, the form should show a localized fallback such as "Chưa có vai trò".

### Treat email as required but disabled

The email field should render as required account information but use `disabled`. The user should not be able to focus or edit it from this form. If explanatory copy is needed, keep it short and decision-useful, for example explaining that login email cannot be changed here.

Validation should require a non-empty valid email in loaded data, but submit validation should not attempt to update email.

### Show role classification with an upgrade CTA

The personal information tab should show the current user's role classification near the identity/contact fields. This value should be read-only and should not be submitted with profile edits.

An upgrade account button should be rendered next to the role classification. For the MVP, the button can switch focus to the billing tab or link to the billing area once tab URL state is chosen. It should not start a fake checkout, mutate the role locally, or imply a completed upgrade when no billing backend exists.

### Use one full-name field in the UI

The user-facing form should expose `Họ tên` as one required field. If the backend continues to persist `firstName` and `lastName`, the action boundary should either split the submitted full name or the backend should accept `fullName` and own that mapping. The frontend should avoid exposing separate first-name and last-name fields because the requested UI is a single full-name field.

### Keep billing as a placeholder tab only

The billing tab should exist so users can enter the area from the tab list or upgrade button, but it should render a simple empty state. It should not introduce placeholder controls, fake billing data, hardcoded future promises, or payment provider assumptions.

## Risks / Trade-offs

- Backend contract may not yet support `dateOfBirth`, `phoneNumber`, `role_name`, or profile update -> Keep the frontend action boundary narrow and fail with localized server-action errors until backend support exists.
- Full-name mapping can be lossy if backend only stores first and last names -> Prefer a backend `fullName` update contract, or use a documented simple split at the action boundary as an interim implementation.
- Avatar editing can become a separate media workflow -> Display avatar in this change and only add upload if a compatible endpoint already exists.
- Disabled email must still be understandable as account identity information -> Use the disabled input state, exclude it from submit mapping, and keep concise helper text if needed.
- Upgrade CTA needs a target before real billing exists -> Route it to the billing tab/area only, and keep the billing content as an empty state until product scope is defined.
- Tabs may lose state on reload if implemented purely client-side -> Accept default personal tab for MVP unless product requires URL-addressable billing tab.

## Migration Plan

1. Extend user profile TypeScript definitions with `dateOfBirth`, `phoneNumber`, `role_name`, and update request/result types.
2. Add or update server actions for reading `/me` and updating editable profile fields through `fetchAuthenticated()`.
3. Create the protected account route files under `app/[lang]/(main)/account/`.
4. Build the tabbed account page with the personal form, role display, upgrade CTA, and billing empty state.
5. Wire the sidebar account menu item to `/account` with locale-preserving navigation.
6. Add dictionary copy and breadcrumb segment mapping for account/profile labels.
7. Verify shadcn composition, i18n usage, accessibility basics, lint, typecheck, and OpenSpec validation when the CLI is available.

## Open Questions

- Should the account billing tab be URL-addressable with a query parameter such as `?tab=billing`, or is in-page tab state enough for the first version?
- Will the backend accept `fullName`, or should the frontend split the submitted full name into `firstName` and `lastName` until the backend contract changes?
- Is avatar upload in scope for the first implementation, or should the first version display the existing avatar only?
- None.
