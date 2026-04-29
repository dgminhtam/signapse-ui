## Why

Backend now exposes event market reaction derivation APIs and returns `marketReactions[]` on event detail responses, but the frontend still only presents evidence, assets, and themes. Operators need a clear way to see what each event implies for market assets, directions, horizons, confidence, and reasoning without digging through technical response data.

## What Changes

- Add frontend contract support for event market reactions, including direction and time horizon enums, summary DTOs, single-event derivation result, and pending batch derivation result.
- Add an event detail section named "Tác động thị trường" that renders `marketReactions[]` as scannable market-impact cards.
- Add a detail action to derive market reactions for the current event, with pending state, permission gating, refresh, and Vietnamese toast summary.
- Add a list-level batch action to derive pending market reactions, without adding market reaction columns to the event list until the list API provides summary fields.
- Add `EVENT_MARKET_REACTION_DERIVATION` to the system prompt type options, label, and workflow grouping.
- Keep the existing simplified event hierarchy: evidence and core facts stay prominent; assets, themes, and technical metadata remain lower-priority supporting information.

## Capabilities

### New Capabilities

- `event-market-reactions-ui`: Surface backend-derived event market reactions in the Events UI and expose operator actions to derive them.

### Modified Capabilities

- None.

## Impact

- API actions: `app/api/events/action.ts`
- Event types and presentation helpers: `app/lib/events/definitions.ts`, `app/(main)/events/event-presentation.ts`
- Event permissions: `app/lib/events/permissions.ts`
- Event list and detail UI: `app/(main)/events/*`
- System prompt definitions: `app/lib/system-prompts/definitions.ts`
- Documentation alignment: `docs/APIMAPPING.md`
