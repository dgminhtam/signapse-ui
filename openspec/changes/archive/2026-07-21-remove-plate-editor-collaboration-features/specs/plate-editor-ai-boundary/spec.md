## MODIFIED Requirements

### Requirement: Non-AI Plate editor behavior remains composed
The removal SHALL preserve the shared editor's remaining non-AI toolbars, Markdown support, block and cursor selection, tables, and other supported editing plugins, without requiring removed comment, discussion, or suggestion behavior.

#### Scenario: Editor kit is composed after removal
- **WHEN** the shared editor initializes after collaboration files are deleted
- **THEN** its remaining non-AI plugin kits and controls still resolve without an AI or collaboration replacement or compatibility shim
