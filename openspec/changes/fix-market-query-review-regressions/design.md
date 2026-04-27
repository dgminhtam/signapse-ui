## Context

`/market-query` is already implemented as a protected, stateless analysis workbench. A previous refinement split the original large client component into local feature components and improved several interaction states, but the current UI still contains corrupted Vietnamese strings and needs another focused pass against the latest review findings.

The change is frontend-only. It must preserve the existing `POST /query` action, permission checks for event and SourceDocument drill-down, the route Card shell convention, and the current local component approach under `app/(main)/market-query/`.

## Goals / Non-Goals

**Goals:**

- Remove all visible mojibake and non-professional mixed-language copy from the market-query experience.
- Keep page orientation in the route-level `CardHeader` and let the workbench start with the query composer.
- Make the completed-result layout feel flatter and more decision-oriented, with answer and evidence clearly outranking supporting metadata.
- Use SourceDocument-oriented evidence labels and internal links.
- Keep local component boundaries easy to review and avoid re-growing a monolithic workbench file.
- Verify the current review findings directly after implementation.

**Non-Goals:**

- Changing backend APIs, DTOs, permissions, or `POST /query` behavior.
- Adding history, chat threads, streaming, saved queries, exports, or manual evidence management.
- Reworking global layout, theme tokens, shadcn primitives, or shared table/card abstractions.
- Creating a broad market-query design system beyond the focused local components needed for this screen.

## Decisions

### 1. Treat mojibake as a blocking production defect

Implementation should start by replacing corrupted strings across market-query files and related navigation/action feedback. Layout polish is not considered complete while title, empty state, toast, accessibility announcement, or action labels are unreadable.

Alternative considered: fix only the strings visible in the initial viewport. Rejected because result, error, and permission states are part of the same operator workflow and can still break trust.

### 2. Preserve the route CardHeader as the only orientation header

The server page owns title and description. The client workbench should not reintroduce a hero, second page title, or large marketing-style intro. The first meaningful region in the client component should remain the composer plus compact prompt guidance.

Alternative considered: keep a smaller inner hero. Rejected because it still competes with the route shell and delays the input.

### 3. Flatten by visual weight, not by removing structure

The answer can remain the dominant section, while trust signals should become a lighter rail/cluster and evidence should read like a list surface. Key events and reasoning remain available but must not use the same visual weight as the conclusion and evidence path.

Alternative considered: remove all borders and section boundaries. Rejected because operators still need clear grouping for evidence, confidence, and reasoning.

### 4. Centralize SourceDocument evidence routing behind helpers

Evidence UI should use SourceDocument labels and links for source artifacts. Any compatibility logic should stay inside a small helper such as `getSourceDocumentHref()` rather than scattered row-level conditionals or legacy `news-articles` wording.

Alternative considered: leave legacy `NEWS_ARTICLE` assumptions in row rendering. Rejected because the product model has moved to SourceDocument and evidence can represent more than news articles.

### 5. Keep extraction local and review-driven

The current component split is the right direction. Further extraction should only happen where it directly reduces review risk for these findings, such as isolating copy-heavy sections or evidence routing. Do not introduce shared abstractions until another screen needs them.

Alternative considered: create generic dashboard answer/evidence panels. Rejected because the market-query surface is still stabilizing and shared abstractions would add churn.

## Risks / Trade-offs

- [Copy fixes can miss hidden states] -> Search market-query, query action, and navigation files for common mojibake markers and verify idle, running, success, error, empty, and permission-restricted states.
- [Flattening can make sections feel under-grouped] -> Keep semantic section headings and separators while reducing equal-weight card chrome.
- [SourceDocument routing may still rely on compatibility routes] -> Keep route generation centralized so future route changes are surgical.
- [Component cleanup can expand scope] -> Limit edits to files directly involved in market-query rendering, labels, and traceability.
