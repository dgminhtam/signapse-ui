## MODIFIED Requirements

### Requirement: Global assistant adopts persisted conversation behavior
The promoted global assistant SHALL satisfy the persisted creation, status mapping, History search, pagination, transcript selection, operation-specific retry, and follow-up submission requirements defined by this capability.

#### Scenario: Promoted global assistant opens
- **WHEN** an authorized user opens the global assistant for an active workspace
- **THEN** all persisted requests and transcript state use the existing promoted conversation behavior
