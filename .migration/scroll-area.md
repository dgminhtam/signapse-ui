# scroll-area

2026-08-18 — official Base Nova `@base-ui/react/scroll-area` wrapper via shadcn CLI dry-run/diff; verdict: migrated and typechecked.

## Changed

- Replaced the Radix ScrollArea parts with the official Base Nova `@base-ui/react/scroll-area` root, viewport, scrollbar, thumb, and corner parts.
- Updated root and scrollbar prop types to the Base UI contracts.
- Leftover Radix import scan: no direct Radix import remains in `components/ui/scroll-area.tsx`.

## Left alone

- Existing viewport/scrollbar classes, orientation default, children composition, and max-height consumers.
- Personal notes, model picker, and market-chart scroll areas.

## Behavior changes

- None intended. The wrapper preserves the same viewport and scrollbar composition while using Base UI's parts.

## Verify by hand

- Confirm vertical scrolling, thumb rendering, keyboard focus, and nested content sizing in dialogs and chart panels.
- Confirm custom viewport selectors continue to match the `data-slot` marker.
