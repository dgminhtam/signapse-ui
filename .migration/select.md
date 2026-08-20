# select

2026-08-18 — official Base Nova `@base-ui/react/select` wrapper via shadcn CLI dry-run/diff; verdict: migrated and typechecked.

## Changed

- Replaced the Radix Select wrapper with the official Base Nova `@base-ui/react/select` root, trigger, value, group, item, popup, positioner, list, separator, and scroll-arrow parts.
- Replaced Radix viewport/content positioning with the Base UI `Positioner`/`Popup`/`List` contract and preserved the Nova classes from the reviewed registry output.
- Updated dynamic Select consumers to provide Base UI `items` and nullable `onValueChange` handling across pagination, sorting, forms, Telegram settings, market charts, and code drawing controls.
- Corrected the remaining empty-value consumer contract: schedule destination/asset Selects and Telegram feature destination routing now pass `null` instead of `undefined`, keeping Base UI Select controlled for the component lifetime.
- Added `components/ui/select-content-in-overlay.tsx` as an app-specific composition extension for the fullscreen market-chart portal container; the default wrapper remains registry-shaped.
- Leftover Radix import scan: no direct Radix import remains in `components/ui/select.tsx` or the Select extension.

## Left alone

- Existing Select item values, labels, validation, pending states, controlled open state, form state, and business/API workflows.
- The out-of-scope toolbar and all non-Select Radix integrations.

## Behavior changes

- Select values now follow Base UI's nullable callback contract; required controls ignore a null clear event, while optional form/query controls map it to their existing empty-string behavior.
- Empty form state is represented as controlled `null`; selecting an item changes the value to a string without an uncontrolled-to-controlled transition or console warning.
- Dynamic option metadata is supplied through `items` so Base UI can resolve selected labels for controlled values.
- The fullscreen market-chart Select uses the external portal-container extension; all other Selects use the official Base UI portal behavior.

## Verify by hand

- Open every form Select and confirm selected labels, placeholders, validation, disabled/pending state, keyboard navigation, Escape, and focus restoration.
- Confirm pagination and sort Selects update query state without converting a null value into an invalid number.
- Confirm Telegram destination/asset/language Selects preserve unavailable-option labels and form errors.
- Confirm empty schedule and Telegram feature destination Selects render with placeholders and produce no controlled/uncontrolled warning after selection.
- Confirm market-chart asset Select works in normal and fullscreen modes, including popup placement inside the fullscreen surface.
- Confirm code-drawing Selects preserve controlled open state and selected values.
