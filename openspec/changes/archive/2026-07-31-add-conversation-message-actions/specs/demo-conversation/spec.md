## ADDED Requirements

### Requirement: Persisted conversation messages expose accessible role-aware actions and timestamps

The promoted conversation SHALL provide compact localized message footers for persisted messages, preserve the original message source when copying, and keep every available footer action operable without relying only on hover.

#### Scenario: Persisted user message exposes its actions

- **WHEN** a persisted non-empty user message is rendered
- **THEN** its footer MUST provide a Copy action and locale-aware created-time metadata
- **AND** the footer MUST align with the user message side

#### Scenario: Completed assistant message exposes its actions

- **WHEN** a persisted completed non-empty assistant message has finished progressive reveal
- **THEN** its footer MUST provide Copy and Send to Telegram actions plus locale-aware created-time metadata
- **AND** the footer MUST align with the assistant message side

#### Scenario: Assistant Markdown is copied from source

- **WHEN** the user activates Copy for a completed assistant message containing Markdown
- **THEN** the system MUST write the exact backend `content` string to the clipboard
- **AND** it MUST NOT derive copied content from rendered DOM text or strip Markdown syntax

#### Scenario: Copy operation reports its result

- **WHEN** a message copy succeeds or fails
- **THEN** the system MUST show matching localized success or error feedback
- **AND** a clipboard failure MUST leave the transcript and message content unchanged

#### Scenario: Telegram placeholder is activated

- **WHEN** the user activates Send to Telegram for an assistant message
- **THEN** the system MUST show localized feedback that the feature is not yet available
- **AND** it MUST NOT send a request, navigate, or mutate conversation state

#### Scenario: Pointer user reveals a message footer

- **WHEN** a hover-capable pointer rests on a persisted message
- **THEN** the corresponding footer MUST become visible without shifting the transcript layout
- **AND** leaving the message MAY return the footer to its visually quiet state

#### Scenario: Keyboard user reaches a message action

- **WHEN** keyboard focus enters a message footer action
- **THEN** the footer and focused control MUST be visible
- **AND** the control MUST expose a localized accessible name and visible focus treatment

#### Scenario: Device does not support hover

- **WHEN** the conversation is used on a device without hover capability
- **THEN** available message footers MUST remain visible and touch operable

#### Scenario: Message does not have stable actionable content

- **WHEN** an assistant response is pending, progressively revealing, empty, or failed
- **THEN** content actions MUST NOT be exposed for unavailable or not-yet-revealed source content
- **AND** a persisted failed message MUST still expose its locale-aware created-time metadata

#### Scenario: Persisted timestamp is presented

- **WHEN** a persisted message footer displays `createdDate`
- **THEN** it MUST use the active locale and the shared compact icon-bearing time metadata treatment
- **AND** the timestamp MUST retain its original machine-readable value through semantic time markup
