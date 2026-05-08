## ADDED Requirements

### Requirement: News Outlet Form Shell Width
The news outlet create and edit forms MUST use a large focused form shell width that remains constrained and does not become full-width.

#### Scenario: Create form width
- **WHEN** the user opens the news outlet create form
- **THEN** the form shell MUST use the large shell width suitable for URL-heavy CRUD input
- **AND** the form shell MUST remain a focused inner task surface rather than spanning the full workspace

#### Scenario: Edit form width
- **WHEN** the user opens the news outlet edit form
- **THEN** the form shell MUST use the same large shell width as the create form
- **AND** metadata and fields MUST remain within the same focused shell

### Requirement: News Outlet Footer Action Alignment
The news outlet create and edit form footer actions MUST align to the left edge of the form content on desktop and preserve usable stacking on narrow viewports.

#### Scenario: Desktop footer actions
- **WHEN** the news outlet create or edit form renders on a desktop viewport
- **THEN** the submit and cancel actions MUST be left-aligned in the form footer

#### Scenario: Mobile footer actions
- **WHEN** the news outlet create or edit form renders on a narrow viewport
- **THEN** the footer actions MUST remain usable without overlapping or leaving the form shell

### Requirement: News Outlet Form Behavior Preservation
The layout refinement MUST NOT change news outlet create/edit form behavior.

#### Scenario: Submit behavior preserved
- **WHEN** the user submits the create or edit form
- **THEN** the form MUST keep its existing validation, pending disabled state, spinner in the submit button, toast behavior, redirect to `/news-outlets`, and `router.refresh()`

#### Scenario: Cancel behavior preserved
- **WHEN** the user uses the cancel action
- **THEN** the create form MUST keep its reset behavior
- **AND** the edit form MUST keep its reset-to-original behavior

### Requirement: Matching Form Fallback
Any news outlet create/edit loading fallback or skeleton MUST mirror the final large shell width and left-aligned footer action layout.

#### Scenario: Existing or added fallback
- **WHEN** a loading fallback or skeleton is rendered for news outlet create/edit
- **THEN** it MUST match the final form shell width and footer action alignment
