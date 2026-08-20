# button-group

2026-08-18 — official Base Nova registry wrapper via shadcn CLI view/dry-run; verdict: migrated and typechecked.

## Changed

- `components/ui/button-group.tsx`: replaced `Slot`/`asChild` in `ButtonGroupText` with Base UI `useRender` and `mergeProps`, and synced the orientation selectors to the reviewed Base Nova output.
- No consumer contract change was required; the graph-view consumer uses the group and separator composition directly.
- Leftover Radix import scan is clean for `components/ui/button-group.tsx`.

## Left alone

- Button-group orientation, separator composition, consumer layout, and Nova classes outside the reviewed registry selector change.
- `components/ui/toolbar.tsx` and `@radix-ui/react-toolbar`, which remain explicitly out of scope.

## Behavior changes

- `ButtonGroupText` now accepts Base UI `render` instead of the Radix-only `asChild` prop. Group joining uses the official `data-slot` selectors.

## Verify by hand

- Confirm horizontal and vertical groups keep their joined borders, focus stacking, separator orientation, and keyboard order.
- Confirm the graph-view control group remains usable at desktop and narrow widths.
