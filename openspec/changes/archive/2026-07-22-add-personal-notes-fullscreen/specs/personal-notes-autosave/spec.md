## MODIFIED Requirements

### Requirement: Personal-note saves MUST respect personal-note permissions
The system SHALL permit personal-note creation and editing only when the current user has the corresponding backend permission.

#### Scenario: Existing note is read-only without update permission
- **WHEN** a user has `personal-note:read` but lacks `personal-note:update`
- **THEN** the selected note MUST render read-only
- **AND** the Sheet MUST NOT render the floating Save control or invoke an update through the save shortcut

#### Scenario: Empty collection is editable with create permission
- **WHEN** no notes exist and the user has `personal-note:create`
- **THEN** the Sheet MUST provide an editable blank Plate document
- **AND** its first explicit or boundary save MUST use the create endpoint

#### Scenario: Empty collection is not editable without create permission
- **WHEN** no notes exist and the user lacks `personal-note:create`
- **THEN** the Sheet MUST show its localized empty state without an editable draft or Save action
