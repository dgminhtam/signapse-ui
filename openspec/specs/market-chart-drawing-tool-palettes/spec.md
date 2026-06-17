# market-chart-drawing-tool-palettes Specification

## Purpose
TBD - created by archiving change expand-market-chart-drawing-tool-palettes. Update Purpose after archive.
## Requirements
### Requirement: Drawing tools are organized into click-open palettes
The system SHALL render market chart drawing tools as grouped palettes instead of one flat drawing tool list.

#### Scenario: Drawing palettes are displayed
- **WHEN** the market chart drawing toolbar is visible
- **THEN** drawing tools are grouped into line, channel, shape, fibonacci, and pattern palettes
- **AND** each palette exposes a compact trigger in the drawing toolbar
- **AND** drawing state controls and destructive actions remain outside the drawing palettes

#### Scenario: User opens a drawing palette
- **WHEN** the user activates a drawing palette trigger
- **THEN** the system opens a click-triggered shadcn menu for that palette
- **AND** the system does not require hover-only behavior to access palette tools

#### Scenario: User selects a tool from a palette
- **WHEN** the user selects a tool from a drawing palette menu
- **THEN** that tool becomes the active drawing tool
- **AND** the menu closes using normal shadcn menu behavior

### Requirement: Drawing palettes expose the agreed tool set
The system SHALL provide the full drawing tool set selected for the market chart workstation.

#### Scenario: Line palette tools are available
- **WHEN** the user opens the line palette
- **THEN** the palette includes horizontal line, horizontal ray, horizontal segment, vertical line, vertical ray, vertical segment, trend line, ray, segment, arrow, and price line tools

#### Scenario: Channel palette tools are available
- **WHEN** the user opens the channel palette
- **THEN** the palette includes price channel line and parallel line tools

#### Scenario: Shape palette tools are available
- **WHEN** the user opens the shape palette
- **THEN** the palette includes circle, rectangle, parallelogram, and triangle tools

#### Scenario: Fibonacci palette tools are available
- **WHEN** the user opens the fibonacci palette
- **THEN** the palette includes Fibonacci line, Fibonacci segment, Fibonacci circle, Fibonacci spiral, Fibonacci sector, Fibonacci extension, and Gann box tools

#### Scenario: Pattern palette tools are available
- **WHEN** the user opens the pattern palette
- **THEN** the palette includes XABCD pattern, ABCD pattern, three waves, five waves, eight waves, and any waves tools

### Requirement: Drawing tool activation remains single-selection
The system SHALL keep market chart drawing activation limited to one active drawing tool at a time.

#### Scenario: User activates a drawing tool
- **WHEN** the user activates a drawing tool from any palette
- **THEN** the selected tool becomes the only active drawing tool
- **AND** any previously active drawing tool is cleared or replaced

#### Scenario: Drawing finishes
- **WHEN** the active drawing tool finishes creating an overlay
- **THEN** the system clears the active drawing tool
- **AND** the palette remembers the last selected tool for later reuse

#### Scenario: User cancels drawing
- **WHEN** the user cancels an active drawing operation
- **THEN** the system cancels the draft overlay
- **AND** no drawing tool remains active

### Requirement: Drawing tools create stable chart overlays
The system SHALL create non-crashing KLineChart overlays for every drawing tool exposed in the palettes.

#### Scenario: Built-in overlay tool is selected
- **WHEN** the selected drawing tool maps to a KLineChart built-in overlay template
- **THEN** the system creates that built-in overlay using Signapse drawing styles, lock state, visibility state, and magnet mode

#### Scenario: Signapse-owned overlay tool is selected
- **WHEN** the selected drawing tool requires a Signapse-owned overlay template
- **THEN** the system registers and creates that custom overlay without crashing the chart
- **AND** the overlay uses the same drawing group, selection, lock, visibility, and delete behavior as other drawing overlays

#### Scenario: Overlay cannot be created
- **WHEN** KLineChart cannot create the requested drawing overlay
- **THEN** the system clears the active drawing tool
- **AND** the system shows the existing drawing-unavailable feedback instead of leaving a stuck active tool

### Requirement: Drawing palette composition follows shadcn wrappers
The system SHALL compose drawing palette controls from project shadcn wrappers without ad-hoc menu primitives.

#### Scenario: Palette menu is rendered
- **WHEN** a drawing palette menu is rendered
- **THEN** the menu uses the project `DropdownMenu` wrapper components
- **AND** menu items are contained in `DropdownMenuGroup`

#### Scenario: Toolbar sections are separated
- **WHEN** the drawing toolbar is rendered
- **THEN** drawing palettes, drawing state controls, and destructive actions are separated by shadcn `Separator`
- **AND** the toolbar does not use custom hover timers or raw Radix primitive imports in feature code

#### Scenario: Assistive technology reads palette controls
- **WHEN** a screen reader user navigates the drawing toolbar
- **THEN** each palette trigger and each palette tool exposes a clear accessible name

### Requirement: Drawing style presets include expanded color and size choices
The system SHALL provide expanded preset drawing color and stroke size choices while keeping drawing style values constrained to Signapse-owned presets.

#### Scenario: Color presets are available
- **WHEN** the selected drawing color popover is opened
- **THEN** the system exposes a broader fixed preset palette that includes sky, blue, indigo, violet, fuchsia, rose, red, orange, amber, lime, emerald, and slate choices
- **AND** the system does not require arbitrary user-entered colors to style a drawing

#### Scenario: Stroke size presets are available
- **WHEN** the selected drawing size popover is opened
- **THEN** the system exposes `1px`, `2px`, `3px`, `4px`, and `5px` stroke size choices
- **AND** the system does not expose free-form numeric stroke size input

#### Scenario: Drawing style metadata remains preset-based
- **WHEN** the user changes the selected drawing color or size
- **THEN** the drawing style metadata continues to store the selected preset color and selected preset size
- **AND** existing overlay points, tool identity, lock state, visibility state, group identity, and extension metadata are preserved

#### Scenario: Expanded style presets apply across drawing categories
- **WHEN** the user applies any expanded color or size preset to a line, shape, fibonacci, or pattern drawing
- **THEN** the visible line or border style reflects the selected preset where the chart engine supports overlay styling

### Requirement: Drawing overlays carry stable style metadata
The system SHALL attach stable Signapse drawing style metadata to drawing overlays created from any drawing palette.

#### Scenario: Drawing is created from any palette
- **WHEN** the user creates a drawing from the line, channel, shape, fibonacci, or pattern palette
- **THEN** the created overlay stores its tool metadata and drawing style metadata
- **AND** existing metadata keys are preserved rather than overwritten

#### Scenario: Drawing style changes
- **WHEN** the user changes color or size for a selected drawing
- **THEN** the overlay style metadata updates to the new color and size
- **AND** the overlay points, tool identity, lock state, visibility state, and group identity are preserved

#### Scenario: Drawing style is restored from metadata
- **WHEN** a drawing overlay is cached, restored, or re-applied after chart style changes
- **THEN** the drawing uses the user-selected style metadata rather than reverting to only the chart default drawing style

### Requirement: Drawing style applies consistently across tool categories
The system SHALL apply selected drawing color and size to line, shape, fibonacci, and pattern drawing overlays where the chart engine supports overlay styling.

#### Scenario: Line-like drawing is restyled
- **WHEN** the user changes color or size on a line-like drawing
- **THEN** the drawing line color and line size reflect the selected style

#### Scenario: Shape drawing is restyled
- **WHEN** the user changes color or size on a shape drawing
- **THEN** the shape border color and border size reflect the selected style
- **AND** any fill remains subtle and derived from the selected color when fill is present

#### Scenario: Multi-segment drawing is restyled
- **WHEN** the user changes color or size on a fibonacci or pattern drawing
- **THEN** the visible line or border figures for that drawing reflect the selected style consistently

