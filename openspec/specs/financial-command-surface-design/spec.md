## Purpose
Maintain the authoritative source for durable Signapse UI and UX conventions, including the Financial Command Surface visual direction.

## Requirements

### Requirement: Persistent Design Direction Document

The system SHALL maintain `docs/design/DESIGN.md` as the authoritative source for durable Signapse UI and UX conventions, including the `Financial Command Surface` visual direction.

#### Scenario: Design direction document exists

- **WHEN** a developer opens `docs/design/DESIGN.md`
- **THEN** the document exists and references `docs/design/design_light.png` and `docs/design/design_dark.png`

#### Scenario: Design document defines authoritative UI conventions

- **WHEN** an agent implements or reviews user-visible UI
- **THEN** `docs/design/DESIGN.md` defines the applicable visual, theme, layout, component-composition, interaction, content, state, accessibility, and UI review conventions

#### Scenario: Design guidance matches current repository policy

- **WHEN** a developer reviews typography, shadcn chrome, page surfaces, or theme guidance
- **THEN** the document reflects Geist, the `radix-nova` neutral default, cardless app-page composition, and controlled shadcn wrapper maintenance without feature-specific primitive chrome

#### Scenario: Persistent guidance excludes rollout history

- **WHEN** the design source is maintained after this change
- **THEN** pilot routes, rollout order, deferred rollout targets, first-pass restrictions, and rollback history are not required sections of the persistent UI convention source

### Requirement: News article Quick detail exception is documented in design policy

The authoritative UI design policy SHALL describe News article Quick detail as a focused complete-reading exception that does not require a canonical-detail navigation action, while preserving the default escalation guidance for other applicable quick-detail entities.

#### Scenario: Developer reviews Quick detail guidance

- **WHEN** a developer implements or reviews a News article Quick detail drawer
- **THEN** the design policy distinguishes the News article exception from the default full-detail escalation guidance
- **AND** it continues to require that the drawer not embed full-page shell chrome
