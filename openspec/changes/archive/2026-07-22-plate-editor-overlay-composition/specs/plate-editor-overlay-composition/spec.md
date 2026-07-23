## ADDED Requirements

### Requirement: Plate emoji Popovers use the shadcn wrapper boundary
The Plate editor SHALL compose emoji Popovers through `@/components/ui/popover` without directly importing a Radix Popover primitive.

#### Scenario: Emoji picker source is reviewed
- **WHEN** the Plate emoji toolbar and callout picker compositions are inspected
- **THEN** their Popover root, trigger, and content come from the local shadcn wrapper
- **AND** no direct Radix Popover import is required by the emoji picker

#### Scenario: Emoji picker surface is rendered
- **WHEN** the emoji picker opens
- **THEN** the shadcn Popover content owns the overlay surface and stacking behavior
- **AND** the picker retains its required dimensions without duplicate surface chrome

### Requirement: Shared Popovers honor modal Sheet portal boundaries
The shared shadcn Popover content SHALL portal into the nearest provided Sheet content element and SHALL retain the standard Radix body portal when no Sheet container is available.

#### Scenario: Select an emoji inside Personal Notes
- **WHEN** a user opens the Plate emoji picker in the Personal Notes Quick Sheet and selects an emoji
- **THEN** Plate inserts the selected emoji at the current editor selection
- **AND** the Personal Notes Sheet remains open
- **AND** the emoji picker follows its configured close-on-select behavior

#### Scenario: Use the emoji picker on the editor page
- **WHEN** a user selects an emoji on `/editor` without an enclosing Sheet provider
- **THEN** the Popover uses the standard Radix body portal
- **AND** Plate inserts the emoji with the existing standalone behavior

#### Scenario: Open a Popover in a nested Sheet composition
- **WHEN** a shared Popover is rendered beneath more than one overlay-container provider
- **THEN** its content portals into the nearest provided Sheet content element

#### Scenario: Interact with the modal background
- **WHEN** the emoji picker is open inside the Personal Notes Sheet
- **THEN** the Sheet retains focus isolation, background interaction blocking, and background scroll locking
