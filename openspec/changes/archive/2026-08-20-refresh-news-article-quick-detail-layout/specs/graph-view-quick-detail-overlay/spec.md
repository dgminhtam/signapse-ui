## MODIFIED Requirements

### Requirement: Quick detail uses a focused Drawer reading surface
The quick detail overlay SHALL use a local shadcn Drawer reading surface with focused entity detail content rather than rendering the full page shell inside the overlay.

#### Scenario: Event quick detail is focused
- **WHEN** an event quick detail Drawer is open
- **THEN** it shows focused event reading content such as title, status, description or summary, key timestamps, confidence, evidence, linked source context, and an action to open the full detail page

#### Scenario: News article quick detail is focused
- **WHEN** a News article quick detail Drawer is open
- **THEN** it shows the title in drawer chrome and focused article reading content such as publisher/source context, publish time, summary or complete content, optional original-source access, feature media, and canonical safe Markdown
- **AND** it does not show status, linked-event context, a canonical full-page action, breadcrumb, list back button, or page-level shell chrome

#### Scenario: Page shell chrome is not duplicated
- **WHEN** quick detail renders event or News article content
- **THEN** it does not duplicate the full page's breadcrumb, list back button, broad technical panels, or page-level shell chrome inside the Drawer
