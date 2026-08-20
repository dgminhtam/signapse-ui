# badge

2026-08-18 — official Base Nova registry wrapper via shadcn CLI view/dry-run; verdict: migrated and typechecked.

## Changed

- `components/ui/badge.tsx`: replaced the Radix `Slot`/`asChild` path with the Base UI `useRender` and `mergeProps` contract while preserving the Nova variants and classes.
- `app/[lang]/(main)/news-articles/[id]/page.tsx`: changed the external-link badge to `render={<a />}` and preserved its new-tab semantics and localized content.
- Leftover Radix import scan is clean for the migrated files: no `radix-ui` or `@radix-ui` import remains in `components/ui/badge.tsx` or its consumer.

## Left alone

- Existing badge variants, size, icon treatment, status semantics, and all other badge consumers.
- `components/ui/toolbar.tsx` and `@radix-ui/react-toolbar`, which remain explicitly out of scope.

## Behavior changes

- Custom badge elements now use Base UI `render`; the Radix-only `asChild` prop is intentionally removed.

## Verify by hand

- Confirm default, outline, destructive, and link badges retain their Nova chrome in light and dark mode.
- Open the news article original-link badge and confirm keyboard focus, external target behavior, accessible text, and the trailing icon.
