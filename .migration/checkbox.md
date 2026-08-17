# checkbox

## Changed

- Replaced the Radix Checkbox primitive with the official Base Nova `@base-ui/react/checkbox` root and indicator parts.
- Kept the existing Lucide check icon because this project does not have the registry's optional icon-placeholder helper.
- Leftover Radix import scan: no direct Radix import remains in `components/ui/checkbox.tsx`.

## Left alone

- Existing Nova classes, data slots, focus affordance, field-disabled styling, and all form/table/chart consumers.
- Boolean checked state handling in consumers.

## Behavior changes

- Base UI reports `onCheckedChange` as a boolean. Existing consumers already normalize or consume boolean values, so no consumer rewrite was required.

## Verify by hand

- Confirm controlled form checkboxes, chart layer toggles, permissions, and schema-editor checkboxes toggle and submit correctly.
- Confirm keyboard focus, disabled state, and visible check indicator remain accessible.
