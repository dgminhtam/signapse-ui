## ADDED Requirements

### Requirement: Popup renders outside chart container via Portal

The system SHALL render the desktop annotation popup content via a React Portal so that it is not clipped by any ancestor container's overflow.

#### Scenario: Popup is not clipped by chart frame
- **WHEN** the user opens an annotation marker at any position on the chart
- **THEN** the popup container is attached to `document.body` (or an equivalent portal root) rather than nested inside the chart surface DOM tree
- **AND** no ancestor of the popup applies `overflow: hidden` or other clipping that could truncate popup content

#### Scenario: Existing spec behaviors are preserved
- **WHEN** the popup opens via the new portal mechanism
- **THEN** all existing annotation-popup-surface requirements continue to hold (collision-aware placement, concise preview, direction dot, metadata row, keyboard accessibility, mobile fallback)
- **AND** all existing annotation-popup-interaction requirements continue to hold (marker click opens popup, dismiss on outside click or another marker select, responsive narrow-screen fallback)

### Requirement: Marker-to-popup association via PopoverTrigger

The system SHALL use Radix `Popover.Trigger` with `asChild` to associate each annotation marker button with its popup content.

#### Scenario: Marker button triggers popup
- **WHEN** the user clicks an annotation marker `<button>`
- **THEN** `Popover.Trigger` (via `asChild`) forwards the click to open the corresponding `PopoverContent`

#### Scenario: Popover state is self-managed
- **WHEN** the popup opens or closes
- **THEN** the Popover component manages its own open/close state internally via `onOpenChange`
- **AND** the parent workbench no longer stores `selectedAnnotationGroup` or `selectedAnnotationPoint` state

### Requirement: Popup placement is collision-aware via Radix primitives

The system SHALL rely on Radix Popover's built-in collision detection for popup placement, replacing the manual `getAnnotationPopupStyle()` function.

#### Scenario: Default placement near marker
- **WHEN** a PopoverContent opens anchored to a marker trigger
- **THEN** Radix Popover positions the content near the trigger with `side` and `align` defaults that favor visibility within the viewport

#### Scenario: Flip when near viewport edge
- **WHEN** the marker trigger is near a viewport edge
- **THEN** Radix Popover's collision detection flips the popup to the opposite side
- **AND** the popup remains fully visible within the viewport

### Requirement: Existing annotation access paths remain intact

The system SHALL preserve all existing non-canvas annotation access paths.

#### Scenario: Keyboard accessible controls
- **WHEN** the user opens an annotation through the annotation controls outside the canvas
- **THEN** the same popup content is displayed (or an equivalent fallback)

#### Scenario: Mobile fallback
- **WHEN** the chart is viewed on a narrow screen
- **THEN** the below-chart mobile fallback continues to work without relying on Popover portal behavior
