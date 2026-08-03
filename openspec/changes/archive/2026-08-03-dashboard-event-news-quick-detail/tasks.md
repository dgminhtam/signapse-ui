## 1. Shared dashboard interaction boundary

- [x] 1.1 Add a route-local client provider that owns one `LocalQuickDetailEntity` state and renders the existing `LocalEntityQuickDetailDrawer`.
- [x] 1.2 Add a shared `DashboardQuickDetailLink` that opens local detail for ordinary primary activation while preserving modifier-click, middle-click, context-menu, and canonical `href` behavior.
- [x] 1.3 Preserve localized link props and accessible dialog semantics so the trigger remains compatible with `Item asChild` and existing Drawer focus behavior.

## 2. Dashboard section integration

- [x] 2.1 Wrap the Event Timeline/Latest News dashboard surface with the shared provider without converting the page or data sections to client components.
- [x] 2.2 Update Event Timeline rows to use the shared trigger with `{ kind: "event", id }` while retaining `/events/{id}` links and existing content.
- [x] 2.3 Update Latest News rows to use the same anchor-backed `Item asChild` structure with `{ kind: "news-article", id }` and `/news-articles/{id}` links.
- [x] 2.4 Add or update localized accessible labels for event and article quick-detail row actions in the English and Vietnamese dictionaries.

## 3. Contract and verification

- [x] 3.1 Confirm the implementation satisfies the new dashboard quick-detail capability and both modified dashboard capability deltas.
- [x] 3.2 Run `openspec.cmd validate "dashboard-event-news-quick-detail" --type change --strict`.
- [x] 3.3 Run `pnpm typecheck`.
- [x] 3.4 Run `pnpm lint`.
