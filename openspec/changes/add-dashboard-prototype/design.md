## Context

The current `/[lang]/dashboard` page is a Server Component that resolves permissions and locale, then loads workspace, watchlist, and narrative data before rendering the existing overview. The accepted `docs/design/DASHBOARD.md` describes a broader Trading Intelligence Home whose hierarchy and states need visual validation before any production migration.

The prototype must remain inside the authenticated locale-aware main shell, follow `docs/design/DESIGN.md`, and reuse existing shadcn wrappers. It must not share data flow or feature-specific components with the current dashboard because those components are coupled to live permissions and API response types.

Review of the first prototype established a clearer responsibility boundary: workspace scope must be explicit, events and news must not share one feed, the right rail should show recent evidence instead of another calendar surface, and every narrative must identify its affected assets. Further review established that raw news must not imply asset or event enrichment and that an action's placement must match whether it applies to a whole module or one item. Color review found that the remaining `outline`, `secondary`, and `ghost` badges are too visually uniform in both themes, so decision-bearing states need restrained semantic color while contextual asset chips remain neutral. Workspace review then established that the active workspace name, rather than a repeated generic Current Workspace label, should own the section hierarchy, while the tracked-asset list needs its own count and concise explanation. The metadata review adds a localized workspace update time between that explanation and the tracked-asset subsection and extends the complete Economic Calendar impact badge contract to the Next Key Event snapshot. Event Timeline review then established that occurred time and confidence alone do not provide enough market context, so each mock event should also identify its themes and affected assets without reintroducing Economic Calendar impact or directional inference.

## Goals / Non-Goals

**Goals:**

- Provide a direct-link prototype route for reviewing the accepted dashboard information architecture.
- Render realistic Vietnamese and English mock content for every Phase 1 module.
- Give workspace scope, events, news, watchlist priorities, and market narratives distinct user-facing responsibilities.
- Keep module-wide navigation in module headers and item-specific navigation inside the item it affects.
- Make normal, loading, empty, and independent module failure states reviewable without live data.
- Preserve Financial Command Surface hierarchy across light/dark themes, responsive widths, and 200% zoom.
- Establish a consistent semantic badge hierarchy for Next Key Event impact and narrative lifecycle without relying on color alone or route-local palette classes.
- Make isolation from the current dashboard easy to inspect and easy to reverse.

**Non-Goals:**

- Replace, redirect, feature-flag, or refactor `/[lang]/dashboard`.
- Connect any action, API client, permission helper, backend DTO, SSE stream, or aggregate endpoint.
- Add prices, 24-hour changes, sparklines, top movers, or other Phase 2 data.
- Infer bullish or bearish direction for assets affected by a narrative when that direction is not supported by production data.
- Create mock article detail identifiers or infer article-to-asset or article-to-event relationships.
- Add a sidebar item, dependency, global CSS rule, semantic token, or feature-specific badge abstraction.
- Add decorative section badges, color raw articles, or color workspace and related-asset chips that carry no status meaning.
- Treat prototype approval as approval to migrate the production dashboard.

## Decisions

### Use a sibling route under the existing main layout

The prototype will live at `app/[lang]/(main)/dashboard-prototype/` and inherit the existing authenticated shell and locale routing. It will not be added to the sidebar; reviewers will open it by direct URL.

This is preferred over a feature flag inside `/dashboard` because the current route has live data and permission behavior that must remain untouched. A separate application, Storybook setup, or new layout would add infrastructure without improving the review.

### Keep the prototype server-rendered and URL-selectable

`page.tsx` will read `searchParams.scenario`, normalize it to `default`, `loading`, `empty`, or `partial-error`, and render a route-local view. Invalid or repeated values will fall back deterministically to `default`.

The prototype control strip will use localized links that update the query parameter. This avoids client state, hooks, and a new interaction abstraction while keeping each review state shareable and refresh-safe.

### Keep mock content and module functions route-local

Mock records, inferred local types, scenario selection, and small module functions will remain in `dashboard-prototype-view.tsx`. The implementation will reuse generic wrappers, localized navigation helpers, and the existing `getEconomicCalendarImpactBadgeProps` visual mapping already present in the repository.

The prototype will not import the current dashboard page, feature API modules, permission modules, backend response types, or create speculative shared dashboard abstractions. If a later production change is approved, it can derive production components from the validated UI rather than treating prototype mock types as contracts.

### Use the accepted asymmetric 12-column hierarchy

The page will render a compact full-width Current Workspace strip, followed by a snapshot row whose Next Key Event tile has the strongest visual weight. The main content will use Event Timeline at eight columns beside Latest News at four columns, followed by Assets in Focus at seven columns beside Market Narratives at five columns.

Current Workspace will use the active workspace name as its visible section heading and give it the same typographic scale as the Next Key Event value without applying metric-only monospaced or tabular-number treatment. A concise description will explain that the workspace defines the active dashboard scope. The repeated generic Current Workspace eyebrow will not render. A fixed route-local mock timestamp will render immediately below the description through the shared `AppTimeMetadata` and localized date-time formatter. It will contain only the formatted value and calendar-clock icon, without an additional label, badge, or freshness claim.

The tracked-asset list will have a subordinate heading, a localized neutral count badge, and a short description explaining that the list belongs to the active workspace. The count is additive metadata only: every tracked asset remains visible in the responsive `Item` grid. Each presentational item will expose the asset's full name, symbol, and a neutral asset-type `Badge` rather than reducing scope to chips, a count, or a `+N` summary. The module-wide action will use the user-facing Manage Assets label rather than watchlist terminology. Snapshot metrics will include explicit time windows or decision context. Event, article, impact, and narrative states will combine text with icons or signs so color is never the only signal. Full charts and decorative visualizations are excluded.

The grid will use four columns at extra-large widths, two columns at intermediate widths, and one column on mobile or when zoom reduces the available width. Long names will wrap rather than rely on hover-only truncation, and the loading state will preserve the workspace heading, description, timestamp metadata, tracked-asset description, count badge, and the same item footprint. The count will remain visible as zero in the empty state so the subsection hierarchy stays stable. Items remain non-interactive because the prototype has no canonical asset detail identifier or approved asset-detail destination; Manage Assets remains the only Current Workspace action.

At medium widths snapshot tiles will reflow into two columns. Main module pairs will stack when their decision content can no longer remain readable. Mobile and 200% zoom will use a single-column flow without page-level horizontal overflow.

### Separate events, news, priorities, and interpretation

Event Timeline will contain only already-recorded market events ordered from newest to oldest by `occurredAt`. Each route-local mock row will show its title, concise description, localized occurred time, neutral confidence metadata, themes, and affected assets. Themes will render as compact neutral text separated by a middle dot, while affected asset symbols will use neutral outline badges. Relationship content will wrap before it truncates, will not add directional color or arrows, and will remain separate from the time/confidence metadata row. The timeline will not mix article rows into the chronology, expose internal enrichment status, or reintroduce Economic Calendar impact or scheduling state.

The prototype intentionally defers backend contract and aggregation design. It will not import Event DTOs, call event detail per row, or present its route-local relationship mocks as a production data contract.

Latest News replaces the calendar-based Catalyst Radar. It will show four or five raw recent news items with title, a concise summary of up to two lines, source, and publication time without requiring asset or event relationships. Summary sits directly below the title, while source and time remain a separate muted metadata line. Because the prototype has no canonical mock article IDs, news rows will remain presentational and the module header will provide the single route to the complete news list.

Assets in Focus retains the asset-priority decision role, while Market Narratives explains the active thesis layer and shows one neutral theme plus every affected asset for each narrative. Theme text will sit with the relationship context before the affected-asset badges and will not receive a semantic status color. The prototype will not invent asset directionality that is not part of the confirmed data shape.

Current Workspace and Assets in Focus remain intentionally distinct: Current Workspace defines inventory scope through name, symbol, and type only, while Assets in Focus adds market context and asset-specific Market Charts actions.

### Match action placement to action scope

Module-wide navigation will use the existing `CardAction` header pattern: Event Timeline and Latest News link to their complete lists, while Assets in Focus and Market Narratives link to Graph View. The news and narrative card footers will be removed. Graph View will not be repeated in every asset row; Market Charts remains the only per-asset quick action because it is the action associated with that row.

In empty or partial-error states, a header action will be omitted when it would duplicate the empty-state or recovery action. Loading modules will preserve the header-action footprint with an action-shaped skeleton. This keeps the decision path clear without adding a new shared component or client state.

### Model module states without simulating a backend

The `default` scenario will show all eight workspace assets, four snapshot metrics, five or six event-only timeline items, four or five latest news items, six assets in focus, and three narratives with affected-asset lists. `loading` will replace each module, including its header-action footprint, with a matching skeleton. `empty` will provide user-facing next actions without duplicating header navigation. `partial-error` will fail one optional module while leaving the rest useful.

No timers, delayed promises, retry network calls, or fake service layer will be introduced. Prototype retry actions may link back to the same scenario or remain presentational, but they must be identified clearly and remain keyboard accessible.

### Make shared edits additive and prototype-specific

Vietnamese and English dictionaries will receive a `dashboardPrototype` namespace. The breadcrumb formatter will receive one friendly mapping for `dashboard-prototype`. Existing dictionary keys and existing route mappings will not be changed.

The existing dashboard route, sidebar, redirects, route ownership, and global design tokens will remain unchanged.

### Use approved Badge variants and the complete Economic Calendar impact contract

Next Key Event impact will use both `getEconomicCalendarImpactBadgeProps` and `getEconomicCalendarImpactLabel` in the same composition as Economic Calendar. The snapshot will separate time and currency metadata from impact so it can render the helper-provided badge instead of embedding an alternate impact phrase in one description string. Empty state will omit the badge. The prototype will therefore render the same chrome and localized labels, without adding a prototype-only impact icon or copy.

Event Timeline will not render status badges; only affected asset symbols use neutral `outline` badges. Market Narratives will use `info` for emerging, `default` for active, and `warning` for weakening. Assets in Focus category badges will use `secondary`; workspace assets, event themes, narrative-affected assets, and Latest News remain neutral.

The shared Badge wrapper will receive only the additive `info` and `warning` intent variants. Their theme-aware palette mapping stays inside the wrapper, as required by `docs/design/DESIGN.md`; feature code will not provide raw palette classes or manual dark-mode overrides. Explicit localized text remains the non-color cue, and no badge implies unsupported bullish or bearish direction.

### Verify the isolation boundary explicitly

Implementation verification will include lint, typecheck, a small assertion for scenario normalization, static import review, and a diff check proving `app/[lang]/(main)/dashboard/page.tsx` is untouched. Browser review will cover the four scenarios, light/dark themes, desktop/tablet/mobile widths, keyboard focus, and 200% zoom.

## Risks / Trade-offs

- **Mock content can imply a backend contract that does not exist** → Keep mock types route-local, avoid backend DTO names, and state that production data mapping requires a separate change.
- **Reviewers can mistake the prototype for the production dashboard** → Use the explicit prototype URL and a localized prototype control strip, and keep it out of primary navigation.
- **The route-local view can become large** → Keep module functions in one file for the prototype; split only when readability measurably suffers during implementation.
- **An additive breadcrumb mapping touches shared code** → Limit the edit to the new route key and verify existing breadcrumb behavior remains unchanged.
- **Presentational retry controls cannot recover real data** → Make scenario behavior deterministic and do not simulate network recovery.
- **Long localized header actions can compete with module titles at narrow widths** → Reuse the established header action pattern and verify mobile and 200% zoom before completion.
- **Detailed workspace items can compete with decision modules below** → Keep the grid compact, neutral, and metadata-only; do not add price, status, context, logo, or per-item action.
- **The tracked-asset count can be mistaken for a collapsed summary** → Keep every asset item visible and treat the neutral count badge as subsection metadata only.
- **Raw articles can be mistaken for enriched evidence** → Show only title, concise source-provided summary, source, and publication time and do not render relationship placeholders or badges.
- **Event relationship mocks can be mistaken for an approved backend contract** → Keep them route-local, avoid DTO imports, and defer API or aggregate design to a separate production change.

- **Many colored chips can turn a dense dashboard into visual noise** → Color only impact and decision-bearing status badges; keep categories, asset symbols, and raw articles neutral.
- **Color can lose meaning or contrast across themes** → Keep explicit labels, centralize intent mapping in the Badge wrapper, and verify every mapping in both themes and at responsive widths.

## Migration Plan

1. Add the isolated route and mock scenarios without linking it from production navigation.
2. Align the OpenSpec artifacts and `docs/design/DASHBOARD.md` with the reviewed information architecture and approved Badge intent variants.
3. Update prototype-only dictionary keys, mock content, modules, and states without changing production dashboard behavior.
4. Run deterministic and browser verification while confirming the current dashboard diff is empty.
5. Share the direct prototype URL for review.

Rollback is deletion of the prototype route folder, prototype dictionary namespace, and prototype breadcrumb mapping. No data or backend rollback is required.

## Open Questions

There are no blocking questions for prototype implementation. Replacing the production dashboard, defining API aggregation, and deciding whether approved prototype modules become shared components require a separate change.
