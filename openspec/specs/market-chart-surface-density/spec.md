# market-chart-surface-density Specification

## Purpose
TBD - created by archiving change refine-market-chart-surface-density. Update Purpose after archive.
## Requirements
### Requirement: Market chart uses full-width primary chart surface
The system SHALL prioritize chart reading space by rendering the market chart as the primary full-width data surface without a persistent right summary rail.

#### Scenario: Chart data workspace is displayed
- **WHEN** the user opens `/market-charts`
- **THEN** the chart surface uses the available content width after the toolbar
- **AND** no separate right-side summary card or rail reduces chart width

#### Scenario: Existing chart interactions remain available
- **WHEN** the right summary rail is removed
- **THEN** asset selection, timeframe selection, refresh, annotation toggle, chart rendering, and annotation popup interactions continue to work

### Requirement: Chart surface follows list table spacing and radius
The system SHALL align the market chart surface spacing, radius, border, and background with standardized list table surfaces.

#### Scenario: Toolbar and chart are rendered
- **WHEN** the market chart toolbar is followed by the chart surface
- **THEN** the chart surface owns the toolbar-to-surface spacing equivalent to `AppListTable`'s `mt-4`
- **AND** parent layout spacing does not create a larger custom gap between toolbar and chart

#### Scenario: Chart surface shell is rendered
- **WHEN** the market chart surface is displayed
- **THEN** the outer shell uses standard radius and border treatment matching list table surfaces
- **AND** custom radius values such as `rounded-[28px]` or `rounded-t-[28px]` are not used for the chart shell

### Requirement: Chart control wrapper matches shadcn control rhythm
The system SHALL render the annotation visibility switch wrapper with height, radius, border, and visual density aligned to default shadcn toolbar controls.

#### Scenario: Toolbar controls are displayed
- **WHEN** the asset selector, timeframe selector, event switch, and refresh button are shown together
- **THEN** the event switch wrapper visually aligns with the default height and radius of `SelectTrigger`, `Input`, and `Button`
- **AND** the wrapper does not look taller, sharper, or more card-like than the neighboring controls

### Requirement: Chart canvas text uses app font
The system SHALL configure KLineChart text styles to use the Signapse app sans font stack where the chart library exposes text style controls.

#### Scenario: Chart axis and crosshair text are rendered
- **WHEN** the chart draws axis ticks, crosshair labels, tooltip text, or legend text through KLineChart
- **THEN** those labels use the app sans font stack instead of the chart library default font where supported

#### Scenario: Chart font styling is applied
- **WHEN** the chart style adapter resolves colors and typography
- **THEN** font configuration remains local to the market chart canvas adapter and does not require changing global theme tokens or shadcn primitives

### Requirement: Annotation popup layering is preserved under normalized surface
The system SHALL preserve annotation popup readability after normalizing chart radius and clipping.

#### Scenario: Annotation popup opens near chart edge
- **WHEN** the user opens an annotation marker near the edge of the chart
- **THEN** the popup remains outside the clipped canvas region and is not cut off by the normalized chart surface radius

### Requirement: Chart surface prioritizes vertical reading space
The system SHALL use the available market chart workspace height for the primary chart surface without adding redundant panels or explanatory copy.

#### Scenario: Large screen chart workbench
- **WHEN** the market chart workbench is displayed on a large screen
- **THEN** the primary chart surface uses the available vertical reading space
- **AND** the workspace does not show a large unused area below the chart while the chart itself remains short

#### Scenario: Annotation legend is displayed
- **WHEN** the annotation legend is displayed below the chart
- **THEN** it remains compact and does not compete with the chart canvas

#### Scenario: Supporting metadata is displayed
- **WHEN** live status, update time, or annotation count metadata is displayed below the chart
- **THEN** it remains in the compact footer area rather than reintroducing a side summary panel or verbose description copy

