## MODIFIED Requirements

### Requirement: Paginated persisted message timeline
The assistant SHALL load persisted conversation messages from the backend message-page contract and SHALL keep them in chronological display order.

#### Scenario: Persisted conversation is selected
- **WHEN** the user selects a persisted conversation
- **THEN** the system loads the latest message page with a bounded size of 30, normalizes messages into chronological order, and maps them into the active conversation timeline state

#### Scenario: Older messages are available
- **WHEN** the user requests older messages and the current page reports more history
- **THEN** the system requests the next `beforeMessageId` page, prepends unseen messages, and preserves chronological order

#### Scenario: Duplicate message is returned
- **WHEN** message pages or a submission response contain a message identifier already present in the timeline
- **THEN** the system reconciles the stored message with the latest payload instead of rendering the identifier twice

#### Scenario: Final page omits a next cursor
- **WHEN** a message page reports `hasMore` as false and its next cursor is null or absent
- **THEN** the system treats the timeline as exhausted and does not request another page

#### Scenario: Older-message request fails
- **WHEN** an older-message request fails
- **THEN** the system preserves the already loaded timeline and offers a localized retry state
