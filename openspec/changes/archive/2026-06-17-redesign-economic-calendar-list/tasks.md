## 1. Data Shaping And Row Model

- [x] 1.1 Add a narrow client-side grouping helper for economic calendar entries by localized scheduled day, including a fallback group for missing scheduled timestamps.
- [x] 1.2 Add row-level helpers for scheduled time, primary value display, secondary technical metadata, and expansion eligibility using the existing frontend contract.
- [x] 1.3 Preserve existing search, sync, sort, page size, pagination, permissions, and canonical detail route behavior.

## 2. Calendar-first List UI

- [x] 2.1 Recompose `EconomicCalendarList` to render grouped day headers and compact event rows inside the existing shared list table surface.
- [x] 2.2 Reorder row content so scheduled time, currency, impact, title/status, actual, forecast, and previous values are the dominant scanning fields.
- [x] 2.3 Remove or demote primary-row technical metadata that competes with market calendar data, while keeping necessary detail access available.
- [x] 2.4 Keep unsupported UI out of scope: no category tabs, country flag system, daily aggregate cards, or realtime countdown controls.

## 3. Expandable Event Support

- [x] 3.1 Add local row expansion state for entries with available supporting content.
- [x] 3.2 Render concise expanded supporting content without widening the table or nesting page shells/cards.
- [x] 3.3 Include a localized action from expanded content to the canonical economic calendar detail page.

## 4. Localization, Loading, And Empty States

- [x] 4.1 Add or update dictionary keys for new labels, expansion actions, fallback group text, and accessible control names in all supported locales.
- [x] 4.2 Update the list skeleton to mirror the grouped day header and event row layout.
- [x] 4.3 Confirm the empty state still uses the shared empty/table surface and does not add redundant page identity copy.

## 5. Verification

- [x] 5.1 Run `openspec validate redesign-economic-calendar-list --strict`.
- [x] 5.2 Run `pnpm lint` or the repo slash-command equivalent.
- [x] 5.3 Run `pnpm typecheck` or the repo slash-command equivalent.
- [x] 5.4 Perform static review for hardcoded UI copy, locale-preserving links, shadcn composition drift, table width handling, and skeleton/layout mismatch.

Note: full `pnpm lint` was run and still fails on an unrelated existing `components/logo.tsx` React Hooks error. Targeted lint for `app/[lang]/(main)/economic-calendar/economic-calendar-list.tsx` and `app/[lang]/(main)/economic-calendar/page.tsx` passes.
