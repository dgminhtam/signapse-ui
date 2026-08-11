## Why

Browser Fullscreen API only keeps the fullscreen element and its descendants visible, while several Radix, Vaul, and Ariakit overlays still portal to `document.body`. As a result, controls in the fullscreen market chart (and the fullscreen Personal Notes editor) can change state without showing an interactive overlay; the existing local portal-container pattern needs to be applied consistently to every affected overlay family.

## What Changes

- Define a shared fullscreen overlay-containment contract: overlays rendered below a local fullscreen surface use that surface as their portal host, while overlays outside such a surface retain the existing body-portal fallback.
- Extend the shared overlay wrappers that can participate in the affected flows, including Select, Tooltip, Drawer/Vaul, and Plate/Ariakit inline combobox content, reusing the existing nearest-host context.
- Provide the local overlay host at the market chart `ChartSurface` boundary so chart toolbar, canvas, drawing-toolbar, annotation, dropdown, dialog, alert-dialog, and quick-detail surfaces remain visible and interactive in fullscreen mode.
- Preserve the existing Personal Notes Sheet host, nested-provider nearest-host behavior, focus management, Escape/outside-dismissal behavior, and normal non-fullscreen rendering.
- Audit ContextMenu and other portal-based descendants for fullscreen callers; change them only when the audit confirms they can render inside a covered fullscreen surface.
- Add repository-verifiable checks and regression coverage for normal and fullscreen overlay behavior across market charts and Personal Notes.

## Capabilities

### New Capabilities

- `fullscreen-overlay-containment`: Keep portal-based overlay content inside the active local fullscreen surface while preserving default and nested overlay behavior.

### Modified Capabilities

<!-- Existing specs already describe the market-chart popup and Plate Sheet portal behavior; this change adds the cross-cutting fullscreen contract without removing those requirements. -->

## Impact

- Shared UI wrappers under `components/ui/`, especially portal-backed Select, Tooltip, Drawer/Vaul, and any confirmed ContextMenu path.
- Plate/Ariakit inline combobox composition and Personal Notes editor overlays.
- Market chart workbench, canvas, drawing toolbar, annotation controls, and local entity quick-detail rendering.
- No backend API, dependency, route, or persistence changes are expected.
