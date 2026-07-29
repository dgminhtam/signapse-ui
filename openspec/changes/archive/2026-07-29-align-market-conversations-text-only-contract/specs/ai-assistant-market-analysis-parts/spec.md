## REMOVED Requirements

### Requirement: Analysis messages use structured Assistant UI content
**Reason**: Backend conversation messages no longer provide `kind` or `analysisId`, so the runtime has no supported input for a named market-analysis data part.

**Migration**: Convert assistant conversation content to text parts only.

### Requirement: Persisted analysis details load on demand
**Reason**: The conversation response no longer links a message to a persisted analysis.

**Migration**: Remove the disclosure and its lazy analysis loader from the assistant modal.

### Requirement: Analysis state respects conversation boundaries
**Reason**: Conversation-scoped analysis requests and disclosure state are being removed.

**Migration**: Remove analysis caches, request keys, expanded identifiers, reset logic, and retry/toggle callbacks from the conversation controller.

### Requirement: Compact analysis disclosure prioritizes decision context
**Reason**: The compact disclosure has no backend-supported entry point after `analysisId` removal.

**Migration**: Preserve the backend assistant text as the complete visible response.

### Requirement: Analysis disclosure is localized and accessible
**Reason**: The analysis disclosure UI is being deleted.

**Migration**: Keep ordinary assistant message rendering and failure feedback localized and accessible; remove disclosure-only copy and controls.

### Requirement: Full analysis workbench controls remain excluded
**Reason**: The underlying analysis message part is being removed, making this exclusion requirement unnecessary.

**Migration**: Do not add any replacement analysis workbench or heuristic analysis UI.
