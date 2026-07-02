## Why

Annotation popups now show the evaluated outcome, but each event still lacks the event timestamp and the predicted reaction context needed to compare prediction versus reality in one place.

## What Changes

- Show each annotation event date above its title using the annotation `time`.
- Add a compact predicted reaction section before the actual reaction section, using `topMarketReaction.direction` as an i18n direction badge.
- Update the actual reaction section to show anchor-to-evaluation price and time ranges while preserving realized return, actual direction, alignment, and evaluated-at details.
- Omit predicted or actual reaction rows when their backing data is unavailable; do not add placeholders.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `market-chart-annotation-popup-surface`: event previews include event time, predicted reaction context, and clearer actual reaction price/time ranges.

## Impact

- Affects the market chart annotation popup/detail rendering and annotation dictionary labels.
- No API contract, dependency, chart marker, grouping, or routing changes.
