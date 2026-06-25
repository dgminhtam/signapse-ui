## 1. Auth Mode Boundary

- [x] 1.1 Add a server-only helper that returns true only for `SIGNAPSE_AUTH_MODE=disabled` outside production.
- [x] 1.2 Update `proxy.ts` to keep locale handling but skip Clerk protection when development auth mode is enabled.
- [x] 1.3 Update protected app auth checks so dashboard routes and the landing page treat development auth mode as authenticated.
- [x] 1.4 Update `/api/user` to return a minimal development user response when development auth mode is enabled and no Clerk session exists.

## 2. Backend Request Auth

- [x] 2.1 Update authenticated backend fetch helpers to omit `Authorization` when development auth mode is enabled.
- [x] 2.2 Update the market chart live SSE proxy to omit Clerk token lookup and bearer headers when development auth mode is enabled.
- [x] 2.3 Keep existing Clerk token behavior unchanged when development auth mode is disabled.

## 3. Development Permissions

- [x] 3.1 Return wildcard development permissions from the server permission helper when development auth mode is enabled.
- [x] 3.2 Update shared permission helpers so wildcard permissions pass specific permission checks.
- [x] 3.3 Replace dashboard-blocking direct `permissions.includes(...)` checks with shared permission helpers where needed.

## 4. Documentation And Verification

- [x] 4.1 Document `SIGNAPSE_AUTH_MODE=disabled` in local environment guidance.
- [x] 4.2 Run `openspec validate add-dev-auth-mode --strict`.
- [x] 4.3 Run `pnpm typecheck`.
- [x] 4.4 Run `pnpm lint`.
- [x] 4.5 Run static search to confirm production guard usage and identify any remaining direct permission checks that should not block development auth mode.
