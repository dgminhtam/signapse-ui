## MODIFIED Requirements

### Requirement: Global conversation session ownership
The promoted conversation SHALL own one in-memory session for the active workspace.

#### Scenario: Close and reopen the conversation
- **WHEN** a user closes and reopens the conversation without changing workspace
- **THEN** the selected conversation, loaded messages, draft, pagination, and recoverable errors remain available

#### Scenario: Active workspace identity changes
- **WHEN** the protected shell resolves a different active workspace
- **THEN** the promoted conversation starts with a fresh workspace-scoped state tree
- **AND** responses owned by the previous instance cannot update the new workspace
