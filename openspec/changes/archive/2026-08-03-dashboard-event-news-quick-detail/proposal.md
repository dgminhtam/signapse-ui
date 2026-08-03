## Why

Event Timeline rows currently navigate away from the dashboard, while Latest News rows are not interactive. Users need a fast way to read either item without losing dashboard context, using the existing event/news quick-detail drawer already proven in Graph View and Market Charts.

## What Changes

- Add one dashboard-owned quick-detail state owner that reuses the existing `LocalEntityQuickDetailDrawer`.
- Make Event Timeline and Latest News rows use the same clickable `Item asChild` interaction pattern.
- Open event or news-article quick detail on a normal primary click while preserving canonical links for modifier clicks, context-menu actions, and full-page escalation.
- Wrap every Latest News row in an anchor-backed `Item`, matching Event Timeline semantics and accessibility behavior.
- Keep the dashboard route and both data sections server-rendered; add only a small client interaction boundary.
- Add localized accessible labels for opening news-article quick detail where needed.

## Capabilities

### New Capabilities

- `dashboard-event-news-quick-detail`: Defines synchronized quick-detail opening, closing, link preservation, and accessibility behavior for dashboard Event Timeline and Latest News rows.

### Modified Capabilities

- `dashboard-event-timeline`: Change row activation from direct-only navigation to local quick detail with an explicit canonical full-page action.
- `dashboard-latest-news`: Allow and require row-level detail interaction; define quick-detail behavior and canonical article navigation.

## Impact

- Affected UI: `app/[lang]/(main)/dashboard/page.tsx`, `event-timeline.tsx`, `latest-news.tsx`, and a new route-local client interaction wrapper.
- Reuses `app/[lang]/(main)/local-entity-quick-detail-drawer.tsx`; no new drawer, API, dependency, or global route interception is required.
- May update `app/lib/i18n/dictionaries/en.ts` and `vi.ts` for localized accessible labels.
- Updates OpenSpec contracts for dashboard event/news interactions; backend contracts and list/detail routes remain unchanged.
- Accessibility behavior must preserve native anchor semantics, keyboard activation, modifier-click navigation, focus return, drawer escape handling, and contained scrolling.
