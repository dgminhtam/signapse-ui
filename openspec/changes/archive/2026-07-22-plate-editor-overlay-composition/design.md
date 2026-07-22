## Context

`SheetContent` already exposes its mounted element through `OverlayPortalContainerProvider`, and shared dropdown, dialog, and alert-dialog wrappers consume that boundary. The Plate emoji picker instead composes `@radix-ui/react-popover` directly and leaves its portal container undefined, so Radix mounts the picker under `document.body`. That content falls outside the modal Sheet's interaction boundary and selecting an emoji dismisses the Sheet before Plate receives the button click.

The local shadcn Popover wrapper also currently uses the default body portal. Fixing only the emoji component would restore the observed path but would duplicate the portal policy and retain a direct primitive import in Plate UI.

## Goals / Non-Goals

**Goals:**

- Make the Plate emoji picker interactive inside the Personal Notes modal Sheet.
- Compose the picker through the local shadcn Popover wrapper.
- Make shared shadcn Popovers honor the nearest Sheet portal container.
- Preserve the standard body portal and current interaction behavior outside Sheets.
- Preserve Sheet modality, focus isolation, and background scroll locking.

**Non-Goals:**

- Making the Sheet or emoji Popover non-modal through event workarounds.
- Changing emoji data, search, category navigation, insertion transforms, or recent-emoji storage.
- Retrofitting overlay primitives that do not use the shared Popover wrapper.
- Redesigning the Plate toolbar or emoji picker.

## Decisions

### Put portal ownership in the shared Popover wrapper

`PopoverContent` will read `useOverlayPortalContainer()` and pass the nearest defined element to `PopoverPrimitive.Portal.container`. With no provider, it will leave the container undefined so Radix retains its default body portal.

This matches the existing `DropdownMenuContent` solution and keeps modal-boundary knowledge out of Plate. A one-off container lookup in `EmojiPopover` was rejected because it would duplicate shared overlay policy and leave other shadcn Popovers exposed to the same composition defect.

### Migrate the emoji picker to the local shadcn wrapper

`EmojiPopover` will compose `Popover`, `PopoverTrigger`, and `PopoverContent` from `@/components/ui/popover` instead of importing Radix Popover directly. The controlled `open` and `onOpenChange` behavior remains unchanged.

The shadcn `PopoverContent` owns surface chrome and stacking. The emoji picker will retain only its required flex layout and dimensions so the migration does not produce nested borders, backgrounds, padding overrides, shadows, or manual z-index styling.

### Preserve modal semantics

The fix will not set the Sheet to non-modal, intercept outside-interaction events, or delay Sheet dismissal. Correct portal ownership makes the picker part of the allowed modal subtree without weakening keyboard, focus, or background interaction isolation.

## Risks / Trade-offs

- [Shared Popovers opened inside a Sheet will move from `document.body` into the Sheet content element] → Preserve Radix positioning and test standalone and Sheet-hosted compositions.
- [Adopting shadcn Popover chrome can duplicate the emoji picker's existing surface styles] → Remove consumer-owned surface chrome and retain only layout constraints.
- [The Sheet provider is null during initial render] → Keep `undefined` as the fallback; a user cannot open the Popover before the mounted Sheet content ref supplies the container.
- [Nested Sheets provide multiple candidate containers] → React context selects the nearest provider, matching the existing dropdown behavior.

## Migration Plan

Update the shared Popover wrapper first, then migrate the emoji picker and verify both Personal Notes and `/editor`. Rollback is limited to those two source files; there is no data or dependency migration.

## Open Questions

None.
