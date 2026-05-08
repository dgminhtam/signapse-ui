## Context

The `/news-articles/[id]` page is a protected admin detail route for reviewing a news article and its linked event evidence. The current implementation already removed the old manual analyze action and uses a cardless workspace, but the latest screen review found five UX regressions: route identity differs between sidebar and breadcrumb, linked event validation appears below long article content, core metadata is repeated in the first viewport, long text spans too wide on desktop, and the skeleton does not mirror the final header/action layout.

This change should be treated as a surgical follow-up to the active `refine-news-article-detail-ux` work. It tightens the review flow without changing backend contracts, permissions, or mutation behavior.

## Goals / Non-Goals

**Goals:**

- Make the `/news-articles` route identity consistent across sidebar and breadcrumb.
- Put article-event validation before long-form content so the main operator task is visible early.
- Reduce first-viewport repetition by keeping status, outlet, and published time in one primary header location.
- Improve desktop readability for long article content without harming mobile responsiveness.
- Make the loading skeleton preserve the same structural rhythm as the loaded detail page.

**Non-Goals:**

- Do not rename routes, API endpoints, permissions, or backend DTO fields.
- Do not add new filters, tabs, dialogs, or article editing workflows.
- Do not redesign the full `news-articles` list page.
- Do not introduce new global theme tokens or modify shadcn primitives in `components/ui`.

## Decisions

- Use one product label for `/news-articles` across navigation and breadcrumbs. The implementation should choose the canonical language already aligned with current backend/domain direction, then update only the route label sources that create the visible mismatch.

- Keep the detail header as the single source for status, outlet, and published time. The duplicate card row should be removed unless a card contains non-redundant review data. This preserves density and follows the repo rule against repeating page identity or obvious metadata.

- Render the top detail body as a review summary area: optional description and image preview first, linked events immediately after, then long-form article content. This supports the task order operators actually perform: identify article, validate mapping, then read deeper if needed.

- Keep the feature image as supporting recognition media, not a dominant hero. It may stay in a secondary column on desktop and stack after description on smaller screens.

- Constrain the article content measure on large viewports. The content surface can remain full responsive width on mobile, but text should use a readable max width or a dedicated reading column on desktop so paragraph lines do not stretch across the whole workspace.

- Use the existing shadcn primitives and app-level surfaces. Do not change `components/ui`; compose with local layout, `Badge`, `Button`, `Skeleton`, and existing action components.

- Mirror the final layout in the skeleton. The fallback should reserve space for the header text and action group, the description/image arrangement, linked event area, content area, and technical information trigger, without rendering placeholder labels that do not exist in the final UI.

## Risks / Trade-offs

- Route naming may be politically ambiguous while older OpenSpec changes still mention source documents. Mitigation: choose one visible label for the current route and keep the change limited to copy sources, not route renames.
- Moving linked events above content may push the full article text lower. Mitigation: linked event cards should stay compact and only show evidence fields that help validate the mapping.
- Removing summary cards may reduce quick glance redundancy for some users. Mitigation: keep the same facts in the header and preserve low-priority technical details in the existing technical section.
- Constraining text width can create unused space on very wide screens. Mitigation: let supporting sections use the available grid while limiting only the long-form reading measure.
