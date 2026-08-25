## ADDED Requirements

### Requirement: Feedback sender entry points preserve application context
The system SHALL expose separate localized `Gửi phản hồi` and `Phản hồi của tôi` entries in the authenticated user menu while the feedback fixture capability is available. `Gửi phản hồi` SHALL open a local modal Dialog without changing the current URL, and `Phản hồi của tôi` SHALL navigate to the canonical localized personal feedback route.

#### Scenario: Opening compose from another protected page
- **WHEN** an authenticated fixture user activates `Gửi phản hồi` from the user menu
- **THEN** the compose Dialog opens over the current page without changing its URL or navigation history
- **AND** closing the Dialog returns focus to the originating menu trigger

#### Scenario: Opening personal history
- **WHEN** an authenticated fixture user activates `Phản hồi của tôi`
- **THEN** the app navigates to the localized `/feedback` route
- **AND** the personal feedback page renders one H1 and a primary `Gửi phản hồi` action

### Requirement: Compose fields match the accepted feedback contract
The compose Dialog SHALL let the feedback sender choose `Lỗi` or `Ý tưởng` and SHALL collect a title, description, and expected outcome using the accepted contract length constraints. Reproduction steps SHALL be optional and SHALL be progressively disclosed only for `Lỗi`.

#### Scenario: Submitting valid bug feedback
- **WHEN** the sender selects `Lỗi`, enters a title of 5 through 150 characters, a description of 20 through 5000 characters, an expected outcome of 10 through 3000 characters, and optional reproduction steps of at most 5000 characters
- **THEN** the fixture submission is accepted for the configured success scenario

#### Scenario: Composing an idea
- **WHEN** the sender selects `Ý tưởng`
- **THEN** the reproduction-steps field is not rendered
- **AND** the required title, description, and expected-outcome fields remain available

#### Scenario: Submitting invalid feedback
- **WHEN** the sender submits values outside the accepted length constraints or omits a required field
- **THEN** submission is blocked
- **AND** localized field-level errors are associated with the affected controls
- **AND** focus moves to the first invalid field

### Requirement: Technical context is transparent and optional
The compose Dialog SHALL offer an enabled-by-default `Đính kèm thông tin kỹ thuật` control. The sender SHALL be able to inspect the categories of technical context and disable attachment before submission.

#### Scenario: Sending the default technical context
- **WHEN** the sender leaves technical-context attachment enabled
- **THEN** the fixture submission records the available page path, app version, browser, operating system, locale, and observed time values

#### Scenario: Opting out of technical context
- **WHEN** the sender disables technical-context attachment
- **THEN** the fixture submission omits technical context
- **AND** the rest of the form remains unchanged

### Requirement: Screenshot attachment remains manual and singular
The compose Dialog SHALL accept at most one manually selected screenshot fixture and SHALL provide preview and remove controls. The system MUST NOT capture the current page automatically.

#### Scenario: Previewing a supported image
- **WHEN** the sender selects one fixture file with a previewable image MIME type
- **THEN** the Dialog displays a constrained preview with meaningful alternative text
- **AND** the sender can remove the selection before submitting

#### Scenario: Selecting an unsupported preview type
- **WHEN** the selected fixture file cannot be previewed as an image
- **THEN** the Dialog displays localized metadata and `Không thể xem trước`
- **AND** the Dialog remains operable without offering an unsupported download or open action

### Requirement: Compose state is truthful and recoverable
The compose Dialog SHALL prevent duplicate submission while pending, preserve valid input after a configured mutation failure, warn before discarding dirty state, and provide localized pending, success, and error feedback without layout shift.

#### Scenario: Submission is pending
- **WHEN** a fixture submission is pending
- **THEN** the submit control is disabled and shows the shared Spinner within the existing button footprint
- **AND** other form content does not shift

#### Scenario: Submission fails
- **WHEN** the configured fixture mutation returns a failure
- **THEN** the Dialog remains open
- **AND** valid field values, the technical-context choice, and the selected screenshot remain available for retry or cancellation

#### Scenario: Closing a dirty Dialog
- **WHEN** the sender attempts to close the compose Dialog after changing its initial state
- **THEN** an application confirmation flow asks whether to discard the draft
- **AND** the system does not use a browser-native confirmation dialog

#### Scenario: Submission succeeds from another page
- **WHEN** the configured fixture submission succeeds outside the personal feedback route
- **THEN** the Dialog closes and the current page remains active
- **AND** a localized success toast offers an action to view personal feedback

#### Scenario: Submission succeeds from personal history
- **WHEN** the configured fixture submission succeeds from `/feedback`
- **THEN** the new fixture record appears first in the current personal list
- **AND** the route remains `/feedback`

### Requirement: Personal history is a lightweight canonical list
The `/feedback` surface SHALL render feedback newest first with 10 items per page and SHALL use the shared pagination behavior. It SHALL NOT add personal search, type filters, status filters, aggregate cards, or navigation badges.

#### Scenario: Rendering personal history
- **WHEN** the sender has feedback fixture records
- **THEN** the list exposes type, title, localized status, submission date, and screenshot presence
- **AND** each title is a semantic localized link to `/feedback/{id}`

#### Scenario: Rendering multiple personal pages
- **WHEN** the sender has more than 10 fixture records
- **THEN** shared pagination exposes the available pages with 1-indexed URL state
- **AND** changing page preserves unrelated query parameters

#### Scenario: Rendering first-use empty state
- **WHEN** the sender has no feedback fixture records
- **THEN** a localized Empty surface explains that no feedback has been sent
- **AND** it offers `Gửi phản hồi`

### Requirement: Personal detail presents submission and review truth
The canonical personal detail surface SHALL present the submission content, type, localized status, timestamps, optional screenshot, optional technical context, optional `Kết quả xem xét`, and optional read-only GitHub issue reference. It SHALL NOT expose the editable `githubIssueUrl` field.

#### Scenario: Viewing pending feedback
- **WHEN** the sender opens a pending personal feedback detail
- **THEN** the status is shown as `Chờ xem xét`
- **AND** no review outcome or GitHub reference is invented when absent

#### Scenario: Viewing promoted feedback
- **WHEN** the fixture detail has status `PROMOTED` and a review message
- **THEN** the status is shown as `Đã chuyển xử lý`
- **AND** the user-visible message appears under `Kết quả xem xét`
- **AND** the UI does not promise that implementation is guaranteed

#### Scenario: Viewing dismissed feedback
- **WHEN** the fixture detail has status `DISMISSED` and a review message
- **THEN** the status is shown as `Không tiếp nhận`
- **AND** the user-visible message appears under `Kết quả xem xét`

### Requirement: Withdrawal is capability-gated and recoverable
The personal detail surface SHALL expose `Rút phản hồi` only when the fixture record explicitly grants withdrawal capability. Withdrawal SHALL use an accessible destructive confirmation and SHALL NOT be inferred solely from status.

#### Scenario: Withdrawal is available
- **WHEN** a personal detail fixture grants withdrawal capability
- **THEN** the detail exposes `Rút phản hồi`
- **AND** activation opens a localized AlertDialog describing the affected feedback

#### Scenario: Withdrawal is unavailable
- **WHEN** a personal detail fixture does not grant withdrawal capability
- **THEN** the withdrawal control is absent regardless of displayed status

#### Scenario: Withdrawal mutation fails
- **WHEN** the configured withdrawal fixture fails after confirmation
- **THEN** the AlertDialog remains recoverable
- **AND** its controls become available for retry or cancellation without losing detail context

### Requirement: Personal feedback states preserve design-system behavior
Personal feedback surfaces SHALL use the bounded Financial Command Surface, existing semantic tokens, Geist typography, Lucide icons, and shared shadcn/Base UI wrappers. Loading, empty, error, and missing states SHALL preserve the resolved page geometry and SHALL remain usable in light and dark themes, narrow viewports, reduced motion, keyboard navigation, screen readers, and 200% zoom.

#### Scenario: Loading personal feedback
- **WHEN** a personal list or detail fixture is configured as loading
- **THEN** its skeleton mirrors the final list or detail geometry
- **AND** the page content width does not change when data resolves

#### Scenario: Using personal feedback accessibly
- **WHEN** a user operates the compose, history, detail, screenshot, or withdrawal flow with keyboard or assistive technology
- **THEN** headings, labels, Dialog names, dynamic feedback, focus order, focus restoration, and non-color state cues remain available

#### Scenario: Rendering localized copy
- **WHEN** the active locale is Vietnamese or English
- **THEN** all visible and assistive feedback copy comes from the matching dictionary
- **AND** date and time values use the existing locale formatters
