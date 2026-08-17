# toggle-group

## Changed

- Replaced the Radix ToggleGroup root and item parts with the official Base Nova `@base-ui/react/toggle-group` and `@base-ui/react/toggle` primitives.
- Updated the drawing toolbar from Radix `type="multiple"` to Base UI `multiple`.
- Updated the timeframe consumer to Base UI's array-valued `value` and `onValueChange` contract while preserving the existing single-selection state flow.
- Leftover Radix import scan: no direct Radix import remains in `components/ui/toggle-group.tsx`.

## Left alone

- Existing toggle variants, spacing/orientation classes, icon composition, disabled state, and drawing/timeframe business logic.
- The out-of-scope `components/ui/toolbar.tsx` and its `@radix-ui/react-toolbar` consumers.

## Behavior changes

- Base UI uses `multiple` and array values for both single- and multi-select groups. The timeframe consumer reads the first selected value and intentionally ignores an empty array so the existing selected timeframe remains valid.

## Verify by hand

- Confirm timeframe buttons select one interval, keep the selected styling, and continue updating the chart.
- Confirm drawing magnet/lock/visibility toggles can be enabled independently and stay synchronized with drawing state.
- Confirm vertical orientation, disabled state, keyboard navigation, focus rings, and pressed styling.
