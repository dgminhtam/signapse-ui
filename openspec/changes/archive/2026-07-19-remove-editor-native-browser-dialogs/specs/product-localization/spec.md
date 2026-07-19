## ADDED Requirements

### Requirement: Editor feedback avoids native browser dialogs
The application SHALL present editor input and recoverable editor failures through dictionary-backed application dialogs or toasts and MUST NOT invoke browser-native `prompt()`, `alert()`, or `confirm()` dialogs from application paths.

#### Scenario: Comment edit is attempted before its ID is ready
- **WHEN** a user attempts to edit a comment that does not yet have an ID
- **THEN** the editor leaves the comment unchanged and shows a localized error toast
- **AND** it does not open a browser-native alert

#### Scenario: Comment deletion is attempted before its ID is ready
- **WHEN** a user attempts to delete a comment that does not yet have an ID
- **THEN** the editor leaves the comment unchanged and shows the same localized error toast
- **AND** it does not open a browser-native alert

#### Scenario: Application source is inspected for native dialogs
- **WHEN** the editor application paths are statically inspected
- **THEN** no reachable browser-native `prompt()`, `alert()`, or `confirm()` call remains
