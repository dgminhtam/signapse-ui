## ADDED Requirements

### Requirement: Consistent list search width
List search components SHALL use a consistent responsive wrapper width of full width on mobile and a shared desktop width token for list screens.

#### Scenario: Mobile search uses full width
- **WHEN** a list page is viewed on a mobile-width viewport
- **THEN** its search input occupies the available toolbar width instead of rendering as a narrow fixed-width control

#### Scenario: Desktop search uses shared width
- **WHEN** a list page is viewed on a desktop-width viewport
- **THEN** its search input uses the same standard width treatment as other list search inputs

### Requirement: Shared toolbar placement
List pages with search controls SHALL place primary actions and search in the leading toolbar area, and view controls such as sort and page size in the trailing toolbar area.

#### Scenario: Search appears in leading toolbar
- **WHEN** a list page renders a primary action and search input
- **THEN** the primary action and search appear together in the leading toolbar region

#### Scenario: View controls appear in trailing toolbar
- **WHEN** a list page renders sorting, filtering, or page-size controls
- **THEN** those controls appear in the trailing toolbar region and do not change the standard search width

### Requirement: No shared search abstraction
The implementation SHALL keep feature-local `[feature]-search.tsx` components unless a separate requirement introduces a shared search abstraction.

#### Scenario: Feature search remains local
- **WHEN** search width is standardized for a feature list
- **THEN** the feature continues to own its search component and query parameter mapping locally

### Requirement: Search layout guidance is documented
The repository guidance SHALL document the standard list search width and the expectation to use the shared list toolbar structure.

#### Scenario: Future list feature follows documented width
- **WHEN** a developer reads `AGENTS.md` before adding or reviewing a list search
- **THEN** the expected responsive search width and toolbar placement are explicitly documented
