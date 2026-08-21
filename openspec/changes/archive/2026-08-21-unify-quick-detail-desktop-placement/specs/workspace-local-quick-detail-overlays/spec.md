## MODIFIED Requirements

### Requirement: Entity kind resolves the content profile

The shared quick-detail resolver SHALL derive content profile from entity kind and placement from the effective CSS viewport plus the resolved content profile. Owner surfaces SHALL retain local state, approved-entity scope, and host-specific portal or focus restoration behavior, but SHALL NOT select arbitrary Quick Detail mode, swipe direction, or dimensions.

#### Scenario: Event resolves Event inspection

- **WHEN** the selected entity kind is `event`
- **THEN** quick detail renders the Event inspection profile
- **AND** it presents a scan surface rather than a long-form reader

#### Scenario: News article resolves Article reader

- **WHEN** the selected entity kind is `news-article`
- **THEN** quick detail renders the Article reader profile
- **AND** it presents a full, focused reading surface rather than an event-review surface

### Requirement: Placement follows the approved responsive geometry

The resolver SHALL use the following shared placement and geometry policy for every approved owner. The `1440px` threshold is based on effective CSS viewport and SHALL NOT change with sidebar state.

| Effective CSS viewport | Event inspection | Article reader |
| --- | --- | --- |
| Every approved owner at `1440px` or wider | viewport-right sheet, maximum `32rem`, `100dvh` | viewport-right sheet, maximum `44rem`, `100dvh` |
| Every approved owner from `768px` to below `1440px` | bottom sheet, content-fit, `max-height: min(60dvh, 36rem)` | bottom sheet, `height: min(72dvh, 48rem)` |
| Every approved owner below `768px` | bottom sheet, content-fit, maximum `90dvh` | bottom sheet, `90dvh` |

#### Scenario: Large approved owner uses a viewport side sheet

- **WHEN** Dashboard, Graph View, or Market Charts opens a supported quick detail at an effective CSS viewport of at least `1440px`
- **THEN** the sheet is anchored to the right edge of its active overlay viewport or fullscreen container
- **AND** Event inspection and Article reader use their respective side-sheet widths

#### Scenario: Shared bottom-sheet fallback ignores sidebar state

- **WHEN** any approved owner opens a supported quick detail below `1440px`
- **THEN** it uses the defined bottom-sheet geometry for that entity profile
- **AND** toggling the Dashboard sidebar does not change the selected placement policy

#### Scenario: Workbench shares the desktop reading surface

- **WHEN** Graph View or Market Charts opens quick detail at `1440px` or wider
- **THEN** it uses the same right-side sheet geometry as Dashboard
- **AND** its owner-local graph or chart context remains mounted behind the modal

#### Scenario: Responsive re-resolution preserves the reading session

- **WHEN** resize or browser zoom crosses a placement threshold while quick detail is open
- **THEN** the overlay re-resolves its placement without changing the selected entity
- **AND** it preserves modal focus and body scroll position
- **AND** it does not replay an opening animation and respects `prefers-reduced-motion`

#### Scenario: Fullscreen market chart keeps fullscreen ownership

- **WHEN** Market Charts is fullscreen and opens quick detail
- **THEN** the overlay renders in the fullscreen portal container using the resolved shared geometry
- **AND** opening quick detail does not exit fullscreen
