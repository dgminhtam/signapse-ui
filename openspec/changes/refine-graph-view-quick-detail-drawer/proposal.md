## Why

The current Graph View quick detail overlay uses a right-side `Sheet`, which makes event/article content feel narrow and less comfortable to read over a wide graph canvas. It also renders a separate overlay during route loading, causing the visual impression that the panel opens twice: once for skeleton and again for the loaded data.

## What Changes

- Replace the Graph View quick detail overlay shell from right-side `Sheet` to bottom `Drawer`.
- Add the shadcn/ui `Drawer` primitive to the repo through the standard shadcn component flow.
- Rename or replace the app-level `EntityQuickDetailSheet` shell with a bottom-drawer quick detail shell.
- Preserve the existing Graph View quick detail routes, canonical URLs, server fetchers, permissions, and focused event/news-article content.
- Remove the separate `@quickDetail/loading.tsx` overlay mount or refactor loading so the overlay primitive does not remount between skeleton and loaded content.
- Ensure skeleton, error, not-found, and permission states appear inside the same bottom drawer treatment or do not animate as separate overlay instances.
- Tune the bottom drawer layout for readability: broad content width, stable height, body scroll containment, accessible title/description, and footer actions.
- Keep Market Charts out of scope for this refinement.

## Capabilities

### New Capabilities

- `graph-view-quick-detail-drawer-refinement`: Defines refinement requirements for Graph View quick detail to use a bottom Drawer, avoid double-open loading animation, and preserve canonical route behavior.

### Modified Capabilities

- None.

## Impact

- Affected components: `components/entity-quick-detail-sheet.tsx` should be replaced or renamed to a drawer-based app-level shell.
- Affected shadcn primitives: add `components/ui/drawer.tsx` via shadcn; this is the only intended `components/ui` addition.
- Affected routes: `app/(main)/@quickDetail/loading.tsx`, `error.tsx`, `not-found.tsx`, and intercepted quick detail pages for events/news articles may need shell usage updates.
- Affected UX: Graph View quick detail opens from the bottom, keeps graph context visible above, and no longer feels like two separate open animations.
- No backend API, DTO, permission key, Graph View canvas layout, or Market Charts behavior changes are expected.
