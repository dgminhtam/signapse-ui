## Why

The AI provider credential UI now carries the correct backend logic, but the row layout is visually heavier than the task requires. Operators need a compact, scan-friendly credential editor where entering an API key, validating it, choosing a model, and removing a row are visible in one tight workflow.

## What Changes

- Replace the create form section label `Credential ban đầu` with the clearer `API key và model`.
- Reduce the section legend and credential row index hierarchy so they no longer compete with field labels.
- Move each row's validate/select model action beside the delete action in the row header.
- Use a key-style icon and shorter action copy for model validation: `Chọn model`, `Đổi model`, and pending `Đang kiểm tra...`.
- Place the selected-model display beside the API key input on desktop, while preserving a stacked layout on mobile.
- Replace the tall dashed model surface with an input-height model summary surface.
- Remove repetitive helper copy from each credential row when the labels and actions already explain the workflow.
- Apply the same compact credential pattern to both the create form credential rows and the edit detail credential panel.

## Capabilities

### New Capabilities

- `ai-provider-credential-row-density`: Defines compact, scan-friendly AI provider credential row behavior and hierarchy.

### Modified Capabilities

- None.

## Impact

- Affected UI files under `app/(main)/ai-provider-configs/`, especially create credential rows and credential panel add/update rows.
- No backend API, DTO, permission, dependency, theme token, or shared `components/ui` changes.
- Skeletons and task documentation should be updated only where the visible credential hierarchy changes.
