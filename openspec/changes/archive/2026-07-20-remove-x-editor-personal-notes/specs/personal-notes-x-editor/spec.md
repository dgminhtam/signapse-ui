## REMOVED Requirements

### Requirement: Personal notes MUST use x-editor through a stable adapter
**Reason**: The current frontend no longer provides personal-note editing, so the x-editor adapter and generated implementation are being removed.
**Migration**: The header Sheet remains as an empty accessible shell. A future editor must be proposed as a new integration rather than relying on the removed adapter.

### Requirement: Personal note persistence MUST remain HTML-based
**Reason**: The empty interim Sheet performs no personal-note create or update operations and therefore has no frontend persistence boundary.
**Migration**: The backend `/me/notes` contract remains unchanged and can be integrated by a future personal-note implementation.

### Requirement: X-editor source MUST be organized and reviewable
**Reason**: All x-editor-owned source and direct Lexical dependencies are being deleted.
**Migration**: No compatibility module is retained. Archived OpenSpec changes remain available as historical context only.

### Requirement: X-editor MUST support read-only note viewing
**Reason**: The interim Sheet does not render saved note content.
**Migration**: A future viewing experience must define its own rendering and sanitization requirements.

### Requirement: X-editor migration MUST preserve existing note workflow behavior
**Reason**: Listing, editing, dirty-state protection, save/discard, and write-permission behavior are intentionally removed from the frontend.
**Migration**: Users retain only the permission-gated Sheet entry point until a replacement workflow is specified.
