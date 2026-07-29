# ai-assistant-nullable-analysis-contract Specification

## Purpose
TBD - created by archiving change align-ai-assistant-nullable-analysis-contract. Update Purpose after archive.
## Requirements
### Requirement: Non-analysis assistant turns remain text-only
The system SHALL render every backend assistant conversation message as normal assistant text without analysis disclosure, analysis loading, or analysis-detail actions.

#### Scenario: Assistant turn is returned
- **WHEN** a backend conversation response contains an assistant message with text content
- **THEN** the assistant modal renders the content as normal assistant text without analysis-specific badges, loaders, disclosure controls, or metadata

#### Scenario: Failed assistant turn is returned
- **WHEN** a backend conversation response contains an assistant message with `status=FAILED`
- **THEN** the assistant modal preserves its supported text and failure presentation without attempting to load analysis details

### Requirement: Non-analysis subtypes are not inferred by frontend text parsing
The system SHALL NOT infer chat, clarification, refusal, or analysis subtypes from assistant message content when the backend exposes no message-kind discriminator.

#### Scenario: Text content resembles a clarification
- **WHEN** an assistant message asks the user for more input
- **THEN** the frontend renders the content as normal assistant text and does not attach inferred subtype state

#### Scenario: Text content resembles a refusal
- **WHEN** an assistant message declines a request
- **THEN** the frontend renders the content as normal assistant text and does not attach inferred subtype state

#### Scenario: Text content resembles an analysis
- **WHEN** an assistant message contains analytical language or structured-looking text
- **THEN** the frontend renders the content as normal assistant text and does not create an analysis data part
