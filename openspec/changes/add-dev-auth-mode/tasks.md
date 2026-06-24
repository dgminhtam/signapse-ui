## 1. Auth Mode Boundary

- [ ] 1.1 Add a server-only helper that returns true only for `SIGNAPSE_AUTH_MODE=disabled` outside production.
- [ ] 1.2 Update `proxy.ts` to keep locale handling but skip Clerk protection when development auth mode is enabled.
- [ ] 1.3 Update protected app auth checks so dashboard routes and the landing page treat development auth mode as authenticated.
- [ ] 1.4 Update `/api/user` to return a minimal development user response when development auth mode is enabled and no Clerk session exists.

## 2. Backend Request Auth

- [ ] 2.1 Update authenticated backend fetch helpers to omit `Authorization` when development auth mode is enabled.
- [ ] 2.2 Update the market chart live SSE proxy to omit Clerk token lookup and bearer headers when development auth mode is enabled.
- [ ] 2.3 Keep existing Clerk token behavior unchanged when development auth mode is disabled.

## 3. Development Permissions

- [ ] 3.1 Return wildcard development permissions from the server permission helper when development auth mode is enabled.
- [ ] 3.2 Update shared permission helpers so wildcard permissions pass specific permission checks.
- [ ] 3.3 Replace dashboard-blocking direct `permissions.includes(...)` checks with shared permission helpers where needed.

## 4. Documentation And Verification

- [ ] 4.1 Document `SIGNAPSE_AUTH_MODE=disabled` in local environment guidance.
- [ ] 4.2 Run `openspec validate add-dev-auth-mode --strict`.
- [ ] 4.3 Run `pnpm typecheck`.
- [ ] 4.4 Run `pnpm lint`.
- [ ] 4.5 Run static search to confirm production guard usage and identify any remaining direct permission checks that should not block development auth mode.
