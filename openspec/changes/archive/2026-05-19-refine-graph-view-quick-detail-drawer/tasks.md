## 1. Drawer Primitive

- [x] 1.1 Add the official shadcn Drawer primitive to `components/ui/drawer.tsx`.
- [x] 1.2 Review the generated Drawer file for repo conventions, imports, accessible title support, and no unrelated style changes.

## 2. Quick Detail Shell

- [x] 2.1 Replace or rename `components/entity-quick-detail-sheet.tsx` with a Drawer-based app-level shell.
- [x] 2.2 Use bottom Drawer composition with accessible title/description, `router.back()` close behavior, and full-detail footer action.
- [x] 2.3 Tune bottom Drawer layout for readability: stable height, broad content area, internal body scroll, and visible graph context behind it.
- [x] 2.4 Remove Sheet imports and naming from quick detail shell usage.

## 3. Loading And State Handling

- [x] 3.1 Remove or refactor `app/(main)/@quickDetail/loading.tsx` so it does not mount a separate overlay primitive before loaded content.
- [x] 3.2 Ensure loading feedback, if kept, appears inside a stable Drawer body or waits until data is ready.
- [x] 3.3 Update `error.tsx` and `not-found.tsx` in `@quickDetail` to use the Drawer shell without changing route semantics.

## 4. Route Usage

- [x] 4.1 Update intercepted event quick detail route to use the Drawer shell.
- [x] 4.2 Update intercepted news article quick detail route to use the Drawer shell.
- [x] 4.3 Preserve focused event/article content and avoid adding mutation-heavy page actions.
- [x] 4.4 Preserve canonical full detail URLs, direct navigation behavior, and `router.back()` close behavior.

## 5. Verification

- [x] 5.1 Verify Graph View quick detail opens as a single bottom Drawer, not as skeleton overlay followed by data overlay.
- [x] 5.2 Verify the bottom Drawer remains readable on desktop and mobile widths with content scrolling inside the Drawer body.
- [x] 5.3 Verify direct `/events/{id}` and `/news-articles/{id}` still render full pages.
- [x] 5.4 Verify browser Back/Forward and Drawer close behavior from Graph View.
- [x] 5.5 Run `pnpm typecheck`.
- [x] 5.6 Run `pnpm build`.
- [x] 5.7 Run `openspec validate refine-graph-view-quick-detail-drawer --strict`.
