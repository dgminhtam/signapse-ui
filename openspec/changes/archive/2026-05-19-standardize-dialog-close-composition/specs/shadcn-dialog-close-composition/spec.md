## ADDED Requirements

### Requirement: Pure close actions use DialogClose composition
Dialog footer actions whose only purpose is to close, cancel, or dismiss the dialog SHALL use `DialogClose asChild` with the existing `Button` as the child.

#### Scenario: Close-only footer button
- **WHEN** a dialog footer contains a button labeled as a close, cancel, or dismiss action and the button has no business side effect beyond closing the dialog
- **THEN** the button MUST be composed through `DialogClose asChild` instead of calling `onOpenChange(false)` directly

#### Scenario: Pending close button
- **WHEN** a close-only footer button must be disabled during a pending or loading state
- **THEN** the disabled state MUST remain on the child `Button` inside `DialogClose asChild`

### Requirement: Controlled dialogs remain valid for parent-owned state
Feature dialogs whose open state is owned by a parent flow SHALL remain controlled with `open` and `onOpenChange` when the trigger is outside the dialog component or depends on workflow state.

#### Scenario: Parent-owned dialog open state
- **WHEN** a dialog is opened from existing parent state, row actions, validation results, or loaded data
- **THEN** the implementation MUST keep the controlled `Dialog` root and MUST NOT introduce `DialogTrigger` solely to match an example structure

### Requirement: Manual close handlers are reserved for side effects
Manual close handlers SHALL only remain on footer close/cancel buttons when the close action performs business behavior beyond closing the dialog and that behavior is not already handled by the root `onOpenChange`.

#### Scenario: Cleanup handled by root onOpenChange
- **WHEN** cleanup or reset behavior already runs through the dialog root `onOpenChange`
- **THEN** the footer close or cancel action MUST use `DialogClose asChild` and rely on the root close callback

#### Scenario: Extra close side effect required
- **WHEN** a close or cancel action must run additional behavior that is not part of the root `onOpenChange`
- **THEN** the implementation MAY keep a local handler, but the reason MUST be visible from the surrounding code behavior
