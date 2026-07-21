## Context

Radix Sheet implements modal scroll isolation with `RemoveScroll`, allowing wheel input only within the Sheet content element. Shared dropdown content currently portals to `document.body`; therefore a tall Plate dropdown opened from Personal Notes is visually associated with the Sheet but sits outside its allowed DOM boundary. Its native `overflow-y-auto` is correct, yet the modal prevents the wheel event before native scrolling occurs.

The solution crosses the shared Sheet and dropdown wrappers. It must retain the generated wrapper behavior, work during server rendering, preserve nested overlay composition, and avoid weakening Sheet modality.

## Goals / Non-Goals

**Goals:**

- Portal dropdown content opened within a Sheet into that Sheet's content element.
- Preserve the default body portal for dropdowns outside a Sheet.
- Allow the existing Insert menu overflow surface to scroll by mouse wheel.
- Preserve modal focus isolation, background scroll locking, keyboard behavior, and existing menu sizing.

**Non-Goals:**

- Replacing native menu overflow with `ScrollArea`.
- Making Personal Notes Sheet non-modal or replacing Radix scroll isolation.
- Changing Plate plugins, menu entries, editor content, or dropdown dimensions.
- Retrofitting every non-dropdown portal wrapper in this change.

## Decisions

### Provide the portal boundary through React context

Add a small overlay-container context whose value is `HTMLElement | null`. `SheetContent` captures its mounted content element and provides it to descendants. React context follows the logical component tree across portals and naturally selects the nearest provider for nested Sheets.

This avoids querying global DOM selectors, coupling Plate to Personal Notes, or threading a container prop through Plate plugin configuration.

### Let shared dropdown content consume the nearest container

`DropdownMenuContent` reads the context and passes a defined value to `DropdownMenuPrimitive.Portal.container`. When the context is null, it leaves `container` undefined so Radix retains its default `document.body` portal. Initial server and client renders therefore share the same null state, while the mounted Sheet supplies its element before a user can open a dropdown.

The Sheet content ref must remain compatible with a caller-provided ref when capturing the internal portal container.

### Keep native overflow scrolling

The Insert menu already owns `max-h-[500px]` and `overflow-y-auto`. Once its portal is inside the modal's allowed subtree, browser-native scrolling is sufficient. Adding `ScrollArea` would add markup and behavior without addressing the scroll-lock boundary that causes the defect.

### Preserve modal behavior

The Sheet remains modal. The implementation will not use `modal={false}`, event interception, or a custom `RemoveScroll` layer, because those alternatives either weaken accessibility/background isolation or work around the symptom instead of correcting portal ownership.

## Risks / Trade-offs

- [Portaling into Sheet content changes the dropdown's containing DOM subtree] → Retain Radix positioning and the existing dropdown z-index, and verify both Sheet-hosted and standalone editor compositions.
- [Capturing Sheet content can overwrite a consumer ref] → Compose the internal callback with the forwarded ref rather than replacing it.
- [A future portaled primitive may exhibit the same modal-boundary issue] → Keep this change limited to the observed shared dropdown path; adopt the same context only when another primitive demonstrably requires it.
