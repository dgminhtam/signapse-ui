## ADDED Requirements

### Requirement: Personal notes MUST be available only through the header Sheet
The system SHALL expose the personal notes UI as a header Sheet utility and SHALL NOT provide a separate notes workspace destination.

#### Scenario: Header opens personal notes
- **WHEN** a user with personal-note read permission uses the app header
- **THEN** the header MUST show a compact personal-note trigger labeled `Ghi chú`
- **AND** activating it MUST open the personal notes Sheet

#### Scenario: Standalone notes workspace is removed from the app UI
- **WHEN** the personal notes Sheet-only refinement is implemented
- **THEN** the app MUST NOT provide an in-app `/notes` workspace link, breadcrumb destination, or expansion action
- **AND** personal-note create, update, selection, and save flows MUST remain available from the Sheet

### Requirement: Personal notes Sheet MUST optimize space for editing
The system SHALL minimize nonessential visible Sheet chrome so the note list and editor have more usable space.

#### Scenario: Visible Sheet heading copy is removed
- **WHEN** the personal notes Sheet opens
- **THEN** it MUST NOT show the visible copy `Ghi chú của tôi`
- **AND** it MUST NOT show the visible description `Ghi nhanh công thức, lệnh trade hoặc nội dung giảng dạy cá nhân.`
- **AND** it MUST still provide an accessible dialog title for assistive technologies

#### Scenario: Header trigger uses compact copy and icon
- **WHEN** the personal-note header trigger renders beside workspace and mode controls
- **THEN** its visible label MUST be `Ghi chú`
- **AND** its icon SHOULD be visually lightweight and consistent with adjacent header utility controls

### Requirement: Fullscreen mode MUST expand the editable Sheet
The system SHALL let users expand the current personal-note Sheet to the full viewport while preserving the same editor workflow and functionality.

#### Scenario: Fullscreen action expands the current Sheet editor
- **WHEN** a user activates the fullscreen action from the personal notes Sheet
- **THEN** the current Sheet/editor surface MUST expand to the full viewport
- **AND** it MUST NOT route away from the current app page
- **AND** it MUST NOT render a separate read-only presentation editor

#### Scenario: Fullscreen keeps full editing functionality
- **WHEN** the Sheet is fullscreen
- **THEN** the note list, rich-text toolbar, editor content, save bar, cancel behavior, create/update permissions, and explicit save behavior MUST remain available
- **AND** the user MUST be able to continue editing the current draft according to their permissions

#### Scenario: Fullscreen preserves state while toggling size
- **WHEN** a user edits note content in the Sheet and enters or exits fullscreen before saving
- **THEN** any unsaved draft content MUST remain in the editor
- **AND** dirty state MUST remain unchanged until the user explicitly saves or discards changes

#### Scenario: Fullscreen controls are icon-only
- **WHEN** the Sheet is not fullscreen
- **THEN** the fullscreen control MUST use an icon-only expand action with no visible text label
- **AND** it MUST provide an accessible label for assistive technologies
- **WHEN** the Sheet is fullscreen
- **THEN** the fullscreen control MUST switch to `MinimizeIcon`
- **AND** the minimize action MUST have no visible text label
- **AND** it MUST provide an accessible label for assistive technologies

### Requirement: Personal note editor toolbar MUST be streamlined
The system SHALL remove low-value x-editor toolbar actions from the personal note editor while preserving core rich-text editing.

#### Scenario: Low-priority top toolbar controls are removed
- **WHEN** the personal note x-editor toolbar renders
- **THEN** it MUST NOT show subscript or superscript toolbar controls
- **AND** it MUST NOT show the visible link toggle control in the top toolbar
- **AND** existing saved links and auto-link behavior SHOULD remain supported when possible

#### Scenario: Low-priority bottom actions are removed
- **WHEN** the personal note x-editor bottom action bar renders
- **THEN** it MUST NOT show the share action
- **AND** it MUST NOT show the tree view action
- **AND** other existing note-relevant actions MAY remain available

### Requirement: Personal note editor MUST NOT support Markdown authoring
The system SHALL remove Markdown-specific editing behavior and source paths from the personal note editor because personal notes are persisted and edited as rich HTML.

#### Scenario: Markdown UI and shortcuts are removed
- **WHEN** the personal note x-editor renders
- **THEN** it MUST NOT show a Markdown conversion toggle in the bottom action bar
- **AND** it MUST NOT register Markdown shortcut behavior for typed Markdown syntax
- **AND** it MUST NOT convert the editor document to or from Markdown code-block mode

#### Scenario: Markdown code is cleaned up without compatibility paths
- **WHEN** Markdown behavior is removed from the personal note editor
- **THEN** Markdown transformer imports, Markdown extension wiring, Markdown toggle code, and Markdown-specific editor source files MUST be removed when no longer referenced
- **AND** Markdown-related package dependencies MUST be removed from package metadata when no live source imports them
- **AND** the system MUST NOT keep a backwards-compatibility path for Markdown-authored notes

#### Scenario: Markdown cleanup blocker is reported
- **WHEN** a Markdown-related file or dependency cannot be removed cleanly because another live editor feature still imports it
- **THEN** implementation MUST report the blocker with exact file paths or package names
- **AND** implementation MUST NOT silently leave unexplained dead Markdown code behind

### Requirement: Font-size toolbar control MUST align with default shadcn sizing
The system SHALL use default shadcn control sizing for the font-size input/button group so the numeric input and minus/plus buttons align visually.

#### Scenario: Font-size input uses default height
- **WHEN** the font-size toolbar control renders
- **THEN** the numeric input MUST NOT hard-code a height class solely to align with neighboring buttons
- **AND** the input MAY keep layout-only width and text alignment classes

#### Scenario: Font-size buttons avoid manual icon sizing
- **WHEN** the minus and plus font-size buttons render
- **THEN** the buttons MUST use an existing shadcn button size that visually aligns with the default input
- **AND** icons inside those buttons MUST NOT use manual size classes
