## Why

The Market Chart toolbar needs a reviewable event-settings direction before replacing the existing Events and Economic Calendar controls. A UI-only prototype lets the team evaluate hierarchy, density, copy, and keyboard behavior without changing chart state or data loading.

## What Changes

- Add a new localized `Events` toolbar button that opens a compact settings popover.
- Present two sections in the popover: market Events and Economic Calendar.
- Show display switches for both sections and High, Medium, and Low impact checkboxes under Economic Calendar; the prototype Calendar switch controls whether its impact settings are disclosed.
- Keep the existing Events and Economic Calendar toggle buttons and all of their current behavior unchanged during review.
- Do not connect the prototype controls to production chart state, marker visibility, filtering, URL state, or API calls.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `market-chart-control-toolbar`: Add a review-only event-settings popover command beside the existing event controls without changing their behavior.

## Impact

- Affects the Market Chart top toolbar and EN/VI Market Charts dictionary copy.
- Reuses existing shadcn/Radix Popover, Button, Switch, Checkbox, Field, and Item wrappers plus Lucide icons.
- Does not affect APIs, DTOs, chart canvas behavior, marker grouping, economic-calendar loading, dependencies, routes, or global theme tokens.
