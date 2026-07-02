## Context

The desktop market chart annotation popup is rendered through the local shadcn `Popover` wrapper, but `renderAnnotationPopup()` currently passes a custom shell inside `PopoverContent`: `p-0`, custom border/header markup, and a native `overflow-y-auto` body. The user wants the same behavior standardized around shadcn composition.

The popup must keep all existing annotation logic: group count, group color, close action, event opening, event list, outcome section, and mobile fallback behavior.

## Goals / Non-Goals

**Goals:**

- Use `PopoverHeader` and `PopoverTitle` for the popup shared header area.
- Use `ScrollArea` for the popup's scrollable content region.
- Keep `PopoverContent` class overrides limited to layout/containment such as width and responsive display.
- Preserve current annotation data mapping, grouping, selection, close, event click, and outcome rendering.

**Non-Goals:**

- Do not change annotation API contracts.
- Do not redesign event cards, outcome contents, marker colors, or marker grouping logic.
- Do not update shadcn wrapper internals.
- Do not add new dependencies or new shared abstractions.

## Decisions

- Compose within existing wrappers instead of editing `components/ui/popover.tsx`.
  - Rationale: repo policy says feature code should use wrapper defaults and wrapper chrome should stay aligned with shadcn.
  - Alternative rejected: changing Popover defaults globally would affect unrelated editor and assistant popovers.

- Replace the custom header shell with `PopoverHeader`/`PopoverTitle`.
  - Rationale: this uses the shadcn Popover API documented for rich content and removes local header chrome.
  - Alternative rejected: keeping custom header plus only replacing body scroll would leave the main chrome drift in place.

- Use `ScrollArea` only for the body content.
  - Rationale: the header and close action should remain visible while long grouped annotation content scrolls.
  - Alternative rejected: wrapping the entire `PopoverContent` in `ScrollArea` would allow the header to scroll away.

- Keep the existing custom group-color treatment for the event-count badge if needed.
  - Rationale: marker/group color communicates annotation direction and is existing product behavior; this is chart-specific status styling, not Popover primitive chrome.
  - Alternative considered: plain `Badge variant="secondary"` is more shadcn-native but would drop the directional group color signal the user asked to keep earlier.

## Risks / Trade-offs

- ScrollArea can alter inner spacing or viewport height behavior -> keep the same max-height constraint on the scrollable body and verify long grouped annotations.
- Strict shadcn chrome may make the popup slightly less dense -> preserve the compact body content and avoid unrelated visual redesign.
- The mobile fallback uses the same detail component but not the desktop Popover shell -> keep fallback logic unchanged unless it shares the same overflow issue.
