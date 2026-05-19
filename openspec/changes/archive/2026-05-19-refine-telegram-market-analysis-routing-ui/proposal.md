## Why

The first Telegram UI shell renders scheduled market analysis as a separate section, but the user review showed that schedule management belongs to the market analysis feature route. Keeping it separate makes operators scan two parts of the page to understand one workflow.

## What Changes

- Move the scheduled market analysis schedule surface into the `SCHEDULED_MARKET_ANALYSIS` route area inside feature routing.
- Keep bot connections and destinations as shared Telegram infrastructure sections.
- Treat feature routing as the main workflow management area: each route shows its destination and enabled state, while scheduled market analysis also owns its schedule list and schedule form entry point.
- Update readiness and loading hierarchy so market analysis scheduling reads as part of routing health, not as a fourth peer-level setup area.
- Preserve the UI-only boundary: no Telegram API actions, route handlers, live mutations, success toasts, or webhook exposure.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `telegram-configuration-ui`: refine the Telegram configuration hierarchy so scheduled market analysis schedules are managed inside the scheduled market analysis route rather than as a standalone page section.

## Impact

- Affects the Telegram UI shell under `app/(main)/telegram`.
- Affects the Telegram configuration UI spec and tasks only; no backend API contract changes.
- Does not change shared shadcn primitives, global theme tokens, permissions, navigation shape, or Telegram API mapping.
