## ADDED Requirements

### Requirement: API mapping ledger reflects backend snapshot semantics
The system SHALL keep `docs/APIMAPPING.md` aligned with `docs/api_mapping.json` for documented endpoint semantics, including paths, operation IDs, request and response schema names, enum values, and `x-signapse-auth` permission metadata.

#### Scenario: Telegram feature setting keys are documented from the feature setting schema
- **WHEN** `docs/APIMAPPING.md` documents Telegram feature route keys
- **THEN** it lists the feature keys from `UpdateTelegramFeatureSettingRequest.featureKey` and `TelegramFeatureSettingResponse.featureKey`

#### Scenario: System prompt types are not documented as Telegram feature route keys
- **WHEN** `docs/APIMAPPING.md` documents Telegram feature route keys
- **THEN** it MUST NOT list Telegram-related `SystemPrompt` prompt type enum values as feature route keys

### Requirement: API mapping ledger preserves frontend implementation status
The system SHALL distinguish backend endpoint availability from frontend integration status in `docs/APIMAPPING.md`.

#### Scenario: Backend Telegram endpoints exist but frontend is not integrated
- **WHEN** the Telegram endpoint table is updated before frontend Telegram implementation exists
- **THEN** each Telegram endpoint remains marked as not implemented or backend-only as appropriate

#### Scenario: Frontend ownership remains empty for unimplemented Telegram surface
- **WHEN** `docs/APIMAPPING.md` lists frontend files related to Telegram before integration exists
- **THEN** it records no frontend ownership paths for Telegram

### Requirement: API mapping ledger documents Telegram permissions from auth metadata
The system SHALL document Telegram endpoint permission requirements using the `x-signapse-auth` metadata from `docs/api_mapping.json`.

#### Scenario: Telegram manage operation is documented
- **WHEN** a Telegram endpoint has an `x-signapse-auth.permissions` manage permission in `docs/api_mapping.json`
- **THEN** the corresponding `docs/APIMAPPING.md` note includes that permission

#### Scenario: Telegram read operation is documented
- **WHEN** a Telegram endpoint has an `x-signapse-auth.permissions` read permission in `docs/api_mapping.json`
- **THEN** the corresponding `docs/APIMAPPING.md` note includes that permission
