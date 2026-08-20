# bubble

2026-08-18 — official Base Nova registry wrapper via shadcn CLI view/dry-run; verdict: migrated and typechecked.

## Changed

- `components/ui/bubble.tsx`: replaced `Slot`/`asChild` in `BubbleContent` with Base UI `useRender` and `mergeProps`, preserving bubble variants, alignment, reactions, and content classes.
- No consumer contract change was required; the market conversation assistant currently uses the default content element.
- Leftover Radix import scan is clean for `components/ui/bubble.tsx`.

## Left alone

- Conversation message structure, localized labels, bubble variants, alignment, reactions, and current max-width/spacing behavior.
- `components/ui/toolbar.tsx` and `@radix-ui/react-toolbar`, which remain explicitly out of scope.

## Behavior changes

- Custom bubble content now uses Base UI `render`; the Radix-only `asChild` prop is intentionally removed.

## Verify by hand

- Confirm user and assistant bubbles keep alignment, variant colors, wrapping, links, focus rings, and reaction placement.
- Confirm the conversation surface remains readable and keyboard-navigable while messages stream.
