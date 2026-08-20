# label

2026-08-18 — official native-label Base Nova mapping via shadcn CLI dry-run/diff; verdict: migrated and typechecked.

## Changed

- Replaced the Radix Label primitive with the official Base Nova native `<label>` wrapper.
- Updated the wrapper type to `React.ComponentProps<"label">`.
- Consumer surface remains unchanged; `components/ui/field.tsx` continues to compose `Label`.
- Leftover Radix import scan: no direct Radix import remains in `components/ui/label.tsx`.

## Left alone

- Existing Nova classes and `data-slot="label"` marker.
- Field composition and all non-wrapper consumers.

## Behavior changes

- None intended. Base UI's shadcn mapping is native HTML, so there is no replacement primitive behavior to preserve.

## Verify by hand

- Confirm field labels still associate with controls and preserve disabled/peer-disabled styling.
- Confirm keyboard and screen-reader label semantics in the Field component.
