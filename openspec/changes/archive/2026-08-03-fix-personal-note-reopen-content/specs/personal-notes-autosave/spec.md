## MODIFIED Requirements

### Requirement: Personal-note editing MUST follow Plate value ownership
The system SHALL initialize the Personal Notes editor from a selected note's Plate JSON value, SHALL retain backend-returned content from a successful mutation as the active note's persisted remount snapshot, and SHALL persist document mutations through `Plate.onValueChange` without controlling every keystroke through React state.

#### Scenario: Selected note initializes the editor
- **WHEN** a supported personal-note detail finishes loading
- **THEN** the shared Plate editor MUST initialize from the returned `content`
- **AND** the frontend MUST NOT mirror `editor.children` into a React-controlled value loop

#### Scenario: Saved active note remounts from persisted content
- **WHEN** a personal-note create or update succeeds and the Sheet later closes and reopens without reloading note detail
- **THEN** the shared Plate editor MUST initialize from the successful mutation response's `content`
- **AND** reopening MUST NOT require an additional detail request solely to recover that saved content

#### Scenario: Save response does not reset newer local edits
- **WHEN** a mutation succeeds after the user has already produced a newer Plate document revision
- **THEN** adopting the persisted remount snapshot MUST NOT replace the live Plate document
- **AND** the serialized save flow MUST retain and persist the newer revision

#### Scenario: Playground remains non-persistent
- **WHEN** the standalone `/editor` playground renders the shared Plate editor
- **THEN** it MUST retain its demo initial value
- **AND** it MUST NOT call a personal-note API

