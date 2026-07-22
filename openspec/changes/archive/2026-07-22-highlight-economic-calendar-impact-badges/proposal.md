## Why

Economic calendar impact badges are too visually similar to scan quickly, and their raw backend labels bypass localization and casing conventions. The list needs a clearer, locale-aware impact hierarchy using only the badge colors already permitted by the UI policy.

## What Changes

- Give high, medium, low, and unknown impact badges distinct accepted color treatments.
- Normalize backend impact values before mapping them to localized labels.
- Display impact labels in uppercase in both Vietnamese and English.
- Keep missing or unknown impact neutral and avoid backend, DTO, or dependency changes.
- Remove the status column from the economic calendar list and its matching loading skeleton.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `economic-calendar-signal-colors`: Require distinct approved badge palettes and localized uppercase impact labels for economic calendar entries.

## Impact

- Economic calendar list columns, badge rendering, loading skeleton, and shared impact-label helper.
- Vietnamese and English economic calendar dictionaries.
- No API, data model, dependency, global theme, or unrelated page changes.
