## ADDED Requirements

### Requirement: Page Back Buttons Use Outline Default Treatment

Page-level back buttons on create and detail screens SHALL use the shadcn `Button` outline variant with default size.

#### Scenario: Page-level back button is rendered

- **WHEN** a create or detail page renders a page-level back button above its main content
- **THEN** the button MUST use `variant="outline"`
- **AND** the button MUST use the default `Button` size by omitting `size="sm"` or other size overrides
- **AND** the button MUST preserve `asChild` link composition when it navigates through `Link`

#### Scenario: Page-level back button has an icon

- **WHEN** a page-level back button renders `ArrowLeft`
- **THEN** the icon MUST use `data-icon="inline-start"`
- **AND** the icon MUST NOT add manual sizing classes only to restyle the button icon

#### Scenario: Page-level back button is aligned

- **WHEN** a page-level back button is aligned with page content
- **THEN** it MUST NOT use negative margin offsets such as `className="-ml-2"` only to pull the ghost button outside the content edge
- **AND** it MUST NOT use ad hoc `gap-*` classes when the default button gap already handles inline icon spacing

### Requirement: Back Button Standardization Preserves Navigation

The visual treatment change SHALL preserve existing navigation destinations and labels.

#### Scenario: Back button is migrated

- **WHEN** an existing page-level back button is migrated
- **THEN** its `href` MUST remain unchanged
- **AND** its visible label text MUST remain unchanged
- **AND** its placement above page content MUST remain unchanged

### Requirement: Non-Page Back Controls Are Out Of Scope

The page-level back button treatment SHALL NOT affect controls that are not page-level back buttons.

#### Scenario: Pagination previous control exists

- **WHEN** a pagination previous control renders a left chevron
- **THEN** it MUST NOT be changed by this page-level back button standardization

#### Scenario: Drawer or browser history back behavior exists

- **WHEN** a drawer closes through `router.back()` or a non-page-level control uses history behavior
- **THEN** it MUST NOT be changed by this page-level back button standardization
