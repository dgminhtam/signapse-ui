## ADDED Requirements

### Requirement: Annotation popup marker color matches selected marker
The system SHALL render the annotation popup marker dot and pulse using the same color semantics as the selected chart annotation marker.

#### Scenario: Popup opens for a positive marker
- **WHEN** the user opens a positive or bullish annotation marker
- **THEN** the popup header marker uses the positive annotation color treatment

#### Scenario: Popup opens for a negative marker
- **WHEN** the user opens a negative or bearish annotation marker
- **THEN** the popup header marker uses the negative annotation color treatment

#### Scenario: Popup opens for neutral or mixed marker
- **WHEN** the user opens a neutral or mixed annotation marker
- **THEN** the popup header marker uses the matching neutral or mixed annotation color treatment

### Requirement: Annotation popup frame and scroll containment
The system SHALL keep the annotation popup frame visually intact while allowing only the event body content to scroll when needed.

#### Scenario: Popup content exceeds available height
- **WHEN** the selected annotation group contains enough event content to exceed the available popup height
- **THEN** the popup outer frame remains rounded and uncut
- **AND** only the inner content area scrolls

#### Scenario: Popup opens near chart edge
- **WHEN** the user opens an annotation marker near the chart surface edge
- **THEN** the popup clamps or flips to remain readable inside the available surface or viewport
- **AND** the popup is not visually clipped by the chart canvas frame

#### Scenario: Popup header remains usable
- **WHEN** the popup body scrolls
- **THEN** the popup title and close action remain visible and usable
