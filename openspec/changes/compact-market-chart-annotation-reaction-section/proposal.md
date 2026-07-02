## Why

Annotation popups now show both predicted and evaluated reaction context, but the separate predicted/actual sections and alignment badge make the quick preview feel repetitive. Users need a tighter comparison between predicted direction, actual direction, return, and price movement.

## What Changes

- Combine predicted and actual reaction details into one compact reaction section per event.
- Stop showing the outcome `alignment` badge in the popup preview.
- Show `actualDirection` as a localized direction badge using the same direction color treatment as predicted direction.
- Keep the anchor price neutral, color only the evaluation price by movement, show realized return in parentheses after evaluation price, and place the up/down icon at the end of the evaluation value.
- Keep price and time ranges compact and omit missing data without placeholders.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `market-chart-annotation-popup-surface`: annotation event previews use one compact reaction comparison section instead of separate predicted and actual reaction sections.

## Impact

- Affects market chart annotation popup event rendering and related localized labels if existing labels need wording changes.
- No backend contract, chart marker, grouping, routing, dependency, or API mapping changes.
