# item

2026-08-18 — official Base Nova registry wrapper via shadcn CLI view/dry-run; verdict: migrated and typechecked.

## Changed

- `components/ui/item.tsx`: replaced `Slot`/`asChild` in `Item` with Base UI `useRender` and `mergeProps`, preserving item variants, sizes, media, content, actions, and footer composition.
- `app/[lang]/(main)/dashboard-prototype/dashboard-prototype-view.tsx`: changed the event timeline item to `render={<LocalizedLink />}` while preserving localized navigation and all item content.
- Leftover Radix import scan is clean for the migrated files: no `radix-ui` or `@radix-ui` import remains in the wrapper or consumer.

## Left alone

- Dashboard item data, time/confidence metadata, affected-asset badges, item spacing, and all other Item consumers.
- `components/ui/toolbar.tsx` and `@radix-ui/react-toolbar`, which remain explicitly out of scope.

## Behavior changes

- Linked items now use Base UI `render`; the Radix-only `asChild` prop is intentionally removed. The event timeline link keeps its localized href and accessible label.

## Verify by hand

- Confirm event timeline rows remain fully clickable and keyboard-focusable, including item content and metadata.
- Confirm separators, badges, wrapping, timestamps, confidence text, and empty/loading dashboard states remain unchanged.
