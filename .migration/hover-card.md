# hover-card

2026-08-18 — official Base Nova Preview Card registry mapping; verdict: migrated and typechecked.

## Changed

- `components/ui/hover-card.tsx`: replaced with the reviewed official Base Nova Preview Card mapping from `@base-ui/react/preview-card`.
- `components/market-conversation-assistant/market-conversation-assistant.tsx:1170`: updated message tracking previews from Radix `asChild`/root delay props to Base `render`, `delay`, and `closeDelay` contracts.
- `components/ui/footnote-node.tsx:156`: updated footnote previews to the Base `render` and trigger delay contracts.
- Leftover Radix import scan: `rg -n "radix-ui|@radix-ui" components/ui/hover-card.tsx` is clean.

## Left alone

- Preview content, message/footnote state, click navigation, pointer tracking, labels, layout classes, and existing workflow behavior.
- The official `PreviewCard` mapping is used; no custom Radix hover-card compatibility layer was added.

## Behavior changes

- HoverCard now uses Base UI Preview Card semantics. Open delay is applied to the trigger because Base Preview Card does not expose the Radix root `openDelay` prop.
- Base Nova positioning and animation classes replace the Radix hover-card transform-origin variable.

## Verify by hand

- Confirm assistant message tracking previews open after the intended delay, close after the intended delay, and preserve jump-to-message behavior.
- Confirm footnote previews show resolved/unresolved content and retain pointer/click behavior.
- Confirm keyboard focus, Escape, outside interaction, responsive placement, and light/dark styling remain accessible and aligned with Nova.
