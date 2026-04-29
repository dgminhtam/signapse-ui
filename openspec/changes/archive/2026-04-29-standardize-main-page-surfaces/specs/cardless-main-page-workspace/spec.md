## ADDED Requirements

### Requirement: Main pages use cardless workspace composition
The system SHALL render active `app/(main)` pages without a decorative top-level `Card` shell when that card only frames the entire page and duplicates route identity.

#### Scenario: List page renders primary content
- **WHEN** an active list page under `app/(main)` renders its primary content
- **THEN** the page renders list content directly in the layout workspace without wrapping the whole page in `Card`
- **AND** the list relies on shared toolbar, table, and pagination surfaces for content boundaries

#### Scenario: Simple tool page renders primary content
- **WHEN** an active tool page under `app/(main)` renders a workbench or control surface
- **THEN** the page does not add a decorative main `Card` around the entire route
- **AND** meaningful tool panels may still use contained surfaces inside the workspace

### Requirement: Breadcrumbs provide canonical page identity
The system SHALL use app breadcrumbs as the canonical visible page identity for simple `app/(main)` pages after main-card headers are removed.

#### Scenario: Removed card header repeated route name
- **WHEN** a page's removed `CardTitle` only repeated the current route name
- **THEN** the breadcrumb label provides the visible page name
- **AND** the page does not render a replacement static heading solely to duplicate the breadcrumb

#### Scenario: Breadcrumb label is stale
- **WHEN** a route's breadcrumb label does not match the active user-facing page name
- **THEN** the breadcrumb mapping is updated during the migration
- **AND** the route no longer depends on a duplicate card title to correct the visible name

### Requirement: Cards remain available for meaningful inner surfaces
The system SHALL allow `Card` usage below the page level when the card groups a distinct unit of content or interaction instead of acting as the decorative main page shell.

#### Scenario: Dashboard repeated metric cards
- **WHEN** a dashboard page renders repeated summary cards or metric panels
- **THEN** those inner cards may remain because they represent repeated content units
- **AND** the page itself is not wrapped in a separate main-card shell

#### Scenario: Detail page with grouped sections
- **WHEN** a detail page renders dynamic content sections, evidence panels, or related-data panels
- **THEN** those inner surfaces may use `Card` when they improve grouping and scanability
- **AND** the outer route wrapper does not use the old `Card > CardHeader > Separator > CardContent` page-shell pattern

#### Scenario: Permission denied state
- **WHEN** a user lacks permission for an active page
- **THEN** the page presents access-denied content without restoring the old full-page main-card shell
- **AND** any containment used for the denied state is scoped to the denied content, not to a duplicated page header and separator

### Requirement: Main-card cleanup is complete
The system SHALL remove imports, wrappers, separators, skeleton scaffolding, and copy that only supported the old main-card page shell.

#### Scenario: Page no longer uses main Card composition
- **WHEN** a page is migrated to cardless workspace composition
- **THEN** unused imports from `components/ui/card` and `components/ui/separator` are removed
- **AND** dead helper components or wrapper markup created only for the old main-card shell are removed

#### Scenario: Skeleton mirrors final cardless layout
- **WHEN** a migrated page renders a loading or suspense fallback
- **THEN** the fallback mirrors the final cardless workspace structure
- **AND** it does not reintroduce a main-card header, separator, or content wrapper that the final state no longer uses

### Requirement: Repository guidance prevents main-card regressions
The system SHALL document the cardless main-page workspace convention in `AGENTS.md` and SHALL update review expectations so new work does not reintroduce decorative main-card shells.

#### Scenario: Future list page guidance
- **WHEN** a contributor creates or reviews a new list page
- **THEN** repo guidance requires a cardless workspace using shared list surfaces
- **AND** it does not require wrapping the list page in a top-level `Card`

#### Scenario: Future form or detail page guidance
- **WHEN** a contributor creates or reviews a form or detail page
- **THEN** repo guidance allows cards for meaningful inner sections
- **AND** it rejects a top-level card whose only purpose is repeating the breadcrumb title and framing the whole page
