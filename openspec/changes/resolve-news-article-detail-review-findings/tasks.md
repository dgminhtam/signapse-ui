## 1. Route Identity

- [x] 1.1 Choose the canonical Vietnamese label for `/news-articles` based on the current product/domain direction.
- [x] 1.2 Update sidebar navigation copy and breadcrumb copy so `/news-articles` uses one consistent label.
- [x] 1.3 Check the list and detail routes visually or by code review to confirm the sidebar active item and breadcrumb parent no longer disagree.

## 2. Detail Hierarchy

- [x] 2.1 Refactor `app/(main)/news-articles/[id]/page.tsx` so the header remains the single primary location for article status, outlet, and published time.
- [x] 2.2 Remove or replace the duplicate first-viewport metadata cards with only non-redundant review information, if any is still needed.
- [x] 2.3 Move the linked event section above the long-form article content, preserving both linked-event cards and the existing empty state.
- [x] 2.4 Keep the feature image as supporting recognition media near the article summary without turning it into a dominant hero or pushing linked events too far down.

## 3. Reading And Loading Polish

- [x] 3.1 Constrain the long-form article content to a readable desktop measure while keeping narrow viewport behavior responsive and free of horizontal overflow.
- [x] 3.2 Update `NewsArticleDetailSkeleton` to reserve space for the final header, action group, summary/media area, linked event area, content area, and technical information trigger.
- [x] 3.3 Remove skeleton-only placeholder labels or shapes that do not exist in the final loaded UI.

## 4. Verification

- [x] 4.1 Run a targeted lint check for touched news article and navigation files.
- [x] 4.2 Run the project typecheck, or document unrelated blockers if existing type errors prevent completion.
- [ ] 4.3 Manually inspect `/news-articles/{id}` at desktop and mobile widths to confirm the reading order is summary, linked events, content, then technical information.
- [x] 4.4 Confirm destructive delete behavior, derive event, reload content, and original-link actions are still present and unchanged.
