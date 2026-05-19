## Context

The Telegram UI shell currently shows four peer-level areas: readiness, bot connections, destinations, feature routing, and a standalone scheduled market analysis section. User review found that the schedule section feels disconnected because scheduled market analysis is one Telegram feature route, not a separate configuration domain.

The backend documentation already supports this mental model: feature settings choose a destination per workflow, and market analysis schedules are configuration for the `SCHEDULED_MARKET_ANALYSIS` workflow. This refinement should make the UI read as workflow-first while keeping bot and destination setup as shared infrastructure.

## Goals / Non-Goals

**Goals:**

- Move scheduled market analysis schedule management into the `SCHEDULED_MARKET_ANALYSIS` area of feature routing.
- Keep the Telegram page cardless and operational, with bot and destination sections remaining separate shared setup areas.
- Preserve the existing UI-only review behavior: local fixtures, disabled mutation controls, no server actions, and no success feedback.
- Make the scheduled market analysis route answer three operator questions in one place: where it sends, whether it is enabled, and when it sends.
- Update skeleton and empty states so loading hierarchy matches the refined layout.

**Non-Goals:**

- Do not integrate live Telegram APIs.
- Do not redesign bot connection or destination management beyond spacing needed for the new hierarchy.
- Do not introduce tabs, a wizard, or a separate details page for scheduled market analysis.
- Do not add delivery logs, notification history, or webhook controls.

## Decisions

1. Nest schedules under the scheduled market analysis route.

   The feature routing section should remain the place where operators manage workflow-specific Telegram behavior. The `SCHEDULED_MARKET_ANALYSIS` row or panel will include its route destination, enabled switch, and a nested schedule table/form entry point. Alternative considered: keep the separate schedule section and add cross-links. That still forces users to reconcile two page areas for one workflow.

2. Use a slightly expanded route treatment only for scheduled market analysis.

   Calendar alerts and market news alerts are simple routing rows. Scheduled market analysis has additional schedule records, so it can render as an expanded row, sub-panel, or grouped area inside the same feature routing section. This keeps density low for simple routes while giving the complex route room to breathe. Alternative considered: convert every route into equal cards. That would make the simpler routes heavier than their content requires.

3. Keep the schedule table surface, but remove peer-section chrome.

   The existing schedule table pattern is still useful for repeated schedule records, destructive confirmations, and empty state. It should become a nested list surface under scheduled market analysis rather than a fourth top-level section with its own section header. Alternative considered: inline schedule chips only. That would be too weak once there are multiple schedules with times, assets, status, and row actions.

4. Readiness should summarize market analysis as part of routing health.

   The readiness summary can still mention scheduled market analysis, but it should not imply the schedule list is an independent setup pillar. Labels and descriptions should indicate that market analysis readiness belongs to route readiness. Alternative considered: remove the market analysis readiness item entirely. That loses a useful scan signal for a high-value workflow.

## Risks / Trade-offs

- Nested schedule management can make the feature routing section taller - Mitigate with compact route headers, stable table columns, and no redundant section copy.
- A nested table can feel visually heavy - Mitigate by using one clear nested surface, not cards inside cards, and by keeping spacing aligned with `AppListTable`.
- Future API integration may load schedules separately from feature settings - Mitigate by keeping schedule fixtures and rendering boundaries easy to replace with server data later.
- The previous OpenSpec UI shell change describes schedules as a peer section - Mitigate by updating implementation tasks and this refinement spec so the next apply step intentionally changes that hierarchy.
