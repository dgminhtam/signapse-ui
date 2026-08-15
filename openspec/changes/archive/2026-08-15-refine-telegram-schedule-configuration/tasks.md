## 1. Contract and data boundary

- [x] 1.1 Align Telegram schedule request/response types and authenticated actions with the live contract: singular `assetId`/`asset`, optional `outputLanguageIsoCode`/`outputLanguage`, exact workspace and destination fields, and no retired `assetIds` or symbol parsing.
- [x] 1.2 Add the pure schedule normalization and Zod validation boundary for one to four unique `HH:mm` values, chronological sorting, IANA timezone, required asset/destination, and optional catalog-backed output language; keep it reusable for request-boundary verification without adding a test framework.
- [x] 1.3 Load the complete current-workspace watchlist, active destinations, schedule data, and backend language catalog through the existing authenticated page/action patterns, including stale asset/destination values needed for recoverable editing.
- [x] 1.4 Update localized dictionaries, API mapping, active OpenSpec requirements, and domain terminology for the finalized schedule fields, statuses, lifecycle labels, and state messages.

## 2. Schedule form

- [x] 2.1 Replace the schedule Sheet and nested full-form shell with focused shadcn Dialog create/update flows, reusing repository Field, FieldGroup, FieldSet, Dialog, Button, and form patterns without sharing a submit-owning create/update form.
- [x] 2.2 Implement the required single-asset shadcn Select from the complete current workspace watchlist, showing symbol and name, submitting the asset ID, and retaining an unavailable stale option that blocks save until replaced.
- [x] 2.3 Implement active-destination selection and stale-destination handling so only active destinations are valid for a new request while an unavailable current destination remains visible and actionable during edit.
- [x] 2.4 Replace comma-separated local-time text with shadcn `Input` time rows using minute precision and the repository calendar-indicator styling; support one initial row, one to four total rows, accessible add/remove controls, duplicate detection, and chronological normalization.
- [x] 2.5 Implement the grouped shadcn Combobox timezone field with region groups, labels containing GMT offset, human-readable location, and IANA ID, searchable display text, `Asia/Bangkok` as the new default, and IANA ID submission.
- [x] 2.6 Implement the optional output-language Select from `/languages`, including the localized default option, omission of the override for new schedules, and preservation of an existing edit override.
- [x] 2.7 Add field-local validation and accessibility wiring (`aria-invalid`, `aria-describedby`, first-invalid focus), dirty-close confirmation, pending interaction locking, backend-error recovery, value preservation, and success close/refresh behavior.

## 3. Schedule surface and lifecycle

- [x] 3.1 Update the schedule table mapping to render singular asset and optional language data, preserve the existing table composition, and add responsive wrapping or safe overflow for narrow widths and zoom.
- [x] 3.2 Add explicit permission, loading, empty, API-error/retry, and missing-prerequisite states, keeping the create action visible but disabled with localized reasons when workspace, active destination, or watchlist requirements are unavailable.
- [x] 3.3 Make row actions status-aware: ACTIVE exposes Edit, `Vô hiệu hóa`, and Xóa; DISABLED exposes only Xóa; REMOVED records are excluded from the operational table; read-only users see no mutation controls.
- [x] 3.4 Implement separate intent-specific shadcn AlertDialogs for disable and destructive delete, with correct copy/icons, pending protection, retry/cancel recovery, focus restoration, and refresh only after confirmed mutation success.

## 4. Verification

- [x] 4.1 Run static searches and focused review to confirm the schedule surface no longer uses Sheet, free-text asset/time/timezone parsing, plural schedule asset fields, implicit disabled-schedule editing, or a generic delete dialog for disable.
- [x] 4.2 Run `pnpm lint`, `pnpm typecheck`, and `pnpm build` from the repository.
- [x] 4.3 Run strict OpenSpec validation for `refine-telegram-schedule-configuration` and confirm the final change status reports all required artifacts complete.

## 5. Post-review refinements

- [x] 5.1 Record the confirmed contract behavior that one schedule may contain one to four unique local send times while remaining linked to one workspace asset.
- [x] 5.2 Align the timezone Combobox with the shadcn grouped pattern using region groups, separators, object options, direct IANA-value selection, and searchable display labels.
- [x] 5.3 Use the built-in destructive Button variant for removable local-time rows while keeping the final row non-removable.
- [x] 5.4 Run focused type, lint, OpenSpec, and request-boundary checks for the refinements.

## 6. Timezone selection regression

- [x] 6.1 Reproduce the timezone selection failure caused by the portaled Combobox content being treated as a Dialog outside interaction.
- [x] 6.2 Keep Combobox option pointer interactions inside the schedule Dialog so selecting an IANA timezone reaches the controlled form state in both create and edit flows.
- [x] 6.3 Re-run typecheck, lint, strict OpenSpec validation, and diff hygiene checks after the regression fix.
