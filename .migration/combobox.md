# combobox

2026-08-18 — official Base Nova `@base-ui/react/combobox` wrapper via shadcn CLI dry-run/diff; verdict: migrated and typechecked.

## Changed

- Added `components/ui/combobox.tsx` from the selected Base Nova registry output, preserving the official Base UI root, input, popup, list, group, collection, item, empty, separator, chips, trigger, value, and anchor exports and default Nova chrome.
- Kept the registry wrapper's default portal, positioning, search, keyboard, focus, selection, and empty-state behavior. The reviewed dry-run had only a formatting difference in the Popup `className` expression; it was transcribed exactly by hand without running the repository formatter.
- Updated `app/[lang]/(main)/telegram/telegram-schedule-form.tsx` to replace the timezone Popover/Command selector with the official grouped Combobox composition, including the Globe input addon and grouped labels/items.
- Preserved `getTimezoneGroups`, `Intl.supportedValuesOf("timeZone")`, the `Asia/Bangkok` and `UTC` safeguards, localized labels, IANA item values, existing form validation, disabled state, and request serialization.
- Leftover scan: the changed Combobox wrapper and Telegram schedule form contain no direct Radix UI or Vaul import.

## Left alone

- `components/ui/input.tsx` and `components/ui/input-group.tsx`; the shadcn dry-run reported unrelated registry updates for those dependencies, but this scope only required the Combobox composition and the existing local contracts typecheck successfully.
- Timezone grouping, localization dictionaries, schema validation, create/update mutations, dialog layout, and all non-timezone schedule fields.
- The existing `cmdk` and other third-party integrations outside this Combobox consumer.

## Behavior changes

- The timezone field now uses Base UI Combobox search and grouped collection behavior instead of the feature-local Popover/Command implementation.
- The selected root value is the existing `TimezoneItem | null`; selecting an item writes only its IANA `value` string to the existing form state.
- Keyboard navigation, focus management, empty results, standard popup positioning, validation wiring, and disabled behavior now follow the canonical Base Nova Combobox wrapper.
- No feature-specific popup chrome or canonical wrapper mutation was introduced.

## Verify by hand

- Open the timezone field in both create and update schedule dialogs; confirm the current timezone is displayed and groups/items use the localized labels.
- Search a known timezone and an unknown value; confirm matching results and the localized empty state.
- Select a timezone with the pointer and keyboard; confirm the form stores the IANA value and submission behavior is unchanged.
- Verify disabled, validation-error, focus restoration, Escape, and responsive popup behavior.
