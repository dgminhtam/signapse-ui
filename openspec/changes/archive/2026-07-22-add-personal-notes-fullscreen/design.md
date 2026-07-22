## Context

Personal Notes currently renders as a controlled right-side Sheet with a compact summary rail, a shared Plate editor, and a floating Save control. Market Charts already provides the desired native full-screen interaction through `requestFullscreen()`, `document.fullscreenElement`, and `fullscreenchange`. The shared Sheet wrapper also portals nested Radix overlays into the Sheet content, so rename and delete dialogs can remain visible when that content becomes the browser's full-screen element.

The current specs still contain older requirements for a standalone `/notes` expansion action and a Save action row even though both UI patterns have been removed.

## Goals / Non-Goals

**Goals:**

- Let every user who can open Personal Notes expand the complete Sheet into native browser full-screen mode.
- Place an accessible icon-only full-screen toggle beside a smaller New note action.
- Preserve the note list, editor, floating Save control, nested menus/dialogs, dirty-state flush behavior, and keyboard shortcuts across full-screen transitions.
- Align the affected Personal Notes specs with the current Sheet-only and floating-save composition.

**Non-Goals:**

- Restoring a `/notes` route or navigation action.
- Full-screening only the Plate editor or hiding the summary rail.
- Adding a CSS pseudo-full-screen fallback, shared full-screen hook, dependency, or backend change.
- Modifying the shared Sheet or Plate toolbar wrappers.

## Decisions

- The `SheetContent` element will own a local ref and will be the target of `requestFullscreen()`. Full-screening the complete content preserves the existing two-pane workspace and keeps descendants inside the browser-visible full-screen subtree.
- Local `isFullscreen` state will be derived from `document.fullscreenElement === sheetContentRef.current` in a document-level `fullscreenchange` listener. This handles both the toggle and browser Escape without guessing whether the asynchronous request succeeded.
- The toggle will follow the Market Charts error path: check `document.fullscreenEnabled`, await `requestFullscreen()` or `document.exitFullscreen()`, and show localized error toasts for unavailable or rejected requests. A CSS fallback is rejected because the requested behavior is parity with Market Charts and the native failure path is already established.
- Normal mode will retain the current approximately 60% desktop Sheet width. Full-screen state will override only route-local Sheet layout classes needed to remove the max width, side border, and shadow; the shared Sheet wrapper remains unchanged.
- The rail action row will use the matching built-in standard icon-button size for New note and the full-screen toggle. Both controls expose localized accessible names, the toggle also exposes `aria-pressed`; New note retains its existing permission and successful-list-load conditions, while full-screen remains available independently of create permission.
- Nested Radix menus and dialogs will continue using the Sheet's existing overlay portal container. No separate overlay reparenting will be introduced.
- Existing persistence behavior remains untouched: full-screen transitions do not change note identity, tear down Plate, or request a dirty flush.

## Risks / Trade-offs

- Native Fullscreen API support or permission can be unavailable → keep the established capability check, rejected-promise handling, and localized toast feedback; do not pretend a CSS-expanded Sheet is equivalent.
- Browser Escape exits full-screen outside React's direct control → synchronize from `fullscreenchange`; the Sheet remains open and focus stays within its existing dialog scope.
- Sheet side-width and border variants can constrain the full-screen element → apply state-specific overrides in the Personal Notes component and verify the full viewport is used.
- Global toasts are not descendants of the full-screen element → unavailable/failure feedback occurs before a successful transition; save errors remain inline and nested Radix overlays already portal inside the Sheet.
