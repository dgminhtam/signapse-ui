# news-article-detail-action-media-composition Specification

## Purpose
TBD - created by archiving change refine-news-article-detail-actions-and-media-layout. Update Purpose after archive.

## Requirements

### Requirement: Summary and article image follow the reading flow
The news article detail page SHALL render the summary as an unlabeled standfirst and the feature image as a wide hero surface before the article body.

#### Scenario: Article has summary and image
- **WHEN** an authorized user opens an article with both summary and feature image
- **THEN** the summary appears above the image in a single-column flow without equal-height cards

#### Scenario: Article has only one optional region
- **WHEN** an article has only a summary or only a feature image
- **THEN** the available region renders without an empty companion column or redundant section label

### Requirement: Summary layout remains responsive
The news article detail page SHALL keep summary, feature image, and body content in the same single-column reading order at desktop and narrow viewport widths.

#### Scenario: Mobile viewport renders article
- **WHEN** an authorized user views the detail page on a narrow viewport
- **THEN** summary, image, and body remain stacked without horizontal scrolling

#### Scenario: Desktop viewport renders article
- **WHEN** an authorized user views the detail page on a desktop viewport
- **THEN** the page does not switch the summary and image into side-by-side columns

### Requirement: Loading skeleton mirrors action and media composition
The news article detail loading skeleton SHALL mirror the reader-oriented action and media composition.

#### Scenario: Detail page is loading
- **WHEN** news article detail data is suspended
- **THEN** the skeleton reserves a provenance row, single-column summary/media regions, readable body region, and at most one compact administrative action placeholder

#### Scenario: Loaded page replaces skeleton
- **WHEN** the suspended detail data resolves
- **THEN** the loaded page does not introduce a primary derivation action, reload action, or balanced two-column media row
