## Context

The browser Fullscreen API exposes only the fullscreen element and its DOM descendants. The market chart uses its chart surface `<section>` as that element, but several shared overlays still mount through their primitive's default `document.body` portal. Those nodes are outside the fullscreen top-layer subtree, so the trigger can update state while the overlay is invisible or non-interactive.

The repository already has the required composition pattern: `OverlayPortalContainerProvider` and `useOverlayPortalContainer` provide the nearest local host, and Popover, DropdownMenu, Dialog, AlertDialog, and Sheet already use it. Sheet captures its content element with a callback ref/state pair so the provider is not rendered with a transient `null` host. This change applies that pattern to the remaining affected portal families and to the market chart boundary.

The relevant fullscreen flows are the market chart workbench and Personal Notes. The chart surface contains the top toolbar, canvas, drawing toolbar, and annotation controls; the local entity quick-detail drawer must also resolve the chart host when opened from a fullscreen annotation. Personal Notes already supplies a Sheet-local host, but Plate's Ariakit inline combobox still defaults to the body.

## Goals / Non-Goals

**Goals:**

- Keep portal-backed overlays opened below a local fullscreen surface inside that surface.
- Preserve body-portal behavior when no local host exists.
- Preserve nearest-provider behavior for nested Sheets, dialogs, and other overlay compositions.
- Cover market chart popovers and the related Select, Tooltip, DropdownMenu, Dialog, AlertDialog, Drawer, and Plate combobox paths.
- Preserve focus restoration, keyboard navigation, Escape/outside dismissal, collision handling, scrolling, and existing visual treatment.

**Non-Goals:**

- Replacing Radix, Vaul, Ariakit, or the existing portal-container context.
- Changing the Fullscreen API lifecycle, chart layout, overlay styling, routes, APIs, persistence, or dependencies.
- Moving every portal in the application into a global local root.
- Changing ContextMenu without a confirmed caller below a covered fullscreen boundary.
- Redesigning the Personal Notes Sheet; its existing host remains the reference behavior.

## Decisions

### 1. Reuse the existing nearest-host context

The shared `OverlayPortalContainerProvider` remains the only host-selection mechanism. A wrapper reads `useOverlayPortalContainer()` and passes the resolved element to its primitive portal; when the value is `null`, the wrapper passes the primitive's normal default so existing body behavior is unchanged.

This is preferred over a new fullscreen-specific context because nested providers already express the correct rule: the nearest overlay boundary owns its descendants. It also keeps the fix compatible with the existing Sheet and Plate block-selection work.

### 2. Add host support only at shared portal boundaries

Update the shared Select, Tooltip, Drawer/Vaul, and Plate/Ariakit inline-combobox portal boundaries. Preserve any explicit caller-supplied container when the underlying primitive supports one. Keep Popover, DropdownMenu, Dialog, AlertDialog, and Sheet on their existing host-aware implementations.

For Ariakit, use its installed `Portal` host API (`portalElement`) rather than wrapping or reimplementing the combobox. For Vaul, pass the nearest host through the existing Drawer portal/root contract without changing the public Drawer composition used by callers.

ContextMenu will be checked during implementation. If no covered fullscreen caller exists, it remains unchanged to avoid speculative shared-wrapper behavior changes.

### 3. Capture the chart surface as a stateful host

At the market chart fullscreen boundary, capture the surface element with the existing callback-ref/state pattern and render the provider with that element as its value. Do not read `surfaceRef.current` directly as the provider value because the initial render would not trigger a rerender when the host becomes available.

The provider scope will include all chart descendants and the local entity quick-detail drawer. This lets the drawer portal its fixed surface into the fullscreen section while keeping its existing state and trigger flow. The chart surface already fills the fullscreen viewport; existing primitive collision and fixed-position behavior remain responsible for placement.

### 4. Keep normal mode and nested overlay behavior as the compatibility contract

Outside fullscreen, no provider value means the primitives retain their current body portals. Inside Personal Notes, the Sheet content remains the local host and wins over any outer provider. A nested provider must continue to resolve to the nearest host, so a nested Sheet or dialog can isolate its own overlays without chart-level leakage.

### 5. Verify behavior through static and repository checks

The implementation will use the repository's available lint, typecheck, formatting, and OpenSpec validation commands. Static checks will confirm that each affected wrapper consumes the shared hook and that the chart provider scope includes all identified overlay callers. Manual browser/fullscreen checks are recorded as user-owned QA rather than archive-blocking repository checkboxes.

## Risks / Trade-offs

- [Risk] A shared wrapper change affects many existing call sites. → Keep the null-host path identical to the current primitive default and run lint/typecheck plus focused source checks.
- [Risk] The chart surface currently uses `overflow-hidden`, and a non-fixed primitive could be clipped near an edge. → Verify Select, Tooltip, Drawer, and Popover placement in fullscreen; retain the primitive collision behavior and introduce no extra host layer unless an affected primitive demonstrably needs one.
- [Risk] Vaul's container handling may couple portal placement with scroll-lock or gesture behavior. → Test open, close, drag, Escape, focus return, and background interaction for the local quick-detail drawer in both modes.
- [Risk] Moving the quick-detail render under the chart host can change stacking or lifecycle assumptions. → Keep the existing drawer state and content unchanged; only change its provider/portal scope and verify fixed positioning.
- [Risk] A portal can render once before its callback host is populated. → Use callback-ref state and keep the body fallback until the host is non-null; do not construct a new host per render.

## Migration Plan

1. Update the shared portal boundaries and add the fullscreen provider scope without changing consumer APIs.
2. Run formatting, lint, typecheck, OpenSpec validation, and targeted static checks.
3. Perform user-owned browser QA for market chart and Personal Notes in normal and fullscreen modes, including nested overlays and keyboard dismissal.
4. Rollback is a source revert of this change; no data or backend migration is required.

## Open Questions

- The implementation audit will confirm whether any ContextMenu instance is rendered below a covered fullscreen surface. No ContextMenu change is needed if the answer is no.
