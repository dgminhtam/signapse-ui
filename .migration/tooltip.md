# tooltip

2026-08-18 — official Base Nova registry transcription plus external portal extension; verdict: migrated and typechecked.

## Changed

- `components/ui/tooltip.tsx`: replaced with the reviewed official Base Nova `@base-ui/react/tooltip` Provider, Root, Trigger, Portal, Positioner, Popup, and Arrow structure.
- `components/ui/tooltip-content-in-overlay.tsx:14`: added the app-only portal-container extension that preserves tooltip placement inside fullscreen overlay surfaces.
- `components/providers.tsx`: changed Provider delay from Radix `delayDuration` to Base `delay`.
- `components/ui/block-draggable.tsx`, `components/ui/column-node.tsx`, `components/ui/emoji-toolbar-button.tsx`, `components/ui/font-color-toolbar-button.tsx`, `components/ui/sidebar.tsx`, and `components/ui/toolbar.tsx`: converted trigger/content composition and retained the editor/sidebar overlay behavior.
- `app/[lang]/(main)/graph-view/graph-view-canvas.tsx`, `app/[lang]/(main)/market-charts/market-chart-workbench.tsx`, `app/[lang]/(main)/news-articles/news-article-detail-actions.tsx`, `app/[lang]/(main)/news-outlets/news-outlet-list.tsx`, `app/[lang]/(main)/telegram/telegram-destination-test-message-button.tsx`, `app/[lang]/(main)/users/user-list.tsx`, and `components/market-conversation-assistant/market-conversation-assistant.tsx`: converted application Tooltip consumers to Base `render` and the external content extension.
- Leftover Radix import scan: `rg -n "radix-ui|@radix-ui" components/ui/tooltip.tsx components/ui/tooltip-content-in-overlay.tsx` is clean.

## Left alone

- Tooltip labels, visibility conditions, disabled states, delay intent, keyboard/focus behavior, layout classes, and feature workflows.
- The Radix Toolbar primitive and its dependency remain out of scope; its Tooltip composition is updated only to consume the migrated Tooltip contract.
- No compatibility alias for `delayDuration` or `asChild` was added to the default wrapper.

## Behavior changes

- Base UI `delay`/`closeDelay` and `render` contracts replace the Radix-only Provider and trigger props.
- Tooltip content uses the external portal extension so existing fullscreen chart behavior remains available without mutating the official wrapper.
- Base Nova positioning and animation classes replace Radix CSS variable names.

## Verify by hand

- Confirm tooltips open on hover and keyboard focus, close on pointer leave/Escape, and remain readable in light/dark themes.
- Confirm Sidebar collapsed tooltips, editor drag/color/emoji tooltips, graph/user/news/Telegram tooltips, and market-chart fullscreen tooltips retain their labels and placement.
- Confirm delays remain intentional for toolbar/category and assistant action tooltips.
- Confirm tooltip triggers do not introduce hydration warnings on SSR-rendered pages.
