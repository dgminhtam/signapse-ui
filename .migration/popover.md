# popover

2026-08-18 — official Base Nova registry transcription plus external app extensions; verdict: migrated and typechecked.

## Changed

- `components/ui/popover.tsx`: replaced with the reviewed official Base Nova `@base-ui/react/popover` wrapper using `Portal`, `Positioner`, `Popup`, `Title`, and `Description`.
- `components/ui/popover-content-in-overlay.tsx:21`: added the app-only portal-container extension for fullscreen chart surfaces.
- `components/ui/popover-anchor.tsx:31`: added the app-only `Positioner.anchor` composition for Plate/editor usages that previously depended on Radix `PopoverAnchor`; the default wrapper remains registry-shaped.
- `components/market-conversation-assistant/market-conversation-assistant.tsx`, `app/[lang]/(main)/telegram/telegram-schedule-form.tsx`, `app/[lang]/(main)/market-charts/market-chart-canvas.tsx`, and `app/[lang]/(main)/market-charts/market-chart-workbench.tsx`: moved floating chart, assistant, and schedule Popovers to Base `render` and the overlay extension.
- `components/ui/code-block-node.tsx`, `components/ui/code-drawing-node.tsx`, `components/ui/column-node.tsx`, `components/ui/date-node.tsx`, `components/ui/emoji-toolbar-button.tsx`, `components/ui/equation-node.tsx`, `components/ui/font-size-toolbar-button.tsx`, `components/ui/footnote-node.tsx`, `components/ui/media-toolbar.tsx`, and `components/ui/table-node.tsx`: updated consumers to Base `render`, `initialFocus`, `finalFocus`, and `onOpenChange` reason/cancel contracts.
- Leftover Radix import scan: `rg -n "radix-ui|@radix-ui" components/ui/popover.tsx components/ui/popover-content-in-overlay.tsx components/ui/popover-anchor.tsx` is clean.
- Leftover Radix import scan: no direct Radix import remains in `components/ui/popover.tsx` or its two extensions.

## Left alone

- Popover open state, editor selection/formatting behavior, form state, chart interactions, fullscreen layout, content classes, and business workflows.
- The official default wrapper does not expose a compatibility `PopoverAnchor`; the anchor requirement is isolated to the external extension.
- `@radix-ui/react-toolbar` and the Plate/editor Toolbar primitive remain outside this migration; only its migrated Tooltip call site is adapted where required.

## Behavior changes

- `asChild` is replaced by Base UI `render` at consumers.
- The fullscreen chart and editor Popovers use the external portal/anchor extensions; ordinary Popovers use the official Base UI portal and positioning structure.
- Equation Escape cancellation and editor focus behavior now use Base UI callback contracts. Radix-only focus callbacks are not retained in the default wrapper.

## Verify by hand

- Open chart controls in normal and fullscreen modes and confirm placement, collision handling, Escape, outside press, focus restoration, and responsive sizing.
- Confirm code drawing, column, media, table, footnote, emoji, date, font-size, equation, Telegram schedule, and assistant Popovers retain their existing interactions.
- Confirm editor selection, content-editable boundaries, and anchor placement remain stable when the Popover is opened and closed.
- Confirm SSR output hydrates without adding a mount-only or hydration-suppression workaround.
