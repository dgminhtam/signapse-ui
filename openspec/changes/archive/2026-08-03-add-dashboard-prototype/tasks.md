## 1. Isolated Route And Scenario Foundation

- [x] 1.1 Create `app/[lang]/(main)/dashboard-prototype/page.tsx` as a locale-aware Server Component that normalizes `searchParams.scenario` and renders the route-local prototype view without feature API, action, permission, or backend DTO imports.
- [x] 1.2 Add the smallest runnable assertion for supported, missing, repeated, and invalid scenario normalization.
- [x] 1.3 Add the `dashboardPrototype` Vietnamese and English dictionary namespaces and the additive `dashboard-prototype` friendly breadcrumb mapping without adding a sidebar item.

## 2. Initial Trading Intelligence Surface

- [x] 2.1 Create `dashboard-prototype-view.tsx` with route-local mock data, the localized prototype scenario controls, compact Trading Context, and the four-metric Trading Snapshot.
- [x] 2.2 Implement the mixed Market Intelligence feed and four-item Catalyst Radar with localized labels, time context, non-color status cues, and list-level investigation links.
- [x] 2.3 Implement the six-asset Watchlist Focus and three-state Narrative Radar with the accepted seven-to-five desktop hierarchy and generic localized navigation targets.

## 3. Review States And Responsive Accessibility

- [x] 3.1 Implement the loading scenario with skeletons that preserve each module's final footprint and responsive hierarchy.
- [x] 3.2 Implement actionable empty states and a partial-error scenario where one optional module fails while all unaffected modules remain useful.
- [x] 3.3 Complete semantic heading order, accessible names, visible keyboard focus, light/dark parity, two-column medium reflow, single-column mobile and 200% zoom behavior, and page-level overflow prevention.

## 4. Verification And Isolation

- [x] 4.1 Run the prototype scenario assertion, `pnpm lint`, and `pnpm typecheck`, and resolve all findings introduced by the change.
- [x] 4.2 Verify statically that the prototype imports no feature API, action, permission, backend DTO, or current-dashboard component and that the existing dashboard page, sidebar, dependencies, global CSS, and semantic tokens have no prototype-driven changes.
- [x] 4.3 Inspect all four prototype scenarios in the local app across light and dark themes, desktop, tablet, mobile, keyboard navigation, and 200% zoom, confirming readable hierarchy, non-duplicated actions, header labels that do not crowd titles, and no page-level horizontal overflow.

## 5. Reviewed Information Architecture Refinement

- [x] 5.1 Rename and localize the reviewed modules as Current Workspace / Workspace hiện tại, Next Key Event / Sự kiện quan trọng sắp tới, Event Timeline / Dòng sự kiện, Latest News / Tin tức mới nhất, Assets in Focus / Tài sản cần chú ý, and Market Narratives / Luận điểm thị trường.
- [x] 5.2 Show all eight workspace assets as wrapping, individually identifiable items in the default scenario and preserve the corresponding loading and empty footprints.
- [x] 5.3 Replace the mixed event/news feed with a five-to-six-item event-only timeline that exposes upcoming, ongoing, or recent state, time context, impact, and related assets.
- [x] 5.4 Replace the calendar-based Catalyst Radar with a four-to-five-item Latest News module showing source and publication time.
- [x] 5.5 Add every affected asset to each Market Narrative while preserving emerging, active, weakening, loading, empty, and partial-error presentation without inferred asset direction.
- [x] 5.6 Run the scenario assertion, targeted lint, typecheck, strict OpenSpec validation, static isolation review, and diff check for the refined prototype.

## 6. Reviewed Action Scope And Raw Articles

- [x] 6.1 Align the proposal, design, prototype spec, tasks, and `docs/design/DASHBOARD.md` with raw article metadata and module-wide header action scope.
- [x] 6.2 Remove article relationship metadata and generic row navigation, move the complete article-list link into the Latest News header, remove its footer, and remove prototype-only article action copy that is no longer used.
- [x] 6.3 Move the Assets in Focus and Market Narratives Graph View links into their module headers, remove repeated per-asset Graph View actions and the narrative footer, and retain Market Charts on each asset row.
- [x] 6.4 Preserve empty and partial-error recovery without duplicate actions, add header-action skeleton footprints, and keep localized header labels readable and keyboard accessible at responsive widths and 200% zoom.
- [x] 6.5 Run the scenario assertion, targeted lint, typecheck, strict OpenSpec validation, static isolation review, and diff check for the action-scope refinement.

## 7. Reviewed Semantic Badge Palette

- [x] 7.1 Align the proposal, design, prototype spec, tasks, and `docs/design/DASHBOARD.md` with the approved semantic badge hierarchy and neutral-content boundaries.
- [x] 7.2 Reuse the Economic Calendar impact badge helpers for high, medium, and low Event Timeline impacts while preserving localized labels.
- [x] 7.3 Apply semantic treatment to event time states and narrative lifecycle states while keeping categories, workspace, related-asset, affected-asset, and article presentation neutral.
- [x] 7.4 Inspect the updated badges in the local prototype across light and dark themes, desktop, tablet, mobile, and 200% zoom, confirming readable contrast, restrained visual weight, and no color-only meaning.
- [x] 7.5 Run the scenario assertion, targeted lint, typecheck, strict OpenSpec validation, static isolation review, and diff check for the semantic color refinement.

## 8. Badge Contract Alignment

- [x] 8.1 Align `docs/design/DESIGN.md`, the proposal, design, prototype spec, tasks, and `docs/design/DASHBOARD.md` with the upstream-only shadcn wrapper contract and permitted Badge variants.
- [x] 8.2 Revert the shared Badge wrapper to the current shadcn registry item without changing the Economic Calendar helper contract, global CSS, or semantic tokens.
- [x] 8.3 Render Event Timeline impact badges with the same helpers, localized labels, chrome, and icon-free composition as Economic Calendar, and remove obsolete prototype impact copy.
- [x] 8.4 Map prototype narrative lifecycle states to approved upstream Badge variants while preserving explicit text cues.
- [x] 8.5 Run targeted formatting, lint, typecheck, strict OpenSpec validation, static isolation review, and shadcn diff checks for the restored badge contract.

## 9. Detailed Current Workspace Assets

- [x] 9.1 Align the proposal, design, prototype spec, tasks, and `docs/design/DASHBOARD.md` with detailed, presentational Current Workspace asset items and the boundary from Assets in Focus.
- [x] 9.2 Replace the symbol-only workspace mock list with route-local records containing full name, symbol, and localized asset type, including the index category.
- [x] 9.3 Render the workspace assets as a responsive `ItemGroup` grid of outlined, non-interactive `Item` rows with `ItemContent`, wrapping title, monospaced symbol, and neutral type `Badge`.
- [x] 9.4 Update the loading footprint and list semantics for the detailed grid while preserving the current empty state, module-level Manage Watchlist action, mobile flow, and 200 percent zoom behavior.
- [x] 9.5 Run targeted formatting, lint, typecheck, scenario assertion, strict OpenSpec validation, static isolation review, diff checks, and local visual review for the workspace refinement.

## 10. Current Workspace Hierarchy Refinement

- [x] 10.1 Align the proposal, design, prototype spec, tasks, and `docs/design/DASHBOARD.md` with the active workspace name as the visible heading and the tracked-asset subsection hierarchy.
- [x] 10.2 Remove the repeated Current Workspace eyebrow, add localized workspace and tracked-asset descriptions, and render the workspace name at the Next Key Event value scale without metric-only typography.
- [x] 10.3 Add a localized neutral count badge beside the tracked-asset heading while preserving the existing detailed asset grid and zero-count empty state.
- [x] 10.4 Update the loading skeleton to preserve the workspace heading, descriptions, count badge, and existing item footprint across responsive widths.
- [x] 10.5 Run targeted formatting, lint, typecheck, scenario assertion, strict OpenSpec validation, static isolation review, diff checks, and local visual review for the hierarchy refinement.

## 11. Workspace Timestamp And Snapshot Impact

- [x] 11.1 Align the proposal, design, prototype spec, tasks, and `docs/design/DASHBOARD.md` with plain workspace update metadata and the Next Key Event Economic Calendar impact badge.
- [x] 11.2 Add a fixed route-local workspace update timestamp formatted through the shared localization formatter and displayed in `AppTimeMetadata` without additional label copy.
- [x] 11.3 Split Next Key Event time and currency metadata from impact and render its high-impact badge with the existing Economic Calendar helper-provided chrome and localized label.
- [x] 11.4 Preserve the new timestamp and impact footprints in loading while omitting the impact badge in empty state and retaining the existing asset grid.
- [x] 11.5 Run targeted formatting, lint, typecheck, scenario assertion, strict OpenSpec validation, static isolation review, diff checks, and local visual review for the timestamp and impact refinement.

## 12. Event Timeline Contract Alignment

- [x] 12.1 Align the proposal, design, prototype spec, tasks, and `docs/design/DASHBOARD.md` with Event list fields and scope Economic Calendar impact to Next Key Event.
- [x] 12.2 Replace Event Timeline mocks with title, description, occurred time, and confidence while removing impact, scheduling state, related assets, and future economic-calendar examples.
- [x] 12.3 Render event rows with existing Item composition, `AppTimeMetadata`, and localized date-time and percent formatters without badges or internal status.
- [x] 12.4 Preserve the refined event-row footprint in loading and keep default and empty states responsive and localized.
- [x] 12.5 Run targeted formatting, lint, typecheck, scenario assertion, strict OpenSpec validation, static isolation review, diff checks, and local visual review for the Event Timeline refinement.

## 13. Event Relationship Context

- [x] 13.1 Align the proposal, design, prototype spec, tasks, and `docs/design/DASHBOARD.md` with route-local event themes and affected-asset context while deferring production contract design.
- [x] 13.2 Add localized theme mock content and affected asset symbols to every default Event Timeline record without direction, impact, or scheduling state.
- [x] 13.3 Render themes as neutral text and affected assets as neutral outline badges in a wrapping relationship row above occurred time and confidence.
- [x] 13.4 Preserve the relationship and metadata footprints in loading while keeping empty state, mobile, and 200 percent zoom behavior stable.
- [x] 13.5 Run targeted formatting, lint, typecheck, scenario assertion, strict OpenSpec validation, static isolation review, diff checks, and local visual review for the relationship-context refinement.

## 14. Latest Article Summaries

- [x] 14.1 Align the proposal, design, prototype spec, tasks, and `docs/design/DASHBOARD.md` with concise raw article summaries below article titles.
- [x] 14.2 Add localized route-local summaries to every Latest News mock record without adding relationship metadata or detail navigation.
- [x] 14.3 Render each summary as muted content limited to two lines and keep source/publication time in a separate metadata line.
- [x] 14.4 Preserve the expanded article-row footprint in loading and responsive layouts.
- [x] 14.5 Run targeted formatting, lint, typecheck, scenario assertion, strict OpenSpec validation, static isolation review, diff checks, and local visual review for the article-summary refinement.

## 15. News Terminology

- [x] 15.1 Align the proposal, design, prototype spec, tasks, and `docs/design/DASHBOARD.md` on Latest News / Tin tức mới nhất while retaining the existing `/news-articles` route and internal article model.
- [x] 15.2 Update the localized snapshot, module title, module description, complete-list action, and empty state from article terminology to news terminology.
- [x] 15.3 Confirm summaries, source, publication time, loading footprints, and responsive behavior remain unchanged.
- [x] 15.4 Run targeted formatting, lint, typecheck, scenario assertion, strict OpenSpec validation, static isolation review, diff checks, and local visual review for the terminology refinement.

## 16. Asset Management And Narrative Themes

- [x] 16.1 Align the proposal, design, prototype spec, tasks, and `docs/design/DASHBOARD.md` with asset-management terminology and a neutral theme field for every Market Narrative.
- [x] 16.2 Rename the Current Workspace and empty Assets in Focus action copy from Manage Watchlist to Manage Assets in both prototype locales.
- [x] 16.3 Add localized route-local theme content to every Market Narrative and render it as neutral text before affected assets while preserving the loading footprint.
- [x] 16.4 Run targeted formatting, lint, typecheck, scenario assertion, strict OpenSpec validation, static isolation review, and diff checks for the refinement.
