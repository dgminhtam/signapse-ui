## MODIFIED Requirements

### Requirement: Quick detail is an accessible, single-scroll modal

Quick detail SHALL use a modal overlay with a sticky header containing a visible Close control, a localized entity-or-state accessible title, and a canonical full-detail action when the selected target is actionable. The title SHALL not include an internal profile prefix or owner/source description. The ready-state header SHALL not render a generic description that repeats the entity context. Loading, error, missing, and access-denied states SHALL continue to provide announced feedback in the body through their state-specific title, description, live-region, and busy semantics. The canonical action SHALL be available for loading, ready, and transient-error states with a known permitted target, and SHALL be absent for missing and access-denied states. The body SHALL be the only scrolling region. A sticky footer SHALL NOT duplicate the canonical action.

#### Scenario: Modal opens and closes with keyboard support

- **WHEN** a user opens quick detail from a keyboard-reachable trigger
- **THEN** focus moves to the visible Close control while the overlay announces the actual entity or state title
- **AND** the title does not include a profile prefix or generic owner/source description
- **AND** Escape closes the overlay and restores focus to the exact activating trigger

#### Scenario: Pointer and touch dismissal remain safe

- **WHEN** a user dismisses quick detail by clicking the desktop backdrop or swiping down a mobile bottom sheet
- **THEN** the overlay closes without navigation
- **AND** focus is restored safely to the activating trigger

#### Scenario: Header action follows recovery state

- **WHEN** quick detail is loading or shows a transient error for a permitted entity
- **THEN** its sticky header retains the canonical full-detail action
- **AND** the header does not expose that action for a missing or access-denied entity

#### Scenario: Ready state removes redundant header copy

- **WHEN** an authorized Event inspection or Article reader has loaded its entity
- **THEN** the sticky header title is the entity title without “Event inspection” or “Article reader” profile text
- **AND** the header contains no generic quick-detail description
- **AND** the body retains the Event description or Article reading content

#### Scenario: Non-ready state retains announced feedback

- **WHEN** quick detail is loading, missing, denied, or in a transient error state
- **THEN** the body continues to expose the state-specific title and description through its existing status, alert, busy, or recovery semantics
- **AND** removing the header description does not remove the state feedback
