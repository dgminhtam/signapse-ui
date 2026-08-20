# dialog

2026-08-18 — official Base Nova `@base-ui/react/dialog` wrapper via shadcn CLI dry-run/diff; verdict: migrated and typechecked.

## Changed

- Replaced the Radix Dialog root, trigger, portal, close, overlay, content, title, and description parts with the official Base Nova `@base-ui/react/dialog` implementation.
- Replaced `Overlay`/`Content` with Base UI `Backdrop`/`Popup` and converted wrapper-owned close buttons to the Base UI `render` contract.
- Replaced DialogTrigger and DialogClose `asChild` consumers with Base UI `render` composition in workspace, Telegram, and role-permission workflows.
- Replaced Telegram schedule `onEscapeKeyDown`/`onPointerDownOutside` handlers with Base UI `onOpenChange` reason handling and `eventDetails.cancel()` while preserving dirty/pending/discard behavior.
- Replaced the personal-notes `onCloseAutoFocus` workaround with the Base UI `finalFocus` contract.
- Leftover Radix import scan: no direct Radix import remains in `components/ui/dialog.tsx`.

## Left alone

- Controlled open state, form submission, pending/error state, validation, permissions, dialog content/layout classes, and close-only workflow logic.
- The existing overlay portal provider remains available as an external composition point for overlay-specific migrations; no active Dialog consumer is nested under that provider in this wrapper group.
- AlertDialog, Sheet, menu, and other remaining Radix wrappers.

## Behavior changes

- Dialog composition now uses Base UI `render`; no Radix `asChild` compatibility remains.
- Escape and outside-press behavior in the Telegram schedule dialogs now uses Base UI event reasons. Popover-originated outside presses are canceled, and dirty/pending dialogs open the existing discard flow instead of closing.
- Dialog portals use the official Base UI body portal by default. A provider-specific portal extension remains a separate task when an active Dialog usage requires it.

## Verify by hand

- Confirm controlled dialogs open/close from external state, Escape, outside press, close buttons, and submit actions.
- Confirm focus returns to the invoking trigger, including the personal-notes rename dialog.
- Confirm workspace, user, Telegram, model-picker, and role-permission dialogs retain labels, validation, pending state, and keyboard navigation.
- Confirm dirty/pending Telegram schedule dialogs block Escape/outside dismissal and open the existing discard confirmation.
