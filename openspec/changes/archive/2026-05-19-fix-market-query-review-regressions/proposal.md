## Why

The market-query workbench still shows review regressions after the previous refinement pass, most visibly corrupted Vietnamese copy in the active UI. This change hardens the screen against the current UI/UX findings so the operator workflow reads as production-ready, SourceDocument-aligned, and safe to iterate further.

## What Changes

- Fix all mojibake, unaccented, or mixed-language user-facing copy in the market-query route, supporting market-query components, query action feedback, and related navigation labels.
- Verify the route-level `CardHeader` remains the only page orientation layer and remove any residual inner hero/title treatment that competes with the query composer.
- Rebalance completed-result surfaces so the final answer and evidence path are visually primary, while confidence, assets, limitations, key events, and reasoning use lighter secondary treatments.
- Align evidence labels and internal navigation with the SourceDocument model instead of legacy `news-articles` or NEWS-only assumptions.
- Keep the current component split, then finish any remaining decomposition or cleanup only where it reduces risk for the review findings.
- Preserve existing backend API contracts, permissions, and stateless query behavior.
- Do not add query history, streaming, saved prompts, exports, or broad visual-system changes.

## Capabilities

### New Capabilities

- `market-query-review-hardening`: Covers regression fixes and acceptance criteria for professional Vietnamese copy, flattened result hierarchy, SourceDocument-oriented evidence traceability, and maintainable local component structure on the market-query workbench.

### Modified Capabilities

- None.

## Impact

- Affected UI under `app/(main)/market-query/*`.
- Affected market-query helper copy and formatting under `app/lib/market-query/*` and `app/api/query/action.ts` if they surface text to users.
- Affected navigation/sidebar labels in `config/site.ts` if market-query entry text remains corrupted or inconsistent.
- No backend endpoint, DTO, permission, dependency, or data migration changes.
