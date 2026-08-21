## Why

The same Signapse entity quick detail appears as a right-side sheet on a wide Dashboard but as a bottom sheet in Graph View and Market Charts. The shared content and interaction are already consistent, so the owner-specific desktop geometry creates an unnecessary visual and behavioral distinction for the same reading task.

## What Changes

- Standardize all approved Quick Detail owners on the Dashboard's desktop right-side-sheet geometry from an effective CSS viewport of `1440px`.
- Keep the existing profile widths: Event inspection at `32rem`, Article reader at `44rem`, both at `100dvh`; retain the established bottom-sheet policy below `1440px`.
- Preserve owner-local state, Graph node-inspector selection, Market Chart annotation hand-off/restore, focus return, fullscreen portal containment, and resize/zoom session continuity.
- Synchronize active design documentation and OpenSpec requirements with the unified policy, including the canonical header policy and replacement of the legacy “quick view” guide name. Archived change history remains untouched.
- Add focused resolver and browser coverage for the shared desktop placement and host-specific restoration behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `workspace-local-quick-detail-overlays`: make wide-desktop placement common to every approved owner while retaining responsive, focus, fullscreen, and state-session guarantees.
- `graph-view-quick-detail-drawer-refinement`: replace Graph View's desktop-only bottom-drawer requirement with the shared right-side-sheet policy while preserving its inspector hand-off behavior.
- `entity-quick-detail-overlay-documentation`: require active documentation to describe the unified desktop policy and canonical Quick Detail terminology.

## Impact

- Affected UI: the shared Quick Detail presentation resolver and its Dashboard, Graph View, and Market Charts consumers.
- Affected behavior: wide-desktop Graph View and Market Charts Event inspection, plus wide-desktop Graph View Article reader, move from bottom to right placement.
- Affected documentation and validation: active design guidance, active OpenSpec specs, the legacy Quick Detail guide, resolver tests, and browser journeys.
- No API, route, permission, data contract, dependency, or shared Drawer primitive replacement is required.
