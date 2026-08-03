## Context

Dashboard Event Timeline and Latest News currently render each quick-detail row as an anchor with a canonical detail `href`, then cancel ordinary navigation to open a local drawer. The global top loader observes the anchor click before any route change exists, so it shows false loading feedback. The requested product behavior is now an explicit local action: every row activation opens the drawer, and the drawer owns the intentional full-page escalation.

## Goals / Non-Goals

**Goals:**

- Use native button semantics for dashboard quick-detail rows.
- Remove false top-loader activation caused by intercepted row anchors.
- Keep one shared dashboard drawer and its existing loading, permission, error, focus, and full-page action behavior.
- Update the OpenSpec contract and quick-detail guidance to match the new interaction.

**Non-Goals:**

- No API, permission, dependency, route, or drawer-content changes.
- No changes to Graph View or Market Charts; their quick-detail triggers are already buttons.
- No global replacement of `nextjs-toploader`.

## Decisions

1. **Use a native button-backed row trigger.** Rename `DashboardQuickDetailLink` to `DashboardQuickDetailButton` and render a `button type="button"`. This gives click, Enter, and Space native behavior without `preventDefault()` or route interception.
2. **Keep the existing `Item asChild` composition.** The two dashboard row consumers keep their existing visual/item content and only replace the trigger component and remove the per-row `href`.
3. **Keep canonical navigation in the drawer.** The existing `Open full page` `LocalizedLink` remains the only dashboard quick-detail escalation to `/events/{id}` or `/news-articles/{id}`.
4. **Update requirements, not unrelated architecture.** Modify the three dashboard capability specs and the shared quick-detail documentation; do not change the global loader or analytical workspace implementations.

## Risks / Trade-offs

- [Rows no longer support modifier-click, middle-click, or context-menu navigation] → This is an explicit product decision; full-page navigation remains available through the drawer action.
- [A button row changes native link affordances] → Keep clear focus styling, `aria-haspopup="dialog"`, keyboard activation, and the existing accessible row label.

