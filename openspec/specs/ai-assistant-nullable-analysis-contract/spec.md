# ai-assistant-nullable-analysis-contract Specification

## Purpose
TBD - created by archiving change align-ai-assistant-nullable-analysis-contract. Update Purpose after archive.
## Requirements
### Requirement: Assistant messages map analysis only from analysis turns
The system SHALL render a market-analysis Assistant UI data part only for assistant messages whose backend kind is `ANALYSIS` and whose `analysisId` is a valid non-null identifier.

#### Scenario: Analysis turn has a valid artifact
- **WHEN** a backend assistant message has `kind=ANALYSIS` and a valid `analysisId`
- **THEN** the runtime message preserves the assistant text and includes one named `market-analysis` data part for that identifier

#### Scenario: Analysis turn lacks an artifact identifier
- **WHEN** a backend assistant message has `kind=ANALYSIS` and `analysisId=null`
- **THEN** the runtime message preserves the assistant text without creating a market-analysis data part or requesting analysis details

### Requirement: Non-analysis assistant turns remain text-only
The system SHALL render assistant `TEXT` messages as normal assistant text without analysis disclosure, analysis loading, or analysis-detail actions.

#### Scenario: Chat turn is returned as text
- **WHEN** a backend assistant message represents a chat turn as `kind=TEXT` and `analysisId=null`
- **THEN** the assistant modal renders the message text only and does not show analysis availability UI

#### Scenario: Clarification turn is returned as text
- **WHEN** a backend assistant message represents a clarification turn as `kind=TEXT` and `analysisId=null`
- **THEN** the assistant modal renders the clarification as normal assistant text without analysis-specific badges, loaders, or disclosure controls

#### Scenario: Refusal turn is returned as text
- **WHEN** a backend assistant message represents a refusal turn as `kind=TEXT` and `analysisId=null`
- **THEN** the assistant modal renders the refusal as normal assistant text without analysis-specific badges, loaders, or disclosure controls

#### Scenario: Text turn contains an inconsistent analysis identifier
- **WHEN** a backend assistant message has `kind=TEXT` but includes a non-null `analysisId`
- **THEN** the runtime treats the message as text-only and does not create a market-analysis data part

### Requirement: Nullable analysis identifiers are accepted across conversation APIs
The system SHALL accept nullable `analysisId` values from submit, conversation detail, and conversation message-list responses without treating null as an error.

#### Scenario: Submit returns a non-analysis assistant response
- **WHEN** `POST /market-conversations/{id}/messages` returns `analysisId=null`, `assistantMessage.analysisId=null`, and `assistantMessage.kind=TEXT`
- **THEN** the frontend appends the user and assistant messages and keeps the assistant response text-only

#### Scenario: Conversation detail contains non-analysis messages
- **WHEN** `GET /market-conversations/{id}` returns assistant messages with `kind=TEXT` and `analysisId=null`
- **THEN** the frontend loads the conversation without rendering analysis parts for those messages

#### Scenario: Message list contains mixed assistant turns
- **WHEN** `GET /market-conversations/{id}/messages` returns a mix of `TEXT` messages with `analysisId=null` and `ANALYSIS` messages with valid identifiers
- **THEN** the frontend renders text-only messages and analysis-capable messages according to each message's own kind and identifier

### Requirement: Non-analysis subtypes are not inferred by frontend text parsing
The system SHALL NOT infer chat, clarification, or refusal subtypes from assistant message content when the backend exposes only `kind=TEXT`.

#### Scenario: Text content resembles a clarification
- **WHEN** a `TEXT` assistant message asks the user for more input
- **THEN** the frontend renders the content as normal assistant text and does not attach inferred subtype state

#### Scenario: Text content resembles a refusal
- **WHEN** a `TEXT` assistant message declines a request
- **THEN** the frontend renders the content as normal assistant text and does not attach inferred subtype state

