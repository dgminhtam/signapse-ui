# toggle

## Changed

- Replaced the Radix Toggle primitive with the official Base Nova `@base-ui/react/toggle` component.
- Updated the wrapper type and root element to the Base UI contract.
- Leftover Radix import scan: no direct Radix import remains in `components/ui/toggle.tsx`.

## Left alone

- Existing `toggleVariants`, Nova visual classes, variant/size defaults, and toolbar composition.
- Toggle-group remains separate until its Base UI group contract is migrated.

## Behavior changes

- None intended for the current consumers; this wrapper is composed by the existing toggle-group implementation and preserves pressed-state styling.

## Verify by hand

- Confirm toolbar toggles keep pressed state, keyboard activation, focus ring, and disabled behavior.
- Confirm both default and outline variants preserve their current sizing and active styling.
