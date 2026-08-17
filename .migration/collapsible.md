# collapsible

## Changed

- Replaced the Radix Collapsible parts with the matching official Base Nova `@base-ui/react/collapsible` root, trigger, and panel parts.
- Replaced Radix `asChild` usage with Base UI `render` composition in the sidebar, schema editor, and role-permission dialog consumers.
- Leftover Radix import scan: no direct Radix import remains in `components/ui/collapsible.tsx`.

## Left alone

- Existing open state, default state, IDs, labels, classes, and sidebar/schema/permission business logic.
- Content remains composed through `CollapsibleContent` without a custom compatibility layer.

## Behavior changes

- Consumer composition now follows Base UI's `render` contract. No intended interaction or visual behavior change; controlled and uncontrolled open flows remain in place.

## Verify by hand

- Confirm sidebar sections open/close, keep the correct active state, and preserve keyboard focus.
- Confirm schema editor and legacy permissions expand/collapse with correct content and chevron state.
- Confirm rendered trigger buttons retain their accessible name and `aria-controls` relationship.
