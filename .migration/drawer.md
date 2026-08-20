# drawer

2026-08-18 — official Base Nova `@base-ui/react/drawer` wrapper via shadcn CLI dry-run/diff; verdict: migrated and typechecked.

## Changed

- Replaced the Vaul implementation in `components/ui/drawer.tsx` with the official Base Nova Drawer Root context, Backdrop, Viewport, Popup, swipe handle, Content, title, description, header, and footer parts.
- Updated `app/[lang]/(main)/local-entity-quick-detail-drawer.tsx` to use the Base UI drawer contract and the official sample composition: default intrinsic sizing, default shell chrome, `showSwipeHandle`, a title-only header, no footer actions, and a scrollable `flex-1 overflow-y-auto p-4` content region.
- Added `components/ui/drawer-content-in-overlay.tsx` as a named app extension for the existing `OverlayPortalContainerProvider`; the canonical wrapper remains registry-shaped.
- Removed `vaul` from `package.json` and `pnpm-lock.yaml` after confirming no other source consumer remains.
- Leftover scan: no `vaul` import or direct Radix Dialog dependency remains in the Drawer implementation or consumer.

## Left alone

- Quick-detail data loading, permission checks, localized copy, action links, and feature-specific content states.
- The official default Drawer body portal behavior; only the quick-detail consumer opts into the local overlay container through the external extension.

## Behavior changes

- Drawer open/close, swipe direction, swipe handle, nested-surface behavior, Escape, outside-click dismissal, focus management, and responsive positioning now come from Base UI.
- Quick-detail height now follows Base UI intrinsic sizing and its viewport cap instead of a consumer-provided `min(90svh, 960px)` height; long content scrolls inside the sample-aligned content region.
- The quick-detail footer and both footer actions are intentionally omitted; Base UI swipe, Escape, outside-click, and controlled root dismissal remain available.
- The fullscreen market-chart composition keeps the quick-detail Drawer inside the supplied surface; when no overlay container is provided, the extension falls back to the normal body portal.

## Verify by hand

- Confirm quick-detail open/close behavior, swipe direction/handle behavior, focus restoration, Escape, outside-click, portal placement, SSR/hydration, and responsive sizing.
