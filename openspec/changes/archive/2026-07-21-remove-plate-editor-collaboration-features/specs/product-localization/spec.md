## MODIFIED Requirements

### Requirement: Editor feedback avoids native browser dialogs

The application SHALL present editor input and recoverable editor failures through dictionary-backed application dialogs or toasts and MUST NOT invoke browser-native `prompt()`, `alert()`, or `confirm()` dialogs from application paths.

#### Scenario: Application source is inspected for native dialogs

- **WHEN** the editor application paths are statically inspected
- **THEN** no reachable browser-native `prompt()`, `alert()`, or `confirm()` call remains
