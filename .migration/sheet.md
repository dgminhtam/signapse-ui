# sheet

2026-08-18 — official Base Nova `@base-ui/react/dialog` Sheet wrapper plus external portal-container extension; verdict: migrated and typechecked.

## Changed

- Replaced `components/ui/sheet.tsx` with the current shadcn Base Nova Sheet `Root`, `Trigger`, `Close`, `Portal`, `Backdrop`, `Popup`, header, footer, title, and description composition.
- Replaced Radix `Overlay`/`Content` with Base UI `Backdrop`/`Popup` and replaced the close button's `asChild` composition with Base UI `render`.
- Added `components/ui/sheet-content-in-overlay.tsx`; it preserves the existing `OverlayPortalContainerProvider` behavior and composes the consumer ref with the Base UI popup ref.
- Repointed the model-picker sheet, mobile sidebar, and personal-notes quick sheet to `SheetContentInOverlay` so nested menus, popovers, selects, and editor overlays retain their local portal host.
- Replaced the personal-notes `SheetTrigger asChild` callsite with the Base UI `render` contract.
- Leftover scan is clean for Sheet:
  `rg -n 'Sheet(Trigger|Close|Content|Overlay|Portal)\\s+asChild|@radix-ui/react-dialog|onCloseAutoFocus|onOpenAutoFocus' components/ui/sheet.tsx components/ui/sheet-content-in-overlay.tsx app components -g '*.tsx'`

## Left alone

- Existing controlled open state, side values, IDs, fullscreen ref, close-button visibility, layout classes, labels, and sheet business workflows.
- The default wrapper's official body portal behavior; local portal-container behavior exists only in the external `SheetContentInOverlay` extension.
- `components/ui/toolbar.tsx` and its `@radix-ui/react-toolbar` dependency; Toolbar is explicitly out of scope.

## Behavior changes

- Sheet transitions now use Base UI starting/ending-style attributes from the current registry instead of Radix state attributes.
- Base UI owns focus, Escape, dismissal, and close behavior; no Radix-only props or aliases remain.
- Consumer SheetContent uses the external extension to keep nested overlays inside the Sheet/fullscreen surface; future consumers can use the official default wrapper when a body portal is desired.

## Verify by hand

- Open and close the model-picker Sheet, mobile sidebar Sheet, and personal-notes Sheet from mouse, keyboard, and Escape.
- Confirm top/right/bottom/left positioning, responsive width, overlay animation, outside-click behavior, close-button visibility, and focus restoration.
- Confirm nested DropdownMenu, Popover, Select, editor, and fullscreen interactions remain inside the personal-notes or sidebar surface where applicable.
