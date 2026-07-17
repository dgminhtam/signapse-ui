# News Article Markdown Rendering Specification

## Purpose

Define safe, readable Markdown rendering for canonical news article detail pages.

## Requirements

### Requirement: News article content renders supported Markdown

The system SHALL render the `content` field on `/news-articles/{id}` as CommonMark with GitHub Flavored Markdown extensions instead of displaying Markdown source markers as plain text.

#### Scenario: Article contains common Markdown structure

- **WHEN** an authorized user opens an article whose content contains paragraphs, emphasis, headings, links, blockquotes, lists, code, separators, or images
- **THEN** the detail page renders the corresponding semantic article elements in the original content order

#### Scenario: Article contains GitHub Flavored Markdown

- **WHEN** article content contains autolinks, strikethrough, a table, task list, or footnote syntax
- **THEN** the detail page renders the corresponding GitHub Flavored Markdown structure

#### Scenario: Article content is missing

- **WHEN** the detail response has no non-blank content
- **THEN** the page renders the existing localized empty-content fallback instead of an empty Markdown surface

### Requirement: Markdown rendering is non-executable

The system SHALL treat news article Markdown as untrusted presentation content and SHALL NOT execute embedded HTML, JavaScript, MDX, or JSX.

#### Scenario: Content contains raw HTML

- **WHEN** article Markdown includes raw HTML elements or attributes
- **THEN** the renderer omits the raw HTML rather than adding it to the article DOM

#### Scenario: Content contains an unsafe URL protocol

- **WHEN** a Markdown link or image uses an executable or unsupported URL protocol
- **THEN** the renderer does not expose that value as a usable destination

#### Scenario: Markdown rendering implementation is inspected

- **WHEN** the news article Markdown pipeline is reviewed
- **THEN** it contains no `dangerouslySetInnerHTML`, raw-HTML plugin, or client-side code execution boundary

### Requirement: Rendered Markdown preserves the page reading hierarchy

The system SHALL keep the article title as the page-level heading and render Markdown body structure beneath it with semantic, reader-friendly ordering.

#### Scenario: Markdown contains a level-one heading

- **WHEN** the article body begins with or contains a Markdown level-one heading
- **THEN** that heading renders below the page title hierarchy without creating a competing page-level `h1`

#### Scenario: Markdown contains a thematic break

- **WHEN** the article body contains thematic-break syntax
- **THEN** the reading surface renders the existing shadcn separator treatment at that position

#### Scenario: Markdown contains an inline image

- **WHEN** article content contains a Markdown image with safe source and alt text
- **THEN** the image remains within the article measure and exposes the provided alternative text

### Requirement: Rendered Markdown remains readable across themes and viewports

The system SHALL apply shadcn Typeset typography to article Markdown while preserving the existing editorial width, application theme tokens, and responsive reading behavior.

#### Scenario: User reads structured content

- **WHEN** headings, paragraphs, lists, blockquotes, code, and links render in the article body
- **THEN** they use a consistent long-form type rhythm and colors derived from the active application theme

#### Scenario: Narrow viewport contains a wide table

- **WHEN** rendered Markdown includes a table wider than the available article measure
- **THEN** the table can scroll horizontally within its own region without causing page-level horizontal overflow

#### Scenario: Theme changes

- **WHEN** the application switches between supported light and dark themes
- **THEN** rendered Markdown follows existing semantic theme tokens without a separate hard-coded palette
