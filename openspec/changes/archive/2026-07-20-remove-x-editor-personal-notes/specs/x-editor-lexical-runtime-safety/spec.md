## REMOVED Requirements

### Requirement: X-editor reads MUST provide active editor context when needed
**Reason**: The x-editor implementation and all Lexical runtime paths have been removed.
**Migration**: No compatibility behavior remains; a future editor integration must define its own runtime-safety requirements.

### Requirement: Personal note HTML persistence MUST remain stable after the fix
**Reason**: The temporary empty Sheet has no frontend persistence or editor rehydration behavior.
**Migration**: The backend `/me/notes` contract remains unchanged for a future frontend integration.

### Requirement: Runtime fix MUST preserve existing note workflows
**Reason**: The note workflows and read-only editor surfaces covered by this runtime fix no longer exist in the frontend.
**Migration**: Users retain only the permission-gated empty Sheet entry point.
