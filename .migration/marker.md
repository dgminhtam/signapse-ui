# marker

2026-08-18 — official Base Nova registry wrapper via shadcn CLI view/dry-run; verdict: migrated and typechecked.

## Changed

- `components/ui/marker.tsx`: replaced `Slot`/`asChild` in `Marker` with Base UI `useRender` and `mergeProps`, preserving marker variants, icon/content parts, and classes.
- No consumer contract change was required; the market conversation assistant currently uses the default marker element.
- Leftover Radix import scan is clean for `components/ui/marker.tsx`.

## Left alone

- Marker separator/border variants, icon and content semantics, message layout, and all current consumers.
- `components/ui/toolbar.tsx` and `@radix-ui/react-toolbar`, which remain explicitly out of scope.

## Behavior changes

- Custom markers now use Base UI `render`; the Radix-only `asChild` prop is intentionally removed.

## Verify by hand

- Confirm default, separator, and border markers preserve alignment, text wrapping, links, and icon semantics.
- Confirm marker content remains readable in light/dark mode and at narrow widths.
