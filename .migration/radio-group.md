# radio-group

## Changed

- Replaced the Radix RadioGroup and item primitives with the official Base Nova `@base-ui/react/radio-group` and `@base-ui/react/radio` parts.
- Updated group and item types to the Base UI contracts while retaining the existing indicator composition.
- Leftover Radix import scan: no direct Radix import remains in `components/ui/radio-group.tsx`.

## Left alone

- Nova radio visuals, focus ring, disabled styling, and field composition.
- The AI provider model picker consumer and its controlled `value`/`onValueChange` flow.

## Behavior changes

- None intended. Base UI preserves the controlled string-value radio-group contract used by the current consumer.

## Verify by hand

- Confirm model selection changes with pointer and keyboard navigation.
- Confirm the selected radio indicator, labels, focus ring, and disabled state remain visible and accessible.
