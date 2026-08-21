## Why

The shared quick-detail drawer currently prefixes every entity title with an internal profile label (for example, “Trình đọc bài viết ·”) and renders a generic header description. The copy repeats information that does not help the user scan the entity and is inaccurate when the same drawer is opened from different owners, so the header should focus on the actual entity title while retaining state feedback in the body.

## What Changes

- Render the event or article title directly in the quick-detail header without the profile prefix.
- Remove the generic quick-detail header description for ready and transient states; keep loading, error, missing, and access-denied feedback available through the modal body and live-region semantics.
- Remove dictionary entries used only by the removed profile/header copy while retaining body-state descriptions.
- Update the quick-detail specification, component coverage, and end-to-end heading assertions.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `workspace-local-quick-detail-overlays`: simplify the accessible/display title and remove redundant header description while preserving modal state announcements.

## Impact

- Affected UI: the shared local entity quick-detail drawer used by Dashboard, Graph View, and Market Charts.
- Affected localization: English and Vietnamese quick-detail strings.
- Affected verification: quick-detail component and browser tests, plus the main OpenSpec capability spec.
- No API, route, permission, dependency, or shared Drawer primitive changes.
