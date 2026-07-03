## Context

Signapse UI is a protected dashboard. Auth currently exists at several layers: Clerk route protection in `proxy.ts`, server auth checks in app pages/routes, `getClerkToken()` before backend API calls, and permission gates derived from `/me`.

For local feature development, backend auth may be disabled while frontend Clerk remains active. That creates a half-disabled state where direct backend calls work, but the dashboard still redirects to sign-in or fails before reaching backend APIs.

## Goals / Non-Goals

**Goals:**

- Add one server-side env switch for no-login local dashboard development.
- Keep the switch inert in production.
- Let protected dashboard routes render without a Clerk session.
- Let backend API calls and SSE proxy requests omit Clerk bearer tokens while the switch is enabled.
- Let permission-gated navigation and pages open in dev mode without maintaining a fake permission list.

**Non-Goals:**

- Do not add browser-visible auth secrets or public backend token handling.
- Do not mock backend data in the frontend.
- Do not change production Clerk behavior.
- Do not add a new auth provider, dependency, or user management abstraction.

## Decisions

### Use one server-only auth mode env var

Use a single variable such as `SIGNAPSE_AUTH_MODE=disabled`, interpreted only on the server and only when `NODE_ENV !== "production"`.

Alternative considered: multiple booleans such as `DISABLE_CLERK`, `DISABLE_BACKEND_AUTH`, and `DEV_PERMISSIONS`. This is easier to misconfigure and can recreate the current half-disabled failure mode.

### Centralize the mode check

Add a tiny helper that exposes whether dev auth mode is enabled. Use it from the proxy, auth helper, layout/page checks, user API route, and SSE proxy.

Alternative considered: read `process.env` directly in each file. That is shorter per file but spreads the production guard and makes future behavior drift likely.

### Reuse existing backend fetch paths

Keep `fetchAuthenticated()` as the caller-facing API. In dev auth mode it should call the same `apiFetch()` path without adding `Authorization`; outside dev mode it should keep using Clerk tokens.

Alternative considered: make feature code choose between `fetchAuthenticated()` and `fetchPublic()`. That would touch many callers and makes future features easier to wire incorrectly.

### Use wildcard permissions for dev mode

Represent dev permissions as `["*"]`, and update shared permission helpers so `hasPermission()` and `hasAnyPermission()` treat it as all permissions. Replace direct `permissions.includes(...)` checks in app code that block dashboard access with `hasPermission()`.

Alternative considered: maintain a full hard-coded permission list. That list will go stale whenever backend permissions change.

### Keep dev user minimal

When no Clerk session exists in dev auth mode, provide a minimal display user for layout/sidebar and a minimal `/api/user` response. Pages that need profile fields should prefer backend `/me` data when available and otherwise use harmless dev placeholders.

Alternative considered: fully emulate Clerk's `currentUser()` shape. That adds unnecessary surface area and still would not match Clerk exactly.

## Risks / Trade-offs

- [Risk] Dev auth mode could accidentally be enabled in production. -> Mitigation: force disabled behavior to require `NODE_ENV !== "production"`.
- [Risk] Some feature still uses `permissions.includes(...)` directly and remains hidden in dev mode. -> Mitigation: replace direct gate checks touched by dashboard/page access with `hasPermission()`, then run static search for remaining direct permission checks.
- [Risk] Backend endpoints may still require auth when frontend omits tokens. -> Mitigation: this mode is intended for local paired frontend/backend development; backend auth must also be disabled or supply dev identity behavior.
- [Risk] Mutating features may run as a dev backend identity. -> Mitigation: keep the mode opt-in and local-only.

## Migration Plan

1. Add the dev auth mode helper.
2. Wire the helper into route protection and server auth checks.
3. Wire backend fetches and SSE proxy to omit bearer tokens in dev auth mode.
4. Add wildcard permission behavior and replace blocking direct permission includes.
5. Document the env variable in local environment guidance.
6. Verify production mode still requires Clerk and dev mode opens the dashboard without login.

Rollback is removing the env variable or setting any value other than `disabled`; production behavior is unchanged by design.

## Open Questions

- Should backend `/me` return a local dev identity when backend auth is disabled, or should frontend provide a fallback only when `/me` fails?
