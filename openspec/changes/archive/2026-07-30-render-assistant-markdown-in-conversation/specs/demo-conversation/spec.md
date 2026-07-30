## ADDED Requirements

### Requirement: Safe assistant Markdown presentation
The promoted conversation SHALL render completed assistant message content as safe, responsive GitHub Flavored Markdown while preserving the backend text string as transcript truth.

#### Scenario: Completed assistant response contains Markdown
- **WHEN** a completed assistant message contains supported emphasis, headings, lists, links, blockquotes, inline code, fenced code, strikethrough, task lists, or a GFM table
- **THEN** the conversation renders the corresponding semantic content instead of displaying the Markdown delimiters as plain text
- **AND** persisted and newly submitted messages use the same presentation

#### Scenario: User message contains Markdown delimiters
- **WHEN** a user message contains Markdown syntax
- **THEN** the conversation renders the user message as literal pre-wrapped text
- **AND** it does not interpret the message as formatted Markdown

#### Scenario: Assistant response is progressively revealed
- **WHEN** a completed assistant response is still undergoing the existing bounded visual reveal
- **THEN** the visible response remains pre-wrapped plain text until the reveal completes
- **AND** assistive technology retains access to the complete response without repeated partial announcements
- **AND** the completed response switches once to semantic Markdown after reveal state clears

#### Scenario: Assistant Markdown contains unsafe or unsupported content
- **WHEN** assistant content contains raw HTML, executable markup, MDX, or a Markdown image
- **THEN** the conversation does not render executable HTML or the remote image
- **AND** ordinary Markdown text remains readable

#### Scenario: Markdown content exceeds the message width
- **WHEN** a table, code block, long token, or other Markdown content is wider than the assistant message surface
- **THEN** overflow remains contained and horizontally scrollable within the relevant content block
- **AND** the conversation Popover and underlying page do not gain horizontal overflow

#### Scenario: Assistant Markdown contains headings and links
- **WHEN** rendered assistant content includes headings or links
- **THEN** headings remain below the surrounding application and overlay hierarchy
- **AND** links retain visible focus treatment and safe protocol handling
