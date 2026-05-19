## Why

Time-related metadata is currently rendered with mixed hierarchy across list tables, detail cards, drawers, and supporting panels. Many of these fields use `text-sm`, `font-medium`, or card value styling, making audit/supporting timestamps compete with primary entity content.

## What Changes

- Standardize every visible time metadata field to one compact presentation pattern.
- Ensure every visible time metadata field includes an icon.
- Reduce all time metadata icons to `size-3`.
- Use muted, compact typography for supporting time fields so they read as metadata rather than primary facts.
- Normalize table, detail, quick drawer, dashboard, market query, and Telegram configuration time metadata where applicable.
- Add the time metadata presentation rule to `AGENTS.md` so future screens do not drift.
- Preserve existing date/time values, formatting functions, route behavior, sorting, filtering, and backend contracts.
- Do not modify shadcn core components under `components/ui`.

## Capabilities

### New Capabilities

- `time-metadata-presentation`: Defines app-wide presentation requirements for rendered time metadata fields.

### Modified Capabilities

- None.

## Impact

- Affected shared/app components may include a new app-level helper outside `components/ui` for time metadata composition.
- Affected list/detail surfaces include events, news articles, economic calendar, blogs, cronjobs, AI provider configs, news outlets, system prompts, market query, dashboard technical details, quick detail drawer content, and Telegram configuration preview tables.
- Affected documentation: `AGENTS.md` must include the rule for compact icon-bearing time metadata.
- No API, DTO, permission, routing, query parameter, dependency, or shadcn primitive changes are expected.
