## Why

The backend now exposes Telegram configuration surfaces, but the frontend needs a deliberate UI shape before API integration begins. A UI-only shell lets the team review information hierarchy, navigation, empty states, and interaction intent without committing to request handling or backend mutations yet.

## What Changes

- Add a Telegram configuration UI shell under the settings area.
- Present the four Telegram configuration concepts in one cardless workspace: bot connections, verified destinations, feature routing, and scheduled market analysis.
- Use existing Signapse/shadcn patterns: shared list toolbar/table surfaces, focused form shell, badges, switches only where the backend supports enabled routing, `AlertDialog` for destructive actions, and professional Vietnamese UI copy.
- Provide loading, empty, blocked, and permission-aware states that mirror the final layout.
- Keep all Telegram API integration out of scope: no `app/api/telegram/action.ts`, no `fetchAuthenticated()` calls to Telegram endpoints, no mutation wiring, and no live backend DTO parsing.
- Use temporary UI-only fixtures or static empty states only where needed to make the shell reviewable.

## Capabilities

### New Capabilities

- `telegram-configuration-ui`: Covers the frontend UI shell, route structure, state hierarchy, and visual/interaction model for configuring Telegram delivery before backend API integration.

### Modified Capabilities

None.

## Impact

- Affected frontend areas: settings navigation, a new Telegram page under `app/(main)`, local Telegram UI components, skeletons, and UI-only fixtures/placeholders.
- Affected shared components: none expected; the implementation should compose existing app-level and shadcn primitives.
- API impact: none. Backend Telegram endpoints remain documented but uncalled by this change.
- Docs impact: none required beyond this OpenSpec change; `docs/APIMAPPING.md` remains the API ledger.
