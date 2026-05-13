## Context

The Telegram configuration UI now exists as a cardless settings workspace with local fixtures. Backend documentation and `docs/APIMAPPING.md` expose the actual API surface for the same concepts: bot connections, verified destinations, feature settings, market analysis schedules, and a backend-only webhook. The product decision for now is to keep the multi-bot backend contract rather than simplifying the UI to a single bot.

The current route allows access when the user has any Telegram read permission. API integration therefore cannot assume that every Telegram read endpoint is callable for every authorized viewer.

## Goals / Non-Goals

**Goals:**

- Replace Telegram UI fixtures with authenticated backend data.
- Add typed Telegram DTOs, request schemas, and server actions that match `docs/api_mapping.json`.
- Preserve the existing multi-bot UI and nested scheduled market analysis hierarchy.
- Support real create/update/disable/delete flows with pending states, toasts, refresh/revalidation, and destructive confirmations.
- Keep partial-permission behavior graceful: sections without read permission should not break the whole page.
- Keep webhook endpoints and Telegram Bot API `Update` schemas out of the frontend admin surface.

**Non-Goals:**

- Do not change backend endpoint paths, request shapes, or ownership semantics.
- Do not switch to a single-bot UI model.
- Do not add delivery logs or notification history.
- Do not add a wizard, tabs, or a separate Telegram details page.
- Do not edit shared shadcn primitives or global theme tokens.

## Decisions

1. Keep the backend multi-bot contract in the UI.

   `GET /telegram/bot-connections` returns an array, and destinations are scoped to a bot connection. The UI should continue to render bot connections as a list. Alternative considered: collapse to a single current bot panel. That would hide backend-supported state and force awkward client-side selection rules before the product and API contract are changed.

2. Add a dedicated Telegram server action module.

   Create `app/api/telegram/action.ts` for all Telegram reads and mutations. This follows existing Signapse feature patterns, keeps `fetchAuthenticated()` calls server-side, and gives each mutation a typed `ActionResult`. Alternative considered: calling route handlers from the client. That would duplicate auth behavior and fight the existing App Router conventions in this repo.

3. Put Telegram DTOs and Zod schemas in `app/lib/telegram/definitions.ts`.

   The existing `permissions.ts` should remain focused on permission constants. Definitions should include response DTOs, request DTOs, status/feature enums, Zod schemas, and UI helper types when needed. Alternative considered: keep these in the component. That would make forms and actions harder to reuse and test.

4. Load data by permission, not as one all-or-nothing bundle.

   The page access gate uses any Telegram read permission, but individual endpoints require their own read permissions. The server component should conditionally fetch each collection only when the user has that permission and pass unavailable section state to the client. Alternative considered: `Promise.all` over all Telegram reads. That would fail for users who can read one Telegram area but not another.

5. Treat current workspace as the operating scope for feature routes and schedules.

   Feature settings and schedules include `workspaceId`. The Telegram page should resolve the current workspace using existing workspace helpers and filter or prefill workspace-scoped data accordingly. Scheduled market analysis should use the current workspace watchlist for asset selection. Alternative considered: expose workspace as a broad selector inside every Telegram form. That would add density and conflict with the existing workspace switcher model.

6. Keep route updates constrained by the backend request shape.

   `UpdateTelegramFeatureSettingRequest` requires `featureKey`, `workspaceId`, and `destinationId`; `enabled` is optional. The UI should only enable route mutations when it has a current workspace and an active destination. Disabling an existing route can reuse its current destination. If a route has no destination, the switch remains blocked until a destination is selected. Alternative considered: allow clearing destination or toggling without a destination. The documented request schema does not support that safely.

7. Make destination linking an explicit refresh flow.

   Creating a link token returns `startCommand` and `expiresAt`; the destination appears only after the user completes the Telegram `/start` flow through the bot. The UI should show the command, allow copying it, and provide a refresh action or refresh on close rather than pretending the destination exists immediately. Alternative considered: optimistic destination creation. That would misrepresent a webhook-dependent verification flow.

## Risks / Trade-offs

- Partial permissions can create empty-looking sections -> Mitigate with section-level access-limited states and disabled actions instead of throwing page-level errors.
- Backend may return arrays spanning multiple workspaces -> Mitigate by filtering feature settings and schedules to the current workspace while keeping bot/destination infrastructure global to the user.
- Link-token verification happens outside the app -> Mitigate with clear copy, command copy affordance, expiration display, and a refresh action.
- Schedule form needs workspace assets -> Mitigate by reusing `getWorkspaceWatchlistAssets` for the current workspace and by showing a blocked/empty state when the workspace has no watchlist assets.
- Feature setting request requires `destinationId` -> Mitigate by disabling toggle/update controls until a valid active destination is selected.
- Full repo lint currently has unrelated existing failures -> Mitigate by running typecheck and targeted lint for Telegram files, and report broader lint status if it remains blocked outside this change.
