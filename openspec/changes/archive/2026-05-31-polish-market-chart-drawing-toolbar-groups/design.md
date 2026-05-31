## Context

The market chart drawing toolbar currently renders drawing tools as a vertical `ToggleGroup`, but the tool items are visually attached because the group uses default spacing. The second section uses standalone `Toggle` controls for magnet, lock, and visibility, which works functionally but does not match the grouped shadcn semantics now desired for this toolbar. The destructive section has two adjacent trash icons, making selected-delete and clear-all hard to distinguish without tooltips.

The repo already has a `ToggleGroup` wrapper that supports `orientation` and `spacing`, so the change can use existing shadcn composition rather than custom wrapper markup or manual radius/padding classes.

## Goals / Non-Goals

**Goals:**

- Make the drawing tool section visually separated while preserving one-active-tool semantics.
- Make magnet, lock, and visibility a multiple-selection shadcn `ToggleGroup` with separated items.
- Keep destructive actions outside ToggleGroup semantics.
- Make selected-delete and clear-all visually distinguishable.
- Preserve all existing drawing behavior and accessibility labels.

**Non-Goals:**

- Do not change chart drawing data, overlay creation, KLineChart adapter behavior, or persistence.
- Do not add a drawing color picker, new drawing tools, or toolbar collapse behavior.
- Do not change global shadcn wrappers or theme tokens.
- Do not change top market chart toolbar controls.

## Decisions

1. Use `ToggleGroup type="single"` with `spacing={1}` for drawing tools.

   Drawing tools are mutually exclusive; using `type="multiple"` would allow impossible UI state. `spacing={1}` gives the requested separated button look through the shadcn wrapper rather than ad-hoc div wrappers.

2. Use `ToggleGroup type="multiple"` with `spacing={1}` for independent drawing states.

   Magnet, lock, and visibility are independent toggles, so a multiple ToggleGroup matches the intended semantics. The implementation should derive values such as `["magnet", "locked", "visible"]` from `MarketChartDrawingState` and map value changes back into a partial state patch.

3. Keep delete actions as buttons, not toggle items.

   Delete selected and clear all are actions, not persisted on/off states. They should remain `Button`/`AlertDialog` based controls and be separated from the toggle groups by `Separator`.

4. Differentiate delete selected from clear all.

   The selected-delete action should use a distinct icon from clear-all, such as `Eraser`, while clear-all can keep a trash/destructive icon and confirmation dialog.

## Risks / Trade-offs

- Mapping multiple ToggleGroup values can accidentally reset unrelated state if implemented naively. Mitigation: derive all three booleans from the submitted value array in one controlled handler.
- Visibility state has inverted copy (`show` vs `hide`) while its value is positive (`visible`). Mitigation: keep `visible` as the selected value and keep aria-label/tooltip based on current state.
- Two destructive-looking controls can still feel close together. Mitigation: use separate icons and keep confirmation only for clear-all.
