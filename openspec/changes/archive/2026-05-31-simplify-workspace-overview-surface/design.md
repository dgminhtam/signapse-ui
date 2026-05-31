## Context

The protected root route is now the `Tổng quan` workspace overview. Its current successful state renders a hero block, three stats, a tracked-assets summary, and a technical details panel. Several items repeat the same meaning: active status appears both as a badge and a stat, updated time appears in both primary stats and technical details, the watchlist action appears twice, and assets are shown as both symbol chips and item cards.

The screen's real job is narrower: confirm the active workspace, show whether tracked assets are ready, and provide the next action for managing that list.

## Goals / Non-Goals

**Goals:**

- Reduce first-viewport information to active workspace identity and tracked-asset readiness.
- Keep exactly one visible watchlist management action in the successful state.
- Remove repeated status/scope/update treatments from the primary overview.
- Remove the technical details panel from the default overview reading path.
- Render tracked assets once in a compact, scannable preview.
- Keep existing permission, loading, error, and empty states understandable and localized.

**Non-Goals:**

- Do not change workspace or watchlist backend calls.
- Do not introduce charts, activity feeds, analytics tiles, or new dashboard metrics.
- Do not create a separate workspace detail page.
- Do not redesign the header, sidebar, workspace switcher, or watchlist editor.

## Decisions

1. Use a compact workspace strip instead of a dashboard hero.

   The top region should identify the active workspace and optionally show last updated as subdued metadata. It should not render a status stat for a state that is already implied by the resolved workspace.

2. Make tracked assets the primary content region.

   The tracked-asset list is the only actionable setup signal on the overview today. The section should own the watchlist action, count, preview, and empty/error/permission states.

3. Prefer one preview representation.

   The preview should choose either compact asset rows or chips, not both. A row or chip treatment may show symbol and, where space allows, asset name or type. The preview should cap the number of shown assets and rely on the management action for full editing.

4. Remove technical details from the default surface.

   Workspace ID, created date, and duplicate updated date are useful for support/debugging, not everyday orientation. If retained, they should move to a subdued secondary affordance that does not compete with the main readiness content.

5. Keep shadcn composition conservative.

   Use existing `Empty`, `Badge`, `Button`, `Skeleton`, and semantic Tailwind tokens. Do not patch `components/ui/*`, override shadcn primitive chrome, or introduce custom dashboard card systems.

## Risks / Trade-offs

- [Risk] Support users may occasionally need workspace ID quickly -> Mitigation: keep technical identifiers available only if a low-priority secondary treatment is justified during implementation.
- [Risk] Removing status cards may make the screen feel too sparse -> Mitigation: use purposeful spacing and a clear watchlist readiness section rather than adding filler metrics.
- [Risk] Asset preview can become noisy for long names -> Mitigation: cap preview count and use `min-w-0`, `truncate`, or compact chips.
- [Risk] Empty states may lose setup guidance -> Mitigation: preserve existing empty/access/error states and put the single management action near the state where permissions allow.
