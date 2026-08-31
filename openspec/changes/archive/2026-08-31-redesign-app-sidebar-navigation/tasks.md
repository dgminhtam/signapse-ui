## 1. Navigation Model And Localization

- [x] 1.1 Replace the flat protected navigation configuration with section-aware direct/group entries using stable identifiers, the approved order, existing URLs and permissions, and the approved Lucide icon mapping.
- [x] 1.2 Add matching Vietnamese and English dictionary copy for section labels, renamed destinations, collapsed flyouts, mobile sheet metadata, the visible close action, and API access token account navigation; update breadcrumb/navigation consumers and remove obsolete keys only when no caller remains.
- [x] 1.3 Update permission filtering to work bottom-up across sections and groups, omit empty parents and sections, retain single-child groups, and preserve canonical relative order.

## 2. App Sidebar Behavior

- [x] 2.1 Render the canonical sections, direct destinations, text-only children, and independent expanded/mobile collapsibles from the single filtered navigation tree, initially opening the group that owns the current route.
- [x] 2.2 Compose collapsed desktop group flyouts at the app-sidebar level with localized children, unchanged workspace width, selection close, Escape/outside dismissal, keyboard navigation, and trigger focus restoration.
- [x] 2.3 Apply `aria-current="page"` to the unique current direct or child link while preserving neutral selected-surface, accent-hover, ring-focus, normal-weight parent, and chevron-only disclosure treatment.
- [x] 2.4 Change server-owned sidebar initialization so an absent cookie defaults to expanded while explicit expanded and collapsed cookie values continue to restore the saved preference.
- [x] 2.5 Complete mobile navigation with app-composed visible close UI, targets at least 44 CSS pixels high, independent content scrolling, reachable account footer, and localized assistive metadata; add only a generic accessibility-only wrapper input if composition cannot supply the sheet metadata.
- [x] 2.6 Remove API access token from Administration and add its existing locale-aware route to the authenticated account menu with `KeyRound`, preserving other account-menu groups and availability behavior.

## 3. Fixture-Backed Browser Coverage

- [x] 3.1 Generalize the per-test-run fixture permission control for the `/me` permission collection, migrate or compatibly alias existing feedback callers, and retain synthetic isolation and reset behavior.
- [x] 3.2 Add a P0 app-shell navigation journey for absent/explicit sidebar cookies, full/restricted/single-child/empty-section personas, canonical order, active groups, independent disclosure, API access token placement, and unique `aria-current="page"`.
- [x] 3.3 Cover collapsed direct navigation and grouped flyouts by pointer and keyboard, including unchanged app-shell width, locale-aware selection, Escape/outside dismissal, and focus restoration.
- [x] 3.4 Cover Vietnamese and English mobile sheet states, visible dismissal, target geometry, long-menu scrolling, account-footer reachability, light/dark selected and focus states, and serious/critical axe checks.

## 4. Cleanup And Verification

- [x] 4.1 Remove obsolete sidebar hierarchy branches, labels, duplicated `LayoutDashboard` graph usage, Developer Token navigation copy, and stale test-fixture permission naming; statically confirm destination URLs, permission constants, and shared sidebar theme tokens did not change.
- [x] 4.2 Format touched Markdown, TypeScript, and TSX files, then run `pnpm lint`, `pnpm typecheck`, and the relevant deterministic test suite.
- [x] 4.3 Run the targeted sidebar Playwright journey and the full `pnpm test:browser` P0 suite, confirming no live Clerk, backend, analytics, or external network dependency is introduced.
- [x] 4.4 Run `openspec validate redesign-app-sidebar-navigation --type change --strict --no-interactive` and resolve every proposal, design, delta-spec, or task validation error.

Verification note: the targeted sidebar journey passes 8/8 and the full P0 suite passes when run serially except for two unrelated quick-detail canvas/annotation checks; those failures are outside the sidebar change and do not emit external requests.
