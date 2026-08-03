## REMOVED Requirements

### Requirement: Overview loads narratives from backend
**Reason**: The root dashboard is being narrowed to the single Current Workspace surface, so narrative data is no longer used there.
**Migration**: Remove only the dashboard-side narrative request; retain the narrative API action and domain contracts for other consumers.

### Requirement: Overview renders a compact narrative preview
**Reason**: Narrative content is outside the simplified dashboard's workspace-orientation purpose.
**Migration**: Remove the narrative section, rows, formatting helpers, and narrative portion of the dashboard skeleton.

### Requirement: Narrative preview handles permission and data states
**Reason**: The dashboard no longer renders or requests narrative data, so dashboard-specific narrative states are unnecessary.
**Migration**: Remove the dashboard narrative permission branch and its empty/error rendering without changing workspace or watchlist states.

### Requirement: Narrative preview follows overview composition policy
**Reason**: No narrative preview remains on the root overview.
**Migration**: Continue applying the existing Signapse UI policy to the retained Current Workspace surface.
