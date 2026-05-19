## 1. Contract And Presentation Mapping

- [x] 1.1 Add market reaction DTOs, direction/time horizon enums, derivation result DTOs, and optional `marketReactions` support to `app/lib/events/definitions.ts`.
- [x] 1.2 Add Vietnamese labels and presentation helpers for market reaction direction, time horizon, confidence, and derivation toast summaries.
- [x] 1.3 Add `EVENT_MARKET_REACTION_DERIVATION` to system prompt type options, labels, and workflow grouping.
- [x] 1.4 Add or centralize market reaction derivation permission constants in `app/lib/events/permissions.ts`.

## 2. API Actions

- [x] 2.1 Add `deriveEventMarketReactions(id)` server action for `POST /events/{id}/derive-market-reactions` with `ActionResult` error handling and event route revalidation.
- [x] 2.2 Add `derivePendingEventMarketReactions(batchSize?)` server action for `POST /events/derive-pending-market-reactions` with optional `batchSize` query and list/detail revalidation.
- [x] 2.3 Ensure new actions continue using `fetchAuthenticated()` and safe user-facing Vietnamese fallback errors.

## 3. Event Detail UI

- [x] 3.1 Add a permission-gated market reaction derive button on event detail with spinner, disabled pending state, toast summary, and `router.refresh()`.
- [x] 3.2 Add a "Tác động thị trường" section after evidence and before assets/themes that renders market reaction cards.
- [x] 3.3 Add a purposeful empty state for events without market reactions.
- [x] 3.4 Update the event detail skeleton so loading layout mirrors the final market reaction section.

## 4. Event List Batch Action

- [x] 4.1 Add a permission-gated batch market reaction derive button to the event list toolbar leading action group.
- [x] 4.2 Keep existing event list table columns unchanged because `GET /events` does not expose market reaction summary fields.
- [x] 4.3 Show batch result toast summaries for zero selected, partial success, neutral results, skipped items, and failures.

## 5. Documentation And Verification

- [x] 5.1 Update `docs/APIMAPPING.md` so event market reaction endpoints, `marketReactions[]`, and system prompt enum drift are marked integrated.
- [x] 5.2 Run the appropriate verification command such as `/typecheck` or `pnpm build`, and fix issues within scope.
- [x] 5.3 Smoke-check event list and event detail UX for permission-gated actions, empty state, loading state, and Vietnamese copy consistency.
