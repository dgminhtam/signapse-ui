# workspace-overview-narrative-preview Specification

## Purpose
TBD - created by archiving change add-overview-narrative-preview. Update Purpose after archive.
## Requirements

### Requirement: Root overview excludes the removed narrative preview

The root dashboard SHALL remain focused on the Current Workspace surface and SHALL NOT load or render the removed narrative preview.

#### Scenario: Root overview does not request narrative preview data
- **WHEN** an authenticated user opens the root dashboard overview
- **THEN** the overview does not request narrative summaries for the removed preview
- **AND** the Current Workspace surface remains available with its existing permission, loading, empty, and error behavior
