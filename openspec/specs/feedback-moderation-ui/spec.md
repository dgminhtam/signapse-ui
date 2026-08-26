# feedback-moderation-ui Specification

## Purpose
Define the authenticated moderation queue and detail experience for reviewing user feedback while preserving permission, lifecycle, accessibility, and URL-context contracts.

## Requirements

### Requirement: Moderation navigation respects read permission
The system SHALL expose `Phản hồi người dùng` under the existing `Cài đặt` navigation group when the current server-side permission collection includes `feedback:read`. The destination SHALL use the canonical localized `/feedback-submissions` route, and direct access SHALL enforce the same permission without depending on P0 fixture mode.

#### Scenario: Authorized reviewer sees moderation navigation
- **WHEN** the authenticated application shell renders with `feedback:read`
- **THEN** `Phản hồi người dùng` appears after user management and before developer tooling under `Cài đặt`

#### Scenario: Unauthorized user does not see moderation navigation
- **WHEN** the application shell renders without `feedback:read`
- **THEN** the moderation navigation item is absent
- **AND** direct moderation route access is denied at the server boundary

### Requirement: Moderation queue prioritizes pending work
The moderation queue SHALL default to status `PENDING_REVIEW`, shown as `Chờ xem xét`, and SHALL provide backend-backed case-insensitive title search, exact type filtering, exact status filtering, whitelisted sorting, page-size selection, and pagination. Search, filter, sort, page, and size state SHALL be represented in the URL and SHALL reset page to `1` when a controlling value changes.

#### Scenario: Opening the moderation queue without query state
- **WHEN** an authorized reviewer opens `/feedback-submissions` without valid status or sort state
- **THEN** the queue requests `PENDING_REVIEW` ordered by creation time descending and identifier descending

#### Scenario: Changing queue filters
- **WHEN** the reviewer changes title search, type, status, sort, or page size
- **THEN** the matching URL query state is updated through localized navigation helpers
- **AND** `page` resets to `1`
- **AND** unrelated query parameters are preserved

#### Scenario: Canonicalizing invalid queue state
- **WHEN** page, size, sort, type, or status URL values are invalid
- **THEN** safe canonical values replace them
- **AND** arbitrary backend filter fields or operators are not emitted

#### Scenario: Navigating browser history
- **WHEN** the reviewer uses Back or Forward after changing queue controls
- **THEN** visible controls and backend results reflect restored URL state

### Requirement: Moderation queue remains aligned with list data
The queue SHALL display only runtime-validated list-level fields from the feedback list contract: type, title, localized status, submission date, and screenshot presence. It SHALL NOT display feedback sender information, status facet counts, metric cards, or custom whole-row activation.

#### Scenario: Rendering a queue row
- **WHEN** a valid feedback list item is rendered
- **THEN** its title is a semantic localized link to `/feedback-submissions/{id}`
- **AND** type and status remain understandable without relying on color alone

#### Scenario: Avoiding sender fan-out
- **WHEN** the list response does not contain sender information
- **THEN** the table has no `Người gửi` column
- **AND** the UI does not issue a detail request for every row

#### Scenario: Rendering no matching records
- **WHEN** active queue controls produce no backend records
- **THEN** the queue renders a localized no-results Empty state that preserves the fluid list surface
- **AND** current controls remain available for recovery

### Requirement: Moderation detail separates evidence from actions
The canonical moderation detail SHALL present runtime-validated feedback content, type, localized status, timestamps, optional screenshot, optional technical context, review outcome, required `Người gửi` identity, and a positive GitHub issue number only when promoted data contains one. It SHALL display the issue as a reference without inventing a canonical external URL. Wide layouts SHALL use a primary content region and secondary action/metadata rail; narrow layouts SHALL reflow to one readable column without page-level horizontal overflow.

#### Scenario: Viewing moderation detail on a wide viewport
- **WHEN** an authorized reviewer opens valid `/feedback-submissions/{id}` detail on a wide viewport
- **THEN** submission evidence remains primary and the metadata/action rail remains secondary
- **AND** screenshot and long-form text stay within intentional readable surfaces

#### Scenario: Viewing moderation detail on a narrow viewport
- **WHEN** the same detail renders on a narrow viewport or at 200% zoom
- **THEN** content and actions stack in a logical reading order
- **AND** all controls remain reachable without horizontal page scrolling

#### Scenario: Rendering feedback sender identity
- **WHEN** validated moderation detail is rendered
- **THEN** the surface labels the required sender entity `Người gửi`
- **AND** it does not use `Reporter`, `tác giả`, or `nhà báo` as user-facing terminology

#### Scenario: Rendering a promoted issue reference
- **WHEN** promoted moderation detail contains `githubIssueNumber`
- **THEN** the surface displays the positive issue number as read-only moderation metadata
- **AND** it does not derive an external link from frontend repository assumptions

#### Scenario: Isolating screenshot failure
- **WHEN** moderation screenshot transport fails while detail remains valid
- **THEN** detail remains usable
- **AND** screenshot recovery does not fall back to the personal screenshot scope

### Requirement: Review actions require permission and pending status
The detail SHALL expose `Chuyển xử lý` and `Không tiếp nhận` only when status is `PENDING_REVIEW` and the current permission collection includes `feedback:review`. These status-derived affordances SHALL control presentation only; backend `404` and lifecycle `409` outcomes remain authoritative for races.

#### Scenario: Reviewer can move feedback to follow-up handling
- **WHEN** the reviewer has `feedback:review` and detail status is `PENDING_REVIEW`
- **THEN** `Chuyển xử lý` is available

#### Scenario: Reviewer can decline feedback
- **WHEN** the reviewer has `feedback:review` and detail status is `PENDING_REVIEW`
- **THEN** `Không tiếp nhận` is available

#### Scenario: Reviewer lacks permission or pending status
- **WHEN** `feedback:review` is absent or detail status is `PROMOTED` or `DISMISSED`
- **THEN** both review actions are absent
- **AND** readable detail remains available to a user with `feedback:read`

### Requirement: Review outcome Dialogs collect a user-visible message
Both review actions SHALL use accessible form Dialogs requiring `Nội dung gửi tới người dùng` between 10 and 1000 characters. Promote SHALL additionally require a GitHub Issue URL and SHALL preserve both fields after backend `400`; Dismiss SHALL omit the URL field and request property. The review message SHALL be treated as user-visible `Kết quả xem xét`, not as an internal note.

#### Scenario: Submitting a valid promote outcome
- **WHEN** a reviewer enters a valid message and structurally valid GitHub Issue URL and backend promotion succeeds
- **THEN** detail remains open with validated `PROMOTED` status, `Đã chuyển xử lý`, the new `Kết quả xem xét`, and returned positive issue number
- **AND** a localized success toast is shown

#### Scenario: Submitting promote without an Issue URL
- **WHEN** the reviewer omits or enters a structurally invalid GitHub Issue URL
- **THEN** promotion is blocked
- **AND** a localized field error is announced and focus moves to the Issue URL field

#### Scenario: Backend rejects the Issue repository
- **WHEN** the backend returns `400` because a structurally valid URL is outside the configured Signapse repository
- **THEN** the Promote Dialog remains open with both valid inputs preserved
- **AND** a localized correction message is associated with the Issue URL field

#### Scenario: Submitting a valid dismiss outcome
- **WHEN** a reviewer enters a valid message and backend dismissal succeeds
- **THEN** the request omits `githubIssueUrl`
- **AND** detail remains open with validated `DISMISSED` status, `Không tiếp nhận`, and the new `Kết quả xem xét`
- **AND** a localized success toast is shown

#### Scenario: Submitting an invalid review message
- **WHEN** the review message is shorter than 10 characters, longer than 1000 characters, or empty
- **THEN** no mutation request is performed
- **AND** a localized field error is announced and associated with the textarea

#### Scenario: Review mutation fails recoverably
- **WHEN** review fails because of validation `400`, network, timeout, or server error
- **THEN** the Dialog remains open with valid message and applicable Issue URL preserved
- **AND** controls recover for retry or cancellation

#### Scenario: Review mutation is stale
- **WHEN** review returns `FEEDBACK_ALREADY_REVIEWED` or `404`
- **THEN** the Dialog closes and authoritative detail refreshes
- **AND** localized feedback explains that another operation changed the record

### Requirement: Administrative deletion is isolated and permission-gated
The moderation detail SHALL expose `Xóa phản hồi` for pending, promoted, and dismissed feedback whenever the current permission collection includes `feedback:delete`. Deletion SHALL use a localized AlertDialog separated from review actions and SHALL update navigation only after backend `204 No Content` confirmation.

#### Scenario: Administrator can delete feedback
- **WHEN** the user has `feedback:delete` and any moderation detail status is rendered
- **THEN** `Xóa phản hồi` is available in the destructive action area
- **AND** activation opens an AlertDialog naming the affected feedback

#### Scenario: Administrative deletion is unavailable
- **WHEN** `feedback:delete` is absent
- **THEN** the delete control is absent

#### Scenario: Administrative deletion succeeds
- **WHEN** the backend confirms deletion
- **THEN** the reviewer returns to the preserved moderation queue context
- **AND** the route resolves to the nearest valid page if the prior page is now out of range

#### Scenario: Delete mutation fails recoverably
- **WHEN** deletion fails because of network, timeout, or server error
- **THEN** the AlertDialog remains recoverable
- **AND** duplicate confirmation is prevented while pending
- **AND** retry and cancel become available after failure

#### Scenario: Deleted record is already absent
- **WHEN** deletion reports that another operation already removed the record
- **THEN** the reviewer returns to the preserved queue with informational messaging
- **AND** the UI does not claim that the current request deleted it

### Requirement: Queue context survives detail review
Navigation between moderation queue and canonical detail SHALL preserve URL-backed search, filter, sort, page, and size state. Successful review actions SHALL keep the reviewer on detail, while successful administrative deletion SHALL restore the preserved queue context and canonicalize an invalid page.

#### Scenario: Returning to a filtered queue
- **WHEN** a reviewer opens detail from a filtered queue and uses browser Back
- **THEN** the queue restores prior URL state and matching backend rows

#### Scenario: Completing a review
- **WHEN** Promote or Dismiss succeeds on detail
- **THEN** the reviewer remains on the same canonical detail route
- **AND** refreshed status, review message, and promoted issue number where applicable render without a forced queue redirect

#### Scenario: Deleting the last row on a page
- **WHEN** deletion makes the preserved queue page exceed the backend page count
- **THEN** the route moves to the nearest valid page
- **AND** all other queue controls remain intact

### Requirement: Moderation states follow shared design and accessibility rules
The moderation queue and detail SHALL use the fluid Financial Command Surface, shared list/table and pagination composition, existing semantic tokens, Geist typography, Lucide icons, and dictionary-backed copy. Loading, empty, recoverable error, malformed-response, missing, and permission-denied states SHALL preserve final geometry and SHALL remain operable in light and dark themes, reduced motion, keyboard navigation, screen readers, narrow viewports, and 200% zoom.

#### Scenario: Loading the moderation queue
- **WHEN** authenticated queue data is loading
- **THEN** the skeleton mirrors the final toolbar, table, and pagination footprint

#### Scenario: Loading moderation detail
- **WHEN** authenticated detail data is loading
- **THEN** the skeleton mirrors final content and metadata/action rail at the active breakpoint

#### Scenario: Recovering from API outage
- **WHEN** a moderation request fails while the application shell remains available
- **THEN** the affected surface offers localized recovery without fixture or local-state fallback

#### Scenario: Operating review with keyboard
- **WHEN** a reviewer completes review or deletion using keyboard only
- **THEN** focus order, visible focus, Dialog trapping, error announcement, and focus restoration remain correct

#### Scenario: Rendering localized moderation copy
- **WHEN** the active locale is Vietnamese or English
- **THEN** navigation, headings, table labels, filters, Dialogs, alerts, toasts, empty states, errors, and accessible names come from the matching dictionary
