## ADDED Requirements

### Requirement: Persisted transcript supports follow-up submission

The demo SHALL let an authorized user submit a non-empty text follow-up to the selected persisted conversation and SHALL use the validated backend response as transcript truth.

#### Scenario: Submit a persisted follow-up

- **WHEN** an authorized user submits a non-empty message while a persisted conversation is selected
- **THEN** the system posts the trimmed message to that selected conversation
- **AND** the returned user and assistant messages are appended once in chronological order
- **AND** the transcript follows the newly appended response at the live edge

#### Scenario: Submit empty content

- **WHEN** the persisted composer contains only empty or whitespace content
- **THEN** the system does not call the submit-message API
- **AND** no transcript message is added

#### Scenario: Submission is active

- **WHEN** a persisted message submission is in progress
- **THEN** the composer exposes localized pending feedback
- **AND** duplicate submission, History selection, and New chat are disabled until the request settles

#### Scenario: Submission fails

- **WHEN** the submit-message API returns a failure
- **THEN** the transcript remains unchanged
- **AND** the system exposes localized failure feedback
- **AND** the entered draft remains available for retry

#### Scenario: Stale submission completes

- **WHEN** a submission response completes after its selected transcript has been invalidated
- **THEN** the system ignores that response
- **AND** it does not replace or append to the current transcript

#### Scenario: Start a new scripted conversation

- **WHEN** the user activates New chat outside an active submission
- **THEN** the system invalidates persisted transcript state
- **AND** restores the initial scripted transcript, title, and composer behavior
- **AND** no persisted conversation is created

#### Scenario: User lacks submit permission

- **WHEN** a user without `query:execute` uses the standalone demo
- **THEN** no persisted transcript or submit-message action is available
- **AND** the existing scripted demo behavior remains available

## REMOVED Requirements

### Requirement: Persisted transcript is read-only

**Reason**: Selected persisted transcripts now support permission-scoped follow-up message submission.

**Migration**: Replace the disabled persisted composer with a controlled text composer that calls the existing submit action, while retaining New chat as the transition back to the scripted fixture.
