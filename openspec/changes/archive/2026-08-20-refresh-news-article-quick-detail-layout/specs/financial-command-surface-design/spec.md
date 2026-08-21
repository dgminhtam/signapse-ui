## ADDED Requirements

### Requirement: News article Quick detail exception is documented in design policy
The authoritative UI design policy SHALL describe News article Quick detail as a focused complete-reading exception that does not require a canonical-detail navigation action, while preserving the default escalation guidance for other applicable quick-detail entities.

#### Scenario: Developer reviews Quick detail guidance
- **WHEN** a developer implements or reviews a News article Quick detail drawer
- **THEN** the design policy distinguishes the News article exception from the default full-detail escalation guidance
- **AND** it continues to require that the drawer not embed full-page shell chrome
