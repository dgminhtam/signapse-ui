## Context

The Telegram scheduled asset analysis surface is already nested under the `SCHEDULED_MARKET_ANALYSIS` feature route and already has backend CRUD actions, but its client form still reflects an older contract and older UI composition. It uses a Sheet containing a nested full-form shell, accepts asset symbols and comma-separated times as text, accepts timezone as free text, and reports most validation failures through toasts.

The live schedule contract requires one workspace-watchlist `assetId`, one to four unique minute-precision local times, a valid IANA timezone, and an optional schedule output-language override. The backend response exposes a singular scheduled asset and an optional output language. Updating a disabled schedule also makes it active, so exposing edit for disabled records would create an implicit reactivation path.

The change is frontend-only. It must reuse existing authenticated server actions, shadcn wrappers, dictionary localization, permission helpers, table composition, and form accessibility patterns. The accepted product assumption is that a workspace watchlist is small enough to preload completely; server-side asset search and pagination are deliberately deferred.

## Goals / Non-Goals

**Goals:**

- Align schedule request/response definitions, validation, and form submission with the live single-asset contract.
- Replace the schedule Sheet with a focused, accessible shadcn Dialog.
- Provide structured asset, local-time, timezone, and output-language controls.
- Preserve user input and provide recoverable field, backend, pending, and dirty-form states.
- Make schedule lifecycle actions truthful and status-aware.
- Keep the existing schedule table while improving responsive behavior and operational states.
- Cover read-only permissions, missing prerequisites, loading, empty, and API error states.
- Update localized copy, active specification/API mapping, and domain terminology.

**Non-Goals:**

- Backend, database, Quartz, or scheduled-delivery changes.
- Multi-asset schedules, all-watchlist scope, or a server-side asset search/pagination flow.
- Schedule reactivation or a new backend reactivation endpoint.
- Redesign of Bot Telegram, Điểm nhận, or other feature routes.
- Converting the schedule table into a Card/Item list.
- New runtime dependencies or a new UI test framework.

## Decisions

### 1. Treat the live schedule contract as authoritative

The frontend will submit `name`, current `workspaceId`, active `destinationId`, required `assetId`, valid `timezone`, `localTimes`, and optional `outputLanguageIsoCode`. Schedule responses will model one `asset` and optional `outputLanguage`; legacy symbol parsing and plural `assetIds` behavior will be removed from the schedule surface.

Alternative considered: keep the existing `assetIds` collection and translate one selected asset into a one-item array. Rejected because it preserves misleading multi-asset semantics and does not match the backend DTO.

### 2. Preload the complete current workspace watchlist

The server page will provide the complete watchlist for the current workspace to the schedule surface. The asset field will use a single shadcn Select, display symbol and name, and submit the selected ID. A missing or stale scheduled asset will be represented as an unavailable option and will block save until a current watchlist asset is selected.

Alternative considered: an asynchronous Combobox with server-side search and pagination. Rejected for this change because the accepted watchlist-size assumption makes the additional client state unnecessary. The assumption is a known ceiling and must be revisited if workspace watchlists become large.

### 3. Use a focused Dialog with the repository form patterns

Create and edit will use the existing shadcn Dialog composition with a Dialog header, grouped fields, and Dialog footer. The form will not use a Sheet or nest the full-page form shell inside the overlay. Existing Field, FieldGroup, FieldSet, FieldLabel, FieldDescription, FieldError, Select, Input, and Button wrappers will be reused.

Every control will have a stable ID and visible label. Invalid fields will expose `aria-invalid` and `aria-describedby`; the first invalid field receives focus. Backend errors remain inside the open Dialog, and successful mutations close the Dialog and refresh the page.

Alternative considered: keep the Sheet and only replace its controls. Rejected because the repository design rule reserves Sheet for side panels, while this is a focused form task.

### 4. Use native time inputs for local send times

The schedule will render one shadcn Input time row initially, allow one to four rows, and provide accessible add/remove controls. The input will use minute precision and the repository-approved calendar-indicator styling. The remove control will use the built-in destructive Button variant to communicate its effect, while the final remaining row stays disabled rather than removable. Client validation will reject blank, duplicate, or invalid values and normalize valid values into chronological order before request validation.

Alternative considered: retain one comma-separated text input. Rejected because it burdens users with syntax, weakens field-level feedback, and allows values the backend rejects.

### 5. Use grouped IANA timezone Combobox data

The timezone field will follow the shadcn grouped Combobox pattern with input, content, empty state, list, group labels, collection rendering, and separators. Each option is an object with an IANA `value` and display `label`; the selected option is controlled as that object and writes its IANA `value` directly into form state. This keeps the display label independent from the submitted timezone and avoids label-to-value maps. Values are IANA IDs. Groups use the region prefix; labels include a human-readable city/region, a GMT offset, and the IANA ID. Search covers the displayed label and identifier. `Asia/Bangkok` is the default for a new schedule.

Alternative considered: a short native Select list of common timezones. Rejected because it would exclude valid backend-supported zones. Free-text timezone entry is also removed because backend validity cannot be assumed from arbitrary text.

### 6. Expose and preserve schedule output language

The page will load the backend language catalog and render an optional Select with a localized “use default” choice. A new schedule omits the override when that choice is selected. An edit preselects the response override and sends it back unchanged unless the user changes it.

Alternative considered: model the field but keep it hidden until a later change. Rejected because an edit that omits the backend-owned override can erase existing configuration, and the accepted scope is end-to-end schedule configuration.

### 7. Make form state recoverable

The Dialog tracks whether the form is dirty. Closing a dirty form requires discard confirmation; closing a clean form is immediate. Pending submission disables fields and close controls. Client validation is field-local. Backend failure leaves all entered values and the Dialog open with a retry path. Success shows localized confirmation, closes the Dialog, and refreshes the Telegram data.

Alternative considered: use toast-only validation and close the form on every failure. Rejected because it can lose user input and does not meet the repository's form and accessibility conventions.

### 8. Make lifecycle controls status-aware and intent-specific

ACTIVE rows expose edit, Vô hiệu hóa, and Xóa. DISABLED rows expose only Xóa. REMOVED rows are not expected from the list API and are not rendered. Edit is hidden for DISABLED because the backend PUT operation activates the schedule.

Vô hiệu hóa uses an AlertDialog with warning intent and no reactivation promise. Xóa uses a separate destructive AlertDialog with explicit no-undo copy. Both dialogs prevent duplicate submission, remain open after failure with retry/cancel recovery, restore focus when closed, and refresh only after confirmed success.

Alternative considered: use one generic destructive confirmation for both actions. Rejected because it makes disabling look like deleting and communicates the wrong task hierarchy.

### 9. Preserve the table and make states explicit

The existing schedule table remains the comparison surface. Its columns, action triggers, and rows will reflow or provide safe overflow at narrow widths without hiding critical values. Loading preserves the table footprint. A successful empty result shows a localized empty state without duplicating the header action. API failure is distinct from empty data and exposes a localized retry action.

Read-only users see schedule data and a section-level read-only explanation but no mutation controls. Users missing read permission see the existing access-limited state. When prerequisites are missing, the create action remains visible but disabled with a localized reason.

Alternative considered: convert schedules to Cards/Items. Rejected because the existing table is a useful dense comparison surface and the user accepted retaining it.

### 10. Keep verification at the request boundary

The primary behavioral seam is the schedule form's normalization and request boundary: client values are normalized, Zod-validated, and passed to the authenticated schedule server action. Tests and static checks will assert external request shape and user-visible state rather than Radix/shadcn internals. Existing Telegram form, shared dialog, and watchlist-fetch patterns are the prior art. No new UI test framework will be introduced.

### 11. Preserve the Dialog boundary for the portaled timezone list

The Base UI Combobox content is portaled outside the Dialog DOM subtree. The schedule Dialog's outside-pointer handler will explicitly allow pointer interaction whose original event target is inside the Combobox content, so selecting an option is not interpreted as a request to close or discard the form. The same boundary applies to create and edit flows.

Alternative considered: move or fork the shared Combobox portal implementation. Rejected because the existing shadcn wrapper is correct for other surfaces; the integration boundary belongs to the schedule Dialog that owns the dirty-close behavior.

## Risks / Trade-offs

- [A future workspace watchlist may exceed the preload assumption] → Keep the assumption explicit and revisit with a separate server-search/pagination change if it becomes true.
- [A scheduled asset or destination may become unavailable between loading and saving] → Keep unavailable values visible, block invalid submission, and rely on backend validation as the final authority.
- [IANA timezone labels and GMT offsets can vary with daylight-saving rules] → Store the IANA ID as the authoritative value and treat the display label as presentation only.
- [The language catalog may fail while the schedule form is otherwise usable] → Keep the default-language option available and surface catalog failure without silently inventing language options.
- [The backend PUT behavior can activate disabled schedules] → Remove edit for DISABLED rows rather than hiding the side effect behind a normal save.
- [No UI test runner is configured] → Use request-boundary checks, lint, typecheck, build, OpenSpec validation, static contract searches, and non-blocking manual visual QA.

## Migration Plan

1. Update schedule response/request definitions, Zod validation, server actions, and page data loading for singular assets, language catalog data, and exact time/timezone rules.
2. Replace the schedule Sheet form with the Dialog and structured controls.
3. Add dirty, pending, field-error, backend-error, prerequisite, permission, loading, empty, and retry states.
4. Split disable and delete confirmation intent while preserving the existing authenticated mutations.
5. Update responsive table behavior, localized dictionaries, active OpenSpec requirements, API mapping, and domain terminology.
6. Run repository checks and static searches for retired schedule symbols and Sheet usage.

No data migration or deployment ordering is required. Rollback is a frontend code rollback; it must not restore requests that do not match the live backend contract.

## Open Questions

None. The product choices, backend contract, UI patterns, lifecycle semantics, permission states, and primary verification seam were confirmed before proposal creation.
