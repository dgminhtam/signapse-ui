## 1. Hierarchy Refactor

- [x] 1.1 Re-read the current Telegram UI shell and this change's spec before editing so the refinement stays scoped to hierarchy only.
- [x] 1.2 Remove the standalone peer-level scheduled market analysis section from the Telegram workspace render order.
- [x] 1.3 Move the schedule list, empty state, create/edit form entry points, and destructive confirmation shells into the `SCHEDULED_MARKET_ANALYSIS` route area.
- [x] 1.4 Keep bot connections and destinations unchanged except for any spacing needed after the section order changes.

## 2. Routing Section UX

- [x] 2.1 Update feature routing layout so simple routes remain compact rows focused on destination, blocked state, and enabled switch.
- [x] 2.2 Give the scheduled market analysis route an expanded nested area that shows destination, enabled state, schedule table, and schedule actions together.
- [x] 2.3 Update readiness summary copy so scheduled market analysis reads as part of routing health rather than a fourth top-level setup pillar.
- [x] 2.4 Update skeleton loading structure to mirror the nested schedule layout and avoid layout shift.

## 3. UI-Only Guardrails And Validation

- [x] 3.1 Verify no Telegram server action, route handler, `fetchAuthenticated()` call, fake success toast, or webhook control was added.
- [x] 3.2 Run typecheck and targeted lint for the touched Telegram UI files.
- [x] 3.3 Run `openspec validate refine-telegram-market-analysis-routing-ui --strict`.
- [x] 3.4 Review the diff for scope drift, especially shared component edits, global theme changes, or unrelated Telegram API integration.
