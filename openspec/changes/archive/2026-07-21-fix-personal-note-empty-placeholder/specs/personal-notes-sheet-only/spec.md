## ADDED Requirements

### Requirement: Personal notes MUST use Plate placeholder ownership for empty paragraphs
The system SHALL display the localized Personal Notes writing hint through Plate's editor-level empty-state placeholder and active-block placeholder behavior without persisting the hint as document content.

#### Scenario: Pristine editable draft shows the writing hint
- **WHEN** an authorized creator opens a Personal Notes draft containing one empty paragraph
- **THEN** the shared editor MUST display the localized writing hint through its editor-level placeholder
- **AND** the hint MUST NOT require a persisted title or additional body block

#### Scenario: Active empty paragraph in a non-pristine document shows the writing hint
- **WHEN** an editable Personal Notes document contains other content and the user places a collapsed selection in an empty root paragraph
- **THEN** the shared editor MUST display the localized writing hint through Plate's active-block placeholder behavior

#### Scenario: Non-paragraph blocks do not show the body hint
- **WHEN** an empty heading, quote, list, or nested block is active
- **THEN** the shared editor MUST NOT display the Personal Notes paragraph hint for that block

#### Scenario: Placeholder remains presentation-only
- **WHEN** either Personal Notes placeholder path is visible
- **THEN** the hint MUST NOT be inserted into the Plate value or personal-note mutation payload

#### Scenario: Read-only empty note does not invite editing
- **WHEN** a supported Personal Notes document is rendered read-only with empty content
- **THEN** the shared editor MUST NOT display the localized writing hint
