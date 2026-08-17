# alert-dialog

## Changed

- Replaced the Radix AlertDialog root, trigger, portal, overlay, content, title, and description parts with the official Base Nova `@base-ui/react/alert-dialog` wrapper.
- Replaced Radix `Overlay`/`Content` with Base UI `Backdrop`/`Popup`; `AlertDialogCancel` now uses Base UI `Close` with the official Button render composition.
- Replaced all AlertDialogTrigger `asChild` consumers with Base UI `render` composition, including the custom trigger and tooltip-wrapped trigger cases.
- Added `components/ui/alert-dialog-content-in-overlay.tsx` as an external composition extension for the fullscreen market-chart portal container; the default wrapper remains registry-shaped.
- Replaced the personal-notes delete dialog `onCloseAutoFocus` workaround with Base UI `finalFocus`.
- Narrowed `CommandDialog` children to `ReactNode` because Base UI root props also allow payload render functions.
- Leftover Radix import scan: no direct Radix import remains in `components/ui/alert-dialog.tsx` or the AlertDialog portal extension.

## Left alone

- Controlled open state, delete/clear handlers, pending/error state, permissions, labels, confirmation copy, and existing dialog layout classes.
- `components/ui/toolbar.tsx`, its `@radix-ui/react-toolbar` dependency, and all other remaining Radix-backed wrappers.
- The default AlertDialog portal uses the official Base UI body portal; only the active fullscreen market-chart consumer opts into the external portal-container extension.

## Behavior changes

- AlertDialog composition now uses Base UI `render`; Radix `asChild` is no longer accepted.
- The official Base UI wrapper exposes `AlertDialogAction` as the Nova Button and `AlertDialogCancel` as Base UI `Close` + Button. Existing async action handlers and controlled state remain owned by their consumers.
- Escape, outside-click dismissal, modal focus handling, and SSR-safe body portal behavior come from Base UI. The fullscreen market-chart confirmation keeps its local surface portal through the extension.

## Verify by hand

- Confirm destructive confirmations open from every migrated trigger and preserve pending, error, cancel, and delete/clear behavior.
- Confirm Escape, outside-click, cancel, action, focus restoration, and keyboard navigation for AlertDialog consumers.
- Confirm personal-notes delete focus returns to the last action trigger.
- Confirm market-chart clear-all confirmation mounts inside the fullscreen surface in normal and fullscreen modes.
- Confirm SSR/hydration does not introduce overlay or portal warnings.
