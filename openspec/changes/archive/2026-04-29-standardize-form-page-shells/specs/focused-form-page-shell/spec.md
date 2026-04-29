## ADDED Requirements

### Requirement: Create and update pages use focused form shells
The system SHALL render active create and update CRUD pages with a focused inner form surface that groups the form task without reintroducing a decorative page-level main card.

#### Scenario: Create page renders a form
- **WHEN** an active create page under `app/(main)` renders a CRUD form
- **THEN** the form is contained in a focused form shell with a header, body, and footer
- **AND** the shell is an inner task surface rather than a page-level wrapper that duplicates breadcrumb identity

#### Scenario: Update page renders a form
- **WHEN** an active update page under `app/(main)` renders a CRUD form
- **THEN** the form is contained in a focused form shell with a header, body, and footer
- **AND** the footer contains the update submit action and a safe cancel or reset action

### Requirement: Focused form shell has consistent visual structure
The system SHALL use a consistent visual structure for create/update form shells while allowing width to vary by form density.

#### Scenario: Simple form is rendered
- **WHEN** a create/update form has low to moderate field density
- **THEN** the shell uses a constrained width such as `max-w-xl` or `max-w-2xl`
- **AND** fields are arranged with consistent gaps and responsive grids where useful

#### Scenario: Dense form is rendered
- **WHEN** a create/update form has long text, code-like content, model selection, or many fields
- **THEN** the shell may use a wider constrained width such as `max-w-3xl`
- **AND** the shell still keeps one header, one body, and one footer action zone

#### Scenario: Footer actions are rendered
- **WHEN** the form renders submit and secondary actions
- **THEN** those actions appear in a footer area separated from the body by a subtle border or surface treatment
- **AND** the layout remains usable on narrow viewports

### Requirement: Form behavior is preserved
The system SHALL preserve existing form behavior while migrating create/update layouts.

#### Scenario: Submit is pending
- **WHEN** a create/update form submit is pending
- **THEN** the submit button remains disabled
- **AND** the submit button shows the existing loading feedback with `Spinner`

#### Scenario: Submit succeeds
- **WHEN** a create/update form submission succeeds
- **THEN** the form preserves its existing navigation behavior back to the list or safe destination
- **AND** the route refresh behavior remains intact where currently used

#### Scenario: Cancel is used on update form
- **WHEN** a user cancels from an update form
- **THEN** the cancel behavior resets to initial data or navigates through an existing safe flow
- **AND** the cancel action does not silently discard changes through an unsafe custom path

### Requirement: Repository guidance documents create/update form shells
The system SHALL document the focused form shell convention in `AGENTS.md` so future create/update screens and reviews remain consistent.

#### Scenario: Future create form is reviewed
- **WHEN** a contributor creates or reviews a create form page
- **THEN** repo guidance requires a focused form shell with header, body, and footer action zone
- **AND** reviewers flag ad hoc submit rows or unbounded workspace forms as layout drift

#### Scenario: Future update form is reviewed
- **WHEN** a contributor creates or reviews an update form page
- **THEN** repo guidance requires the same focused form shell convention
- **AND** reviewers verify pending state, cancel/reset safety, Vietnamese copy, and skeleton parity

### Requirement: Non-form screens remain out of scope
The system SHALL NOT apply the focused form shell convention to screens that are not active create/update CRUD form pages.

#### Scenario: List or detail page is rendered
- **WHEN** a list page or detail-only page renders under `app/(main)`
- **THEN** it keeps its existing list/detail surface convention
- **AND** it is not wrapped in a focused form shell

#### Scenario: Workbench screen is rendered
- **WHEN** graph view, market query, dashboard, or other workbench-like screens render
- **THEN** they keep their screen-specific visual direction
- **AND** they are not migrated as part of this form-shell change
