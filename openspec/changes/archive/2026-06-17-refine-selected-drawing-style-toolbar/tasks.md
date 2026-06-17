## 1. Preset Style Values

- [x] 1.1 Expand `MARKET_CHART_DRAWING_COLOR_PRESETS` to the agreed fixed palette while preserving preset token metadata.
- [x] 1.2 Expand `MARKET_CHART_DRAWING_SIZES` from `1..3` to `1..5` and keep size typing derived from the constant.
- [x] 1.3 Update localized English and Vietnamese labels for new color presets and style popover triggers.

## 2. Selected Drawing Toolbar Composition

- [x] 2.1 Replace the inline selected-drawing color `ToggleGroup` with a compact ghost swatch trigger and shadcn `Popover` color grid.
- [x] 2.2 Replace the inline selected-drawing size `ToggleGroup` with a compact ghost line-preview trigger and shadcn `Popover` size choices.
- [x] 2.3 Render size options primarily as line previews for `1px` through `5px`, with localized accessible labels.
- [x] 2.4 Keep selected delete as a compact ghost icon action and keep clear-all outside the selected-drawing style toolbar.
- [x] 2.5 Ensure selected color and selected size have clear active/selected state inside their popovers without using outline button chrome for the toolbar controls.

## 3. Drawing Style Integration

- [x] 3.1 Ensure selected color changes continue to call the existing selected drawing style update path without recreating overlays.
- [x] 3.2 Ensure selected size changes apply `4px` and `5px` styles through existing overlay style helpers.
- [x] 3.3 Confirm style metadata, overlay points, lock state, visibility state, group id, tool metadata, and extension metadata are preserved after color or size changes.

## 4. Verification

- [x] 4.1 Run `openspec validate refine-selected-drawing-style-toolbar --strict`.
- [x] 4.2 Run `pnpm typecheck`.
- [x] 4.3 Run `pnpm lint`.
- [x] 4.4 Run a deterministic code review for shadcn wrapper usage, active-state visibility, toolbar compactness, localized labels, and overlay metadata preservation.

User-owned manual QA note: after implementation, manually verify selecting a drawing shows compact color/size/delete controls, color and size popovers open correctly, line previews match stroke size, and applying each preset updates the selected drawing visually.
