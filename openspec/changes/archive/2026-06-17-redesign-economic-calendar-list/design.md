## Context

The current economic calendar list page uses the standard Signapse list pattern: toolbar, shared table surface, flat rows, pagination, and a detail action. That keeps the page consistent, but the row hierarchy reads like generic data management rather than a market calendar. Users who monitor scheduled events need to scan by day and time first, then compare currency, impact, event title, and actual/forecast/previous values.

The redesign should borrow the calendar scan model from trading calendars without copying their heavier terminal chrome. The current frontend contract already provides the primary fields needed for a focused list: `scheduledAt`, `currencyCode`, `impact`, `title`, `actualValue`, `forecastValue`, `previousValue`, `status`, `contentAvailable`, and optional `content` on detail responses.

## Goals / Non-Goals

**Goals:**

- Make the list feel like an economic calendar by grouping events by scheduled day and presenting event time as the first scanning anchor.
- Keep the page compact and admin-oriented with existing Signapse list surfaces, shadcn wrappers, locale routing, dictionary copy, and URL-backed list state.
- Preserve the current sync, search, sort, pagination, permission, and canonical detail route behavior.
- Provide an expandable event row pattern for available supporting content without making every read require navigation.
- Keep skeleton/loading states close to the final grouped layout.

**Non-Goals:**

- No backend contract changes, new dependencies, realtime countdowns, or recurring scheduler behavior.
- No TradingView-style daily summary card deck, category tabs, country flag system, or decorative toolbar icons unless the backend contract later provides the data needed for them.
- No global quick-detail route interception; canonical detail links remain normal localized routes.
- No redesign of the economic calendar detail page.

## Decisions

### Use Grouped Rows Instead Of Daily Summary Cards

Group the existing paged entries by local scheduled day inside the list surface. Each group renders a compact date row followed by chronological event rows.

Alternative considered: add a full week strip with daily count cards. This was rejected for the first iteration because the current API returns a paged list rather than a week aggregate, so count cards would be misleading or require extra backend support.

### Preserve Shared List Infrastructure

Continue using `AppListToolbar`, `AppListTable`, `AppPaginationControls`, existing search URL state, and shadcn wrappers. The redesign changes the row composition and hierarchy, not the shared list contract.

Alternative considered: build a bespoke full-screen calendar workbench. This was rejected because the list still needs ordinary admin behaviors: search, sort, pagination, permissions, loading, empty state, and stable table width.

### Prioritize Calendar Fields In The Row Hierarchy

Rows should scan in this order: scheduled time, currency, impact, event title/status, actual, forecast, previous, and action/detail affordance. Technical identifiers and synced timestamps should move out of the primary row unless needed in expanded/supporting treatment.

Alternative considered: keep the existing event-first table. This preserves CRUD familiarity but does not solve the calendar scanning problem.

### Use Local Expand/Collapse For Supporting Content

When supporting content is available, expose it through a row expansion controlled by local client state. Expanded content should stay inside the table group, show a concise body, and include a localized link to the canonical detail page.

Alternative considered: open a drawer for every row. This was rejected as heavier than needed for the list page and unnecessary unless the content becomes rich enough to warrant an overlay.

### Stay Contract-Aligned

Do not add category filters, country flag display, live countdowns, or week aggregate metrics unless those fields become available through the frontend contract. If future backend fields arrive, they can be proposed as follow-up capabilities.

Alternative considered: infer category or country from title/currency. This was rejected because inferred filters would be brittle and could mislead users.

## Risks / Trade-offs

- Grouping a paged result can split a day across pages -> keep pagination visible and avoid implying that a date group is exhaustive unless the backend later supports date windows.
- Moving technical timestamps out of the primary row can reduce sync-debug visibility -> keep sync status and canonical detail access, and leave synced metadata available in secondary/expanded treatment if needed.
- Expandable rows can make tables feel busy on small screens -> keep only one row expansion pattern, use compact copy, and ensure long content wraps without widening the layout.
- Date grouping depends on localized formatting -> use existing i18n helpers and avoid direct `toLocaleString()` during render.

## Migration Plan

1. Update the list component row hierarchy and grouping logic within the existing economic calendar route.
2. Update skeletons to mirror the grouped table layout.
3. Add localized dictionary entries for new expand/collapse/detail labels only where needed.
4. Verify lint/typecheck and targeted static review for hardcoded copy, route locale preservation, and shadcn composition drift.

Rollback is straightforward: restore the previous flat row composition while keeping the existing API and route behavior unchanged.

## Open Questions

- Should the first iteration include a compact date navigation control if the backend only supports generic search/sort/page today, or should date navigation wait for explicit date filter support?
- Should expanded content fetch detail data lazily per row, or should expansion only reveal fields already available in the list response until a follow-up proposes row-level detail loading?
