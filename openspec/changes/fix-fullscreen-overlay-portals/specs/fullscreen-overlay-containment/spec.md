## ADDED Requirements

### Requirement: Fullscreen overlays remain inside the fullscreen surface

The system SHALL render portal-based overlay content opened from a local fullscreen surface into that fullscreen surface or a descendant host so the content remains visible and interactive in the browser fullscreen top layer.

#### Scenario: Open a market chart popover in fullscreen

- **WHEN** the market chart surface is fullscreen and a user opens any toolbar, drawing, calendar, or annotation Popover
- **THEN** the Popover content is mounted inside the fullscreen surface subtree
- **AND** the content is visible, interactive, and dismissible

#### Scenario: Open a canvas overlay in fullscreen

- **WHEN** the market chart is fullscreen and a user opens an overlay from a canvas marker, drawing control, or annotation control
- **THEN** the overlay is mounted in the fullscreen surface subtree
- **AND** its existing content, placement, scrolling, and interaction behavior remain available

#### Scenario: Open local entity quick detail from fullscreen

- **WHEN** a user opens local entity quick detail from an annotation while the market chart is fullscreen
- **THEN** the Drawer content is mounted inside the fullscreen surface subtree
- **AND** the drawer remains visible, interactive, dismissible, and fixed to the fullscreen viewport

### Requirement: Shared portal wrappers resolve the nearest overlay host

Portal-backed shared wrappers used by the covered flows SHALL resolve the nearest `OverlayPortalContainerProvider` host, including Select, Tooltip, Drawer/Vaul, and Plate/Ariakit inline combobox content, while preserving existing host-aware wrappers.

#### Scenario: Select and Tooltip use the fullscreen host

- **WHEN** a Select or Tooltip is opened below a fullscreen overlay-container provider
- **THEN** its primitive portal mounts into the nearest provided host
- **AND** its existing keyboard, focus, collision, and dismissal behavior is preserved

#### Scenario: Plate inline combobox uses the fullscreen host

- **WHEN** a Plate inline combobox opens below a Personal Notes Sheet or fullscreen overlay-container provider
- **THEN** its Ariakit portal mounts into the nearest provided host
- **AND** item filtering, keyboard navigation, selection, and editor focus behavior remain available

#### Scenario: Existing host-aware wrappers continue to use the nearest host

- **WHEN** Popover, DropdownMenu, Dialog, or AlertDialog content is rendered below nested overlay-container providers
- **THEN** the content mounts into the nearest provider's host
- **AND** the outer provider does not receive the nested content

### Requirement: Body portal fallback remains unchanged

Shared portal wrappers SHALL retain their current default portal behavior when no `OverlayPortalContainerProvider` host is available.

#### Scenario: Overlay opens outside a local host

- **WHEN** a user opens a covered overlay on a normal page without an enclosing local overlay host
- **THEN** the primitive uses its standard body-level portal behavior
- **AND** its existing placement, stacking, focus, keyboard, and dismissal behavior remain unchanged

#### Scenario: Overlay host becomes available after mount

- **WHEN** a local fullscreen surface supplies its host through a callback ref after mount
- **THEN** descendants receive the host on the subsequent render
- **AND** the implementation does not create duplicate portal hosts or require a body-level workaround

### Requirement: Fullscreen containment preserves overlay accessibility

Fullscreen portal containment SHALL preserve the accessibility behavior of each underlying overlay primitive.

#### Scenario: Keyboard user dismisses an overlay

- **WHEN** a keyboard user opens a contained Popover, Select, Tooltip, Drawer, Dialog, AlertDialog, or combobox
- **THEN** the user can use the primitive's existing keyboard navigation and Escape dismissal
- **AND** focus returns according to the existing trigger or modal behavior

#### Scenario: Background remains isolated for modal content

- **WHEN** a contained Drawer, Dialog, AlertDialog, or Personal Notes Sheet is open in fullscreen mode
- **THEN** background interaction and scroll locking follow the primitive's existing modal behavior
- **AND** moving the portal node into the fullscreen subtree does not expose or activate the document behind it

### Requirement: Fullscreen overlay scope covers identified chart descendants

The market chart fullscreen host SHALL cover the chart's identified overlay entry points without changing their feature behavior.

#### Scenario: Chart toolbar overlays are opened

- **WHEN** a user opens toolbar event settings, indicators, Select controls, or Tooltip content in fullscreen mode
- **THEN** each overlay resolves to the chart fullscreen host
- **AND** the chart controls retain their existing state and actions

#### Scenario: Drawing and annotation overlays are opened

- **WHEN** a user opens drawing color/size controls, calendar controls, annotation popovers, or drawing-toolbar menus in fullscreen mode
- **THEN** each overlay resolves to the chart fullscreen host
- **AND** drawing, annotation, and calendar behavior remains unchanged
