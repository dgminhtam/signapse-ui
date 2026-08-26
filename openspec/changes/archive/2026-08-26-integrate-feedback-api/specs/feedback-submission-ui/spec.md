## MODIFIED Requirements

### Requirement: Feedback sender entry points preserve application context
The system SHALL expose separate localized `Gửi phản hồi` and `Phản hồi của tôi` entries in the authenticated user menu for every active user after production feedback activation. `Gửi phản hồi` SHALL open a local modal Dialog without changing the current URL, and `Phản hồi của tôi` SHALL navigate to the canonical localized personal feedback route.

#### Scenario: Opening compose from another protected page
- **WHEN** an active user activates `Gửi phản hồi` from the user menu
- **THEN** the compose Dialog opens over the current page without changing its URL or navigation history
- **AND** closing the Dialog returns focus to the originating menu trigger

#### Scenario: Opening personal history
- **WHEN** an active user activates `Phản hồi của tôi`
- **THEN** the app navigates to the localized `/feedback` route
- **AND** the personal feedback page renders one H1 and a primary `Gửi phản hồi` action

### Requirement: Compose fields match the accepted feedback contract
The compose Dialog SHALL let the feedback sender choose `Lỗi` or `Ý tưởng` and SHALL collect a title, description, and expected outcome using the accepted backend contract length constraints. Reproduction steps SHALL be optional and SHALL be progressively disclosed only for `Lỗi`.

#### Scenario: Submitting valid bug feedback
- **WHEN** the sender selects `Lỗi`, enters a title of 5 through 150 characters, a description of 20 through 5000 characters, an expected outcome of 10 through 3000 characters, and optional reproduction steps of at most 5000 characters
- **THEN** the system submits the authenticated multipart request
- **AND** confirmed backend detail becomes the authoritative result

#### Scenario: Composing an idea
- **WHEN** the sender selects `Ý tưởng`
- **THEN** the reproduction-steps field is not rendered
- **AND** the required title, description, and expected-outcome fields remain available

#### Scenario: Sending an idea
- **WHEN** the sender submits valid IDEA feedback
- **THEN** the request omits reproduction steps and technical-context observation time

#### Scenario: Submitting invalid feedback
- **WHEN** the sender submits values outside the accepted length constraints or omits a required field
- **THEN** submission is blocked
- **AND** localized field-level errors are associated with the affected controls
- **AND** focus moves to the first invalid field

### Requirement: Technical context is transparent and optional
The compose Dialog SHALL offer an enabled-by-default `Đính kèm thông tin kỹ thuật` control. The sender SHALL be able to inspect the categories of technical context and disable attachment before submission. Included context SHALL be limited to page path without query, fragment, or absolute origin, application version, identified browser and operating system, locale, and BUG-only observation time, and MUST exclude unknown fields, page content, form values, raw user-agent, IP address, and device identifiers.

#### Scenario: Sending the default technical context
- **WHEN** the sender leaves technical-context attachment enabled
- **THEN** the request records only available typed privacy-bounded values
- **AND** blank values are omitted for backend null normalization

#### Scenario: Opting out of technical context
- **WHEN** the sender disables technical-context attachment
- **THEN** the request omits technical context
- **AND** the rest of the form remains unchanged

### Requirement: Screenshot attachment remains manual and singular
The compose Dialog SHALL accept at most one manually selected PNG or JPEG screenshot of at most 5 MiB and 25 megapixels and SHALL provide preview and remove controls. The system MUST NOT capture the current page automatically or accept WebP or another attachment type.

#### Scenario: Previewing a supported image
- **WHEN** the sender selects one PNG/JPEG image within byte and decoded-dimension limits
- **THEN** the Dialog displays a constrained preview with meaningful alternative text
- **AND** the sender can remove the selection before submitting

#### Scenario: Selecting an unsupported file
- **WHEN** the selected file is not PNG/JPEG, exceeds 5 MiB, or decodes above 25 megapixels
- **THEN** submission is blocked with a localized field-associated error
- **AND** no unsupported preview, upload, or download action is offered

### Requirement: Compose state is truthful and recoverable
The compose Dialog SHALL prevent duplicate submission while pending, preserve valid input after recoverable transport or backend failure, warn before discarding dirty state, and provide localized pending, success, and error feedback without layout shift. It SHALL update personal feedback only after backend confirmation.

#### Scenario: Submission is pending
- **WHEN** an authenticated submission is pending
- **THEN** the submit control is disabled and shows the shared Spinner within the existing button footprint
- **AND** other form content does not shift

#### Scenario: Submission fails recoverably
- **WHEN** submission fails because of validation `400`, transport `413`, network, timeout, or server error
- **THEN** the Dialog remains open
- **AND** valid field values, technical-context choice, and selected screenshot remain available for retry or cancellation

#### Scenario: Closing a dirty Dialog
- **WHEN** the sender attempts to close the compose Dialog after changing its initial state
- **THEN** an application confirmation flow asks whether to discard the draft
- **AND** the system does not use a browser-native confirmation dialog

#### Scenario: Submission succeeds from another page
- **WHEN** backend-confirmed submission succeeds outside the personal feedback route
- **THEN** the Dialog closes and the current page remains active
- **AND** a localized success toast offers an action to view personal feedback

#### Scenario: Submission succeeds from personal history
- **WHEN** backend-confirmed submission succeeds from `/feedback`
- **THEN** the route canonicalizes to personal history page `1`
- **AND** refreshed backend data renders the new feedback first

### Requirement: Personal history is a lightweight canonical list
The `/feedback` surface SHALL render authenticated feedback newest first with 10 items per page and SHALL use shared pagination with one-based URL state mapped to zero-based backend pages. It SHALL NOT add personal search, type filters, status filters, aggregate cards, or navigation badges. Invalid pagination state SHALL canonicalize safely.

#### Scenario: Rendering personal history
- **WHEN** the authenticated sender has feedback records
- **THEN** the list exposes type, title, localized status, submission date, and screenshot presence
- **AND** each title is a semantic localized link to `/feedback/{id}`

#### Scenario: Rendering multiple personal pages
- **WHEN** the sender has more than 10 records
- **THEN** shared pagination exposes available pages with one-based URL state
- **AND** changing page preserves unrelated query parameters

#### Scenario: Canonicalizing invalid personal page state
- **WHEN** the personal page query is malformed or out of range after a mutation
- **THEN** the route resolves to a valid canonical page without rendering a server error

#### Scenario: Rendering first-use empty state
- **WHEN** the authenticated sender has no feedback records
- **THEN** a localized Empty surface explains that no feedback has been sent
- **AND** it offers `Gửi phản hồi`

### Requirement: Personal detail presents submission and review truth
The canonical personal detail surface SHALL present runtime-validated submission content, type, localized status, timestamps, optional screenshot, optional technical context, and optional `Kết quả xem xét`. Personal detail MUST NOT expose a GitHub issue URL or number and MUST NOT fabricate optional domain data.

#### Scenario: Viewing pending feedback
- **WHEN** the sender opens valid pending personal feedback detail
- **THEN** the status is shown as `Chờ xem xét`
- **AND** no review outcome is invented when absent

#### Scenario: Viewing promoted feedback
- **WHEN** validated detail has status `PROMOTED` and a review message
- **THEN** the status is shown as `Đã chuyển xử lý`
- **AND** the user-visible message appears under `Kết quả xem xét`
- **AND** the UI does not promise that implementation is guaranteed
- **AND** no GitHub reference is exposed

#### Scenario: Viewing dismissed feedback
- **WHEN** validated detail has status `DISMISSED` and a review message
- **THEN** the status is shown as `Không tiếp nhận`
- **AND** the user-visible message appears under `Kết quả xem xét`
- **AND** no GitHub reference is exposed

#### Scenario: Hiding feedback ownership
- **WHEN** personal detail access is forbidden or the record is missing
- **THEN** both outcomes render the same localized missing state

#### Scenario: Loading an unavailable screenshot
- **WHEN** screenshot transport fails while detail remains valid
- **THEN** the detail remains usable
- **AND** the screenshot region shows localized unavailable treatment with retry only for recoverable transport failure

### Requirement: Withdrawal is capability-gated and recoverable
The personal detail surface SHALL expose `Rút phản hồi` only when status is `PENDING_REVIEW`. Withdrawal SHALL use an accessible destructive confirmation and SHALL update navigation only after backend confirmation.

#### Scenario: Withdrawal is available
- **WHEN** personal detail has status `PENDING_REVIEW`
- **THEN** the detail exposes `Rút phản hồi`
- **AND** activation opens a localized AlertDialog describing the affected feedback

#### Scenario: Withdrawal is unavailable
- **WHEN** personal detail has status `PROMOTED` or `DISMISSED`
- **THEN** the withdrawal control is absent

#### Scenario: Withdrawal succeeds
- **WHEN** the backend confirms withdrawal
- **THEN** the sender returns to personal history page `1`
- **AND** refreshed history no longer contains the withdrawn feedback

#### Scenario: Withdrawal fails recoverably
- **WHEN** withdrawal fails because of network, timeout, or server error
- **THEN** the AlertDialog remains recoverable
- **AND** retry and cancellation become available without losing detail context

#### Scenario: Withdrawal is stale
- **WHEN** withdrawal returns `FEEDBACK_NO_LONGER_WITHDRAWABLE` or `404`
- **THEN** the system refreshes authoritative state or returns to personal history as applicable
- **AND** it does not claim a false successful withdrawal

## RENAMED Requirements

- FROM: `Withdrawal is capability-gated and recoverable`
- TO: `Withdrawal is pending-status-gated and recoverable`

### Requirement: Personal feedback states preserve design-system behavior
Personal feedback surfaces SHALL use the bounded Financial Command Surface, existing semantic tokens, Geist typography, Lucide icons, and shared shadcn/Base UI wrappers. Loading, empty, recoverable error, malformed-response, and missing states SHALL preserve resolved page geometry and SHALL remain usable in light and dark themes, narrow viewports, reduced motion, keyboard navigation, screen readers, and 200% zoom.

#### Scenario: Loading personal feedback
- **WHEN** authenticated personal list or detail data is loading
- **THEN** its skeleton mirrors the final list or detail geometry
- **AND** page content width does not change when data resolves

#### Scenario: Recovering from API outage
- **WHEN** a feedback request fails while the application shell remains available
- **THEN** the affected surface offers localized recovery without fixture or local-state fallback

#### Scenario: Using personal feedback accessibly
- **WHEN** a user operates compose, history, detail, screenshot, or withdrawal with keyboard or assistive technology
- **THEN** headings, labels, Dialog names, dynamic feedback, focus order, focus restoration, and non-color state cues remain available

#### Scenario: Rendering localized copy
- **WHEN** the active locale is Vietnamese or English
- **THEN** all visible and assistive feedback copy comes from the matching dictionary
- **AND** date and time values use the existing locale formatters
