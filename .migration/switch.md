# switch

2026-08-18 — official Base Nova `@base-ui/react/switch` wrapper via shadcn CLI dry-run/diff; verdict: migrated and typechecked.

## Changed

- Replaced the Radix Switch primitive with the official Base Nova `@base-ui/react/switch` root and thumb parts.
- Updated the wrapper type to `SwitchPrimitive.Root.Props` while preserving the existing size extension.
- Leftover Radix import scan: no direct Radix import remains in `components/ui/switch.tsx`.

## Left alone

- Existing Nova dimensions, thumb movement, state colors, current field-label focus ring, and disabled styling.
- Form, permissions, chart, Telegram, and news-outlet consumers.

## Behavior changes

- Base UI emits boolean checked state, matching all current switch handlers and form bindings.

## Verify by hand

- Confirm controlled switches toggle from keyboard and pointer input in every form and settings surface.
- Confirm pending/disabled switches do not dispatch updates and preserve focus visibility.
