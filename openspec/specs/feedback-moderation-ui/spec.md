# feedback-moderation-ui Specification

## Purpose
Define the fixture-only moderation queue and detail experience for reviewing user feedback while preserving permission, capability, accessibility, and URL-context contracts.

## Requirements

### Requirement: Moderation navigation respects read permission
The system SHALL expose `Phản hồi người dùng` under the existing `Cài đặt` navigation group only when feedback fixture mode is available and the current permission collection includes `feedback:read`. The destination SHALL use the canonical localized `/feedback-submissions` route.

#### Scenario: Authorized reviewer sees moderation navigation
- **WHEN** the fixture application shell renders with `feedback:read`
- **THEN** `Phản hồi người dùng` appears after user management and before developer tooling under `Cài đặt`

#### Scenario: Unauthorized user does not see moderation navigation
- **WHEN** the fixture application shell renders without `feedback:read`
- **THEN** the moderation navigation item is absent

### Requirement: Moderation queue prioritizes pending work
The moderation queue SHALL default to status `PENDING_REVIEW`, shown as `Chờ xem xét`, and SHALL provide fixture-backed title search, type filtering, status filtering, sorting, page-size selection, and pagination. Search, filter, sort, page, and size state SHALL be represented in the URL and SHALL reset page to `1` when a controlling value changes.

#### Scenario: Opening the moderation queue without query state
- **WHEN** an authorized reviewer opens `/feedback-submissions` without a status query
- **THEN** the queue resolves the effective status to `PENDING_REVIEW`
- **AND** only matching fixture records are rendered

#### Scenario: Changing queue filters
- **WHEN** the reviewer changes title search, type, status, sort, or page size
- **THEN** the matching URL query state is updated through localized navigation helpers
- **AND** `page` resets to `1`
- **AND** unrelated query parameters are preserved

#### Scenario: Navigating browser history
- **WHEN** the reviewer uses Back or Forward after changing queue controls
- **THEN** the visible controls and fixture results reflect the restored URL state

### Requirement: Moderation queue remains aligned with list data
The queue SHALL display only list-level fields available from the accepted feedback list contract: type, title, localized status, submission date, and screenshot presence. It SHALL NOT display feedback sender information, status facet counts, metric cards, or custom whole-row activation.

#### Scenario: Rendering a queue row
- **WHEN** a fixture feedback list item is rendered
- **THEN** its title is a semantic localized link to `/feedback-submissions/{id}`
- **AND** type and status remain understandable without relying on color alone

#### Scenario: Rendering unavailable sender data
- **WHEN** the queue list fixture does not contain sender information
- **THEN** the table has no `Người gửi` column
- **AND** the UI does not issue a detail request for every row to synthesize one

#### Scenario: Rendering no matching records
- **WHEN** active queue controls produce no fixture matches
- **THEN** the queue renders a localized no-results Empty state that preserves the fluid list surface
- **AND** the current controls remain available for recovery

### Requirement: Moderation detail separates evidence from actions
The canonical moderation detail SHALL present full feedback content, type, localized status, timestamps, screenshot, technical context, review outcome, optional GitHub reference, and `Người gửi` identity. Wide layouts SHALL use a primary content region and secondary action/metadata rail; narrow layouts SHALL reflow to one readable column without page-level horizontal overflow.

#### Scenario: Viewing moderation detail on a wide viewport
- **WHEN** an authorized reviewer opens `/feedback-submissions/{id}` on a wide viewport
- **THEN** submission evidence remains primary and the metadata/action rail remains secondary
- **AND** screenshot and long-form text stay within intentional readable surfaces

#### Scenario: Viewing moderation detail on a narrow viewport
- **WHEN** the same detail renders on a narrow viewport or at 200% zoom
- **THEN** content and actions stack in a logical reading order
- **AND** all controls remain reachable without horizontal page scrolling

#### Scenario: Rendering feedback sender identity
- **WHEN** detail fixture data contains sender fields
- **THEN** the surface labels the entity `Người gửi`
- **AND** it does not use `Reporter`, `tác giả`, or `nhà báo` as user-facing terminology

### Requirement: Review actions require permission and fixture capability
The detail SHALL expose `Chuyển xử lý` and `Không tiếp nhận` only when the current permission collection includes `feedback:review` and the selected fixture record explicitly grants the matching capability. The UI MUST NOT derive review-action availability from status alone.

#### Scenario: Reviewer can move feedback to follow-up handling
- **WHEN** the reviewer has `feedback:review` and the fixture grants promote capability
- **THEN** `Chuyển xử lý` is available

#### Scenario: Reviewer can decline feedback
- **WHEN** the reviewer has `feedback:review` and the fixture grants dismiss capability
- **THEN** `Không tiếp nhận` is available

#### Scenario: Reviewer lacks permission or capability
- **WHEN** either `feedback:review` or the matching fixture capability is absent
- **THEN** the corresponding review action is absent
- **AND** readable detail content remains available to a user with `feedback:read`

### Requirement: Review outcome Dialogs collect a user-visible message
Both review actions SHALL use an accessible form Dialog requiring `Nội dung gửi tới người dùng` between 10 and 1000 characters. The message SHALL be treated as user-visible `Kết quả xem xét`, not as an internal note. The Dialogs SHALL NOT expose an editable `githubIssueUrl` field.

#### Scenario: Submitting a valid promote outcome
- **WHEN** a reviewer enters a valid message and confirms `Chuyển xử lý`
- **THEN** the fixture record changes to `PROMOTED`
- **AND** detail remains open with `Đã chuyển xử lý` and the new `Kết quả xem xét`
- **AND** a localized success toast is shown

#### Scenario: Submitting a valid dismiss outcome
- **WHEN** a reviewer enters a valid message and confirms `Không tiếp nhận`
- **THEN** the fixture record changes to `DISMISSED`
- **AND** detail remains open with `Không tiếp nhận` and the new `Kết quả xem xét`
- **AND** a localized success toast is shown

#### Scenario: Submitting an invalid review message
- **WHEN** the review message is shorter than 10 characters, longer than 1000 characters, or empty
- **THEN** the fixture mutation is not performed
- **AND** a localized field error is announced and associated with the textarea

#### Scenario: Review mutation fails
- **WHEN** a configured review mutation fails
- **THEN** the Dialog remains open with the valid message preserved
- **AND** controls recover for retry or cancellation

### Requirement: Administrative deletion is isolated and capability-gated
The moderation detail SHALL expose `Xóa phản hồi` only when the current permission collection includes `feedback:delete` and the fixture record grants erase capability. Deletion SHALL use a localized AlertDialog separated from review actions.

#### Scenario: Administrator can erase feedback
- **WHEN** the user has `feedback:delete` and the fixture grants erase capability
- **THEN** `Xóa phản hồi` is available in the destructive action area
- **AND** activation opens an AlertDialog naming the affected feedback

#### Scenario: Administrative deletion is unavailable
- **WHEN** permission or fixture erase capability is absent
- **THEN** the delete control is absent

#### Scenario: Delete mutation fails
- **WHEN** the configured delete fixture fails after confirmation
- **THEN** the AlertDialog remains recoverable
- **AND** duplicate confirmation is prevented while pending
- **AND** retry and cancel become available after failure

### Requirement: Queue context survives detail review
Navigation between the moderation queue and canonical detail SHALL preserve the queue's URL-backed search, filter, sort, page, and size state. Successful review actions SHALL keep the reviewer on detail rather than automatically returning to the queue.

#### Scenario: Returning to a filtered queue
- **WHEN** a reviewer opens detail from a filtered queue and then uses the browser Back action
- **THEN** the queue restores its prior URL state and matching fixture rows

#### Scenario: Completing a review
- **WHEN** Promote or Dismiss succeeds on detail
- **THEN** the reviewer remains on the same canonical detail route
- **AND** the updated status and action capabilities are rendered without a forced queue redirect

### Requirement: Moderation states follow shared design and accessibility rules
The moderation queue and detail SHALL use the fluid Financial Command Surface, shared list/table and pagination composition, existing semantic tokens, Geist typography, Lucide icons, and dictionary-backed copy. Loading, empty, error, missing, and permission-denied states SHALL preserve final geometry and SHALL remain operable in light and dark themes, reduced motion, keyboard navigation, screen readers, narrow viewports, and 200% zoom.

#### Scenario: Loading the moderation queue
- **WHEN** the queue fixture is configured as loading
- **THEN** the skeleton mirrors the final toolbar, table, and pagination footprint

#### Scenario: Loading moderation detail
- **WHEN** the detail fixture is configured as loading
- **THEN** the skeleton mirrors the final content and metadata/action rail at the active breakpoint

#### Scenario: Operating review with keyboard
- **WHEN** a reviewer completes a review or deletion flow using keyboard only
- **THEN** focus order, visible focus, Dialog trapping, error announcement, and focus restoration remain correct

#### Scenario: Rendering localized moderation copy
- **WHEN** the active locale is Vietnamese or English
- **THEN** navigation, headings, table labels, filters, Dialogs, alerts, toasts, empty states, errors, and accessible names come from the matching dictionary
