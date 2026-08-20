## MODIFIED Requirements

### Requirement: API mapping ledger preserves frontend implementation status
The system SHALL distinguish backend endpoint availability from frontend integration status in `docs/APIMAPPING.md`.

#### Scenario: Backend Telegram endpoints exist but frontend is not integrated
- **WHEN** the Telegram endpoint table is updated before frontend Telegram implementation exists
- **THEN** each Telegram endpoint remains marked as not implemented or backend-only as appropriate

#### Scenario: Frontend ownership remains empty for unimplemented Telegram surface
- **WHEN** `docs/APIMAPPING.md` lists frontend files related to Telegram before integration exists
- **THEN** it records no frontend ownership paths for Telegram

#### Scenario: News article linked-event rendering is documented accurately
- **WHEN** `docs/APIMAPPING.md` documents the `linkedEvents` field on a News article detail response
- **THEN** it records that the frontend receives the field but does not render linked-event UI in canonical News article detail or News article Quick detail
- **AND** it does not imply that event links or event-read permission behavior exist on either article-reading surface
