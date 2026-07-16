## Context

The detail route currently uses the shared cardless workspace, but its internal composition still reflects an administrative review screen. The description and image are presented as labeled, height-balanced columns, long-form text is small and wide, and original-source access is hidden in an action menu. Earlier archived specifications also mandate operational elements that have since been removed from the desired product surface.

The page is desktop-dominant but must remain readable on narrow viewports, use existing localization and navigation helpers, preserve the destructive confirmation flow, and avoid new dependencies or shared abstractions.

## Goals / Non-Goals

**Goals:**

- Establish one calm editorial reading order: title, provenance, summary, feature image, and body.
- Keep prose within a readable desktop measure and use body typography appropriate for sustained reading.
- Remove redundant labels, borders, and height balancing that make the article feel like dashboard data.
- Make original-source access visible near provenance metadata and keep destructive administration secondary.
- Keep the loading skeleton structurally aligned with the simplified page.
- Align existing OpenSpec requirements with the reader-first product direction.

**Non-Goals:**

- Changing API payloads, permissions, article ingestion, content normalization, or backend workflows.
- Redesigning the news article list, breadcrumbs, sidebar, global assistant, or workspace header.
- Adding rich-text rendering, sanitization, an image library, or new responsive breakpoints.
- Reintroducing linked-event, derivation, reload, processing-status, or technical metadata UI.

## Decisions

### Use a centered editorial shell with a narrower prose column

The detail content will use a centered shell no wider than the existing `max-w-5xl` scale. Headline and media may use most of that shell, while summary and body prose will use a narrower measure around 72 characters. Body copy will use base text sizing and relaxed line height.

This keeps the page consistent with the existing workspace while preventing the article from spanning the full desktop canvas. A full-width layout was rejected because the screenshot demonstrates excessive line length; a new shared reader component was rejected because only one route currently needs it.

### Use one reading flow at every viewport width

The description will become an unlabeled standfirst below provenance, followed by the feature image and then the article body. The desktop-only description/image grid, equal-height surfaces, and their section headings will be removed. The article body will no longer be wrapped in a dashboard-style bordered card.

A responsive two-column summary was rejected because it gives short descriptions large empty surfaces and makes the image secondary. The single flow also reduces breakpoint-specific behavior.

### Separate reader actions from administrative actions

The original-article link will move into the provenance row beside outlet and publication time. The compact overflow menu will retain only destructive administration and will render only when the user has permission to use it. The existing delete confirmation remains unchanged.

Keeping the source link inside the overflow menu was rejected because opening the source is part of reading and verification, not administration.

### Preserve stable image and loading behavior with existing primitives

The existing image URL selection and accessible fallback alt text will remain. The image will become a wide hero surface within the editorial shell using the existing stable aspect treatment. The Suspense fallback will reserve matching regions for headline/provenance, summary when represented in the standard shape, hero media, body content, and the optional administrative menu.

No new image component or dependency will be introduced because the current remote image behavior already works and the change is compositional.

## Risks / Trade-offs

- **Some source content may contain no paragraph breaks** → Preserve backend whitespace exactly; treat content normalization as a separate data-quality concern.
- **A fixed readable measure leaves more whitespace on large monitors** → Accept the whitespace because sustained reading and line tracking are the primary task.
- **Wide hero treatment may crop unusual source images** → Retain meaningful alt text and the existing stable aspect behavior; revisit object fitting only if real article samples show harmful cropping.
- **Removing operational detail reduces in-page diagnostics** → Keep those workflows outside this reading route; original-source access and delete confirmation remain available.
- **Existing archived specs conflict with the new direction** → Include explicit modified and removed requirement deltas for every affected capability.
