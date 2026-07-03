## Why

Developers need to work across the protected dashboard without signing in or wiring Clerk tokens while backend auth is disabled locally. The current app still enforces Clerk in the Next proxy, app layout, API helpers, and permission checks, so disabling backend auth alone leaves the dashboard partially blocked.

## What Changes

- Add a server-side development auth mode controlled by an environment variable.
- When enabled outside production, skip Clerk route protection and treat protected dashboard pages as signed in.
- Stop sending Clerk bearer tokens to the backend while dev auth mode is enabled.
- Provide a dev permission path that lets dashboard navigation and feature gates open without a real `/me` identity.
- Keep production behavior unchanged even if the variable is accidentally set.

## Capabilities

### New Capabilities

- `dev-auth-mode`: Development-only auth bypass for local dashboard work without Clerk login.

### Modified Capabilities

- None.

## Impact

- Affected code: `proxy.ts`, auth API helpers, protected app layout, landing auth state, user API route, permission helpers, and the market chart SSE proxy.
- Affected behavior: local development can opt into a no-login dashboard mode; production remains Clerk-protected.
- No new dependencies.
