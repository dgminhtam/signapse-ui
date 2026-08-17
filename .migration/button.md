# button

## Changed

- Replaced the Radix Slot-backed button wrapper with the official Base Nova `@base-ui/react/button` implementation.
- Removed the wrapper-level `asChild` compatibility prop; consumers are being converted to Base UI's `render` contract.
- Preserved the app-specific `icon-xl` size and existing `data-variant`/`data-size` markers because they are still used by current UI composition.
- Leftover Radix import scan: no direct Radix import remains in `components/ui/button.tsx`.

## Left alone

- Existing CVA variants, sizes, Nova classes, icon sizing, and native button behavior.
- Non-composed Button consumers until their `asChild` call sites are repointed.

## Behavior changes

- Link and custom-element consumers must use `render={<Element />}`. This is an intentional Base UI API migration; link semantics and keyboard behavior are preserved at each call site.

## Verify by hand

- Verify one native button and one link-rendered button before broad consumer validation.
- Verify focus, disabled state, submit behavior, link navigation, external-link targets, and icon-xl controls.
