## Why

The Telegram configuration screen is currently a UI-only review shell, while the backend already exposes bot connection, destination, feature routing, and scheduled market analysis APIs. This change makes the screen operational by replacing local fixtures with authenticated API data and real mutations while preserving the existing multi-bot backend contract.

## What Changes

- Add Telegram DTO definitions, Zod validation schemas, and server actions for bot connections, destinations, link-token generation, feature settings, and market analysis schedules.
- Load Telegram configuration data from backend APIs in the `/telegram` route, gated by each Telegram read permission so partial access does not break the page.
- Replace local UI fixtures with backend responses while keeping the current information architecture: bot connections, destinations, and feature routing with scheduled market analysis nested under `SCHEDULED_MARKET_ANALYSIS`.
- Wire create/update/disable/delete mutations for bot connections, destinations, and schedules with real pending states, `sonner` success/error toasts, route refresh, and destructive `AlertDialog` confirmations.
- Wire feature-route updates through `PUT /telegram/feature-settings`, including destination selection and enabled state where the backend request can be formed safely.
- Implement the destination link-token flow by calling `POST /telegram/destinations/link-token`, displaying the returned `/start <token>` command and expiration, and refreshing destinations after the user completes Telegram verification.
- Keep `/webhooks/telegram/{connectionId}` backend-only and do not expose it as a frontend control.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `telegram-configuration-ui`: make the existing Telegram configuration UI API-backed instead of fixture-backed, while preserving the BE multi-bot model and current UI hierarchy.

## Impact

- Affects `app/(main)/telegram` and new/updated Telegram API and definition modules.
- Uses existing `fetchAuthenticated()`, `ActionResult`, `revalidatePath`, `sonner`, shadcn/ui, and Signapse app-level surfaces.
- May use existing workspace and watchlist APIs to populate workspace and asset choices for scheduled market analysis.
- Does not change backend endpoints, global theme tokens, shared `components/ui`, navigation route shape, or webhook behavior.
