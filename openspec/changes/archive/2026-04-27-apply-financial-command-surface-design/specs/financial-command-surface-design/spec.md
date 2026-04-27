## ADDED Requirements

### Requirement: Persistent Design Direction Document

The system SHALL include a persistent design direction document at `docs/design/DESIGN.md` that translates the reference screenshots in `docs/design/` into a dashboard-appropriate visual direction for Signapse.

#### Scenario: Design direction document exists

- **WHEN** a developer opens `docs/design/DESIGN.md`
- **THEN** the document exists and references `docs/design/design_light.png` and `docs/design/design_dark.png`

#### Scenario: Design direction document defines boundaries

- **WHEN** a developer reviews `docs/design/DESIGN.md`
- **THEN** the document identifies the `Financial Command Surface` direction, goals, non-goals, design principles, token direction, component translation, rollout guidance, deferred targets, visual QA checklist, and rollback notes

#### Scenario: Design direction is documentation-only

- **WHEN** this change is archived
- **THEN** the archived change does not claim that global tokens, app shell, shared surfaces, or pilot screens have been implemented
