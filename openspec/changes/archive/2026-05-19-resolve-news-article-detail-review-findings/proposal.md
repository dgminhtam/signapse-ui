## Why

The news article detail screen still does not fully support the operator's core review task: quickly confirm where they are, understand the article, and validate the linked event. Recent review findings show that route identity, first-viewport hierarchy, reading width, and loading skeletons are drifting from the intended Signapse admin patterns.

## What Changes

- Align the `/news-articles` navigation label and breadcrumb label so the screen has one clear product identity.
- Reorder the detail page reading path so linked event review appears before long-form article content.
- Remove duplicated first-viewport metadata cards when status, outlet, and published time are already visible in the header.
- Constrain long article content to a readable measure on desktop while preserving responsive behavior on small screens.
- Update the detail skeleton so it mirrors the final header/action/image/content layout without extra placeholder chrome.
- Keep existing valid actions: derive primary event, reload content, open original link, and delete with confirmation.

## Capabilities

### New Capabilities

- `news-article-detail-review-alignment`: Defines the review-oriented detail experience for news articles, including route identity, information hierarchy, linked event placement, readable article content, and matching loading skeletons.

### Modified Capabilities

- None.

## Impact

- Affects `config/site.ts` navigation copy and `components/app-breadcrumbs.tsx` breadcrumb copy for `/news-articles`.
- Affects `app/(main)/news-articles/[id]/page.tsx` layout, section ordering, metadata treatment, content width, and skeleton.
- Does not require backend API changes, dependency changes, or permission model changes.
- Related to the active `refine-news-article-detail-ux` change, but scoped specifically to the new review findings.
