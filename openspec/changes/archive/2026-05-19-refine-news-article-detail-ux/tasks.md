## 1. Remove Manual Analyze UI

- [x] 1.1 Remove `NewsArticleAnalyzeButton` imports and rendering from the news article list row actions.
- [x] 1.2 Remove `NewsArticleAnalyzeButton` imports and rendering from the news article detail header.
- [x] 1.3 Delete `news-article-analyze-button.tsx` after confirming no remaining imports.
- [x] 1.4 Remove the unused `analyzeNewsArticle` server action and related import from `app/api/news-articles/action.ts`.

## 2. Refine Detail Information Hierarchy

- [x] 2.1 Reduce the detail header to the article title, status, outlet, published time, original link access, and a focused action group.
- [x] 2.2 Reduce the visible summary cards to fields that materially help review the article.
- [x] 2.3 Move technical fields such as `externalKey`, `newsOutletId`, raw URL, created date, and last modified date into a lower-priority technical information section.
- [x] 2.4 Adjust feature image placement so it supports article recognition without pushing the main review content too far down the page.

## 3. Prioritize Linked Event Review

- [x] 3.1 Move linked event summaries closer to the article description/content and before low-priority technical metadata.
- [x] 3.2 Keep event badges, confidence, evidence role, event link, and evidence note visible only where they help validate the mapping.
- [x] 3.3 Preserve the existing empty state behavior when an article has no linked events.

## 4. Copy And Documentation

- [x] 4.1 Update touched `news-articles` UI copy to professional Vietnamese with proper diacritics.
- [x] 4.2 Update touched toast/error copy for remaining news article actions to professional Vietnamese with proper diacritics.
- [x] 4.3 Update `docs/APIMAPPING.md` to state that `POST /news-articles/{id}/analyze` is no longer used by the UI and analysis is handled by cronjob workflow.

## 5. Verification

- [ ] 5.1 Run `pnpm run typecheck`. Ran and currently blocked by unrelated `graph-view` dependency/type errors.
- [x] 5.2 Run targeted ESLint for changed `news-articles` files.
- [x] 5.3 Manually inspect the detail page to confirm the primary reading path is article summary, content, linked events, then technical metadata.
