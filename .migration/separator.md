# separator

2026-08-18 — official Base Nova `@base-ui/react/separator` wrapper via shadcn CLI dry-run/diff; verdict: migrated and typechecked.

## Changed

- Replaced the Radix Separator primitive with the official Base Nova `@base-ui/react/separator` wrapper.
- Removed the Radix-only `decorative` prop from the wrapper and its single consumer; Base UI Separator is already screen-reader accessible by default.
- Leftover Radix import scan: no direct Radix import remains in `components/ui/separator.tsx`.

## Left alone

- Existing Nova classes, orientation defaults, data slot, and all layout consumers.
- `ButtonGroupSeparator` continues to compose the shared wrapper.

## Behavior changes

- The Markdown horizontal rule now relies on Base UI's native accessible separator semantics instead of passing Radix `decorative={false}`. Visual output and orientation are unchanged.

## Verify by hand

- Confirm horizontal and vertical separators render at the same dimensions in toolbar, sidebar, article, and responsive chart layouts.
- Confirm the Markdown rule remains exposed as a separator to assistive technology.
