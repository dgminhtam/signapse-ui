## Context

`/market-query` already exists as a protected, stateless workbench for one-shot grounded analysis. The first release solved the core API contract and rendering path, but the current screen still feels like a feature demo rather than an operator-focused analysis surface.

The latest UI/UX review surfaced five important issues that should be captured in this change:

- Vietnamese UI copy in the market-query route and related labels is corrupted by mojibake or inconsistent unaccented text.
- The route-level `CardHeader` and the inner workbench hero compete for the same orientation job.
- Completed results use too many equally weighted card-like surfaces, causing the answer, trust signals, evidence, events, and reasoning to visually compete.
- Evidence drill-down still uses legacy `news-articles` wording/routes in places where the product model has moved toward SourceDocument.
- The main workbench component has grown large enough that UI iteration is risky without local decomposition.

This change remains frontend-only. It must preserve the existing `POST /query` contract, the protected route, and Signapse conventions around Card shells, shadcn composition, professional Vietnamese UI copy, and explicit loading feedback.

## Goals / Non-Goals

**Goals:**

- Restore all market-query user-facing copy to readable, professional Vietnamese.
- Make the first-run experience faster by removing duplicated guidance and the competing inner hero.
- Ensure running, success, and failure states clearly identify the active submitted question.
- Prevent stale previous results from reading as the active answer during a new query.
- Flatten the completed-result layout so the answer, confidence, limitations, and evidence form the primary decision path.
- Keep key events and reasoning available but visually secondary to answer quality and evidence.
- Align evidence labels and internal drill-downs with the SourceDocument mental model.
- Keep permission-aware traceability informative without repeating noisy disabled controls.
- Split the large workbench into focused local feature components after the target layout is clear.
- Preserve narrow-layout reading order: composer, active query context, answer, trust signals, evidence, then lower-priority supporting detail.

**Non-Goals:**

- Changing `POST /query`, response schemas, or backend permissions.
- Adding query history, conversation threads, streaming, exports, or saved queries.
- Reworking the global visual system or editing shadcn primitives.
- Creating shared dashboard abstractions for market-query-only UI.
- Removing all metadata from power users; the goal is to demote internal-looking fallback metadata, not erase useful context.

## Decisions

### 1. Treat copy encoding as a first-class UX requirement

Market-query copy must be corrected before layout polish is evaluated. This includes the route shell, workbench copy, prompt examples, validation errors, toast messages, artifact/evidence labels, and sidebar/navigation strings that affect entry into this screen.

Why:
- Broken Vietnamese copy undermines trust more than spacing or card hierarchy.
- The repo requires professional Vietnamese UI text.

Alternatives considered:
- Leave copy cleanup for a separate pass.
- Rejected because the screen cannot be judged as production-grade while major labels are corrupted.

### 2. Keep the route CardHeader as the page orientation

The page-level `CardHeader` owns the title and description. The client workbench should begin with a query composer and concise examples, not a second H1-style hero with product-level badges and repeated description.

Why:
- The current nested hero forces users to parse two introductions before they can act.
- `/market-query` is an operator tool, so the primary action should appear quickly.

Alternatives considered:
- Keep both headers and shorten the copy.
- Rejected because the visual competition remains.
- Move all page orientation into the client workbench.
- Rejected because repo page conventions expect the route Card shell to own title and description.

### 3. Model the client surface around explicit run phases

The workbench distinguishes first-run idle, running, successful result, and error states. On submission, the UI immediately stops treating the previous briefing as the active result for the newly submitted question.

Why:
- Leaving the old result in place during a new request creates a trust problem.
- It is better to show a deliberate running state than to make users infer whether a result is stale.

Alternatives considered:
- Keep the old result visible and rely on button spinners.
- Rejected because it preserves ambiguity.
- Keep the old result visible behind a small loading badge.
- Rejected because the old briefing still dominates the viewport.

### 4. Preserve the latest successful result only as historical context after a failed resubmission

If a new query fails after a previous query succeeded, the failed attempt becomes the current state. The earlier briefing may remain available only as clearly labeled prior context.

Why:
- Operators may still need the last successful output while iterating.
- The UI must not imply that an old answer belongs to the failed question.

Alternatives considered:
- Discard the previous successful result immediately on failure.
- Rejected because it removes useful context.
- Keep the previous successful result unchanged with only a toast error.
- Rejected because it blurs current failure and prior success.

### 5. Flatten result surfaces instead of stacking many equal cards

The completed result should use one dominant answer surface, a lighter trust-signal rail or metadata cluster, an evidence list/table-like surface, and lower-emphasis supporting sections for key events and reasoning. Avoid wrapping every subsection in the same rounded border, padding, and shadow treatment.

Why:
- Equal-weight cards make everything look equally important.
- The current nested-card feeling increases visual work without adding information value.

Alternatives considered:
- Keep the current card stack but reduce copy.
- Rejected because visual competition remains.
- Remove all section boundaries.
- Rejected because evidence, trust signals, and reasoning still need clear grouping.

### 6. Reorder the briefing toward evidence-backed decision support

The completed result foregrounds the final answer, confidence, limitations, and evidence before lower-priority supporting material. Key events and reasoning remain available but should not outrank evidence in spatial prominence or reading order.

Why:
- The answer tells the operator the conclusion.
- Confidence and limitations tell them how much to trust it.
- Evidence tells them why they should trust it.
- Events and reasoning are useful but secondary to validation.

Alternatives considered:
- Keep the current section order and visual weight.
- Rejected because it gives equivalent emphasis to less central modules.

### 7. Align evidence navigation with SourceDocument

Evidence rows should use SourceDocument-oriented labels and internal routes when they refer to backend source-document artifacts. Legacy `news-articles` routes can remain only as compatibility plumbing if the current app still redirects there; the market-query UI should not make NEWS-only assumptions for all evidence.

Why:
- The product model has moved from article-centric wording toward SourceDocument.
- Market-query evidence can represent more than one artifact type.

Alternatives considered:
- Keep `/news-articles/{id}` as the only internal evidence route.
- Rejected because it keeps traceability coupled to legacy naming.
- Link every evidence item only to the original external URL.
- Rejected because internal drill-down remains valuable for authorized operators.

### 8. Replace repetitive disabled controls with compact permission cues

When users lack `event:read` or `source-document:read`, the UI preserves analytical metadata but avoids repeated disabled action buttons inside every evidence row. Use compact non-interactive cues or short supporting text instead.

Why:
- Repeated disabled buttons add noise without creating an actionable next step.
- Preserving metadata still respects the query output as readable analytical context.

Alternatives considered:
- Keep disabled buttons for every inaccessible action.
- Rejected because the list becomes visually heavy and repetitive.
- Hide related metadata entirely.
- Rejected because it removes analytical context.

### 9. Add explicit in-page announcement and focus strategy for result-state changes

The workbench should not rely on toast notifications alone. It should provide in-page state messaging and move attention predictably toward the updated result or error region through focus management, viewport positioning, or an equivalent announcement pattern.

Why:
- Toasts are transient and easy to miss on long pages.
- Keyboard and assistive-technology users need a stronger signal that state changed.

Alternatives considered:
- Keep toast-only signaling.
- Rejected because it does not reliably communicate where new content appeared.

### 10. Split the workbench after the target layout is defined

Keep state orchestration in the main workbench component, then extract presentational regions into local feature components such as composer, query state, answer/trust panel, evidence list, key event cards, and reasoning panel.

Why:
- The current file size makes visual refactors likely to touch unrelated behavior.
- Local extraction improves reviewability without prematurely creating shared abstractions.

Alternatives considered:
- Leave the file monolithic until more features are added.
- Rejected because the current UX work already needs multiple layout passes.
- Create shared dashboard components immediately.
- Rejected because these pieces are still market-query-specific.

### 11. Preserve mobile and narrow-layout decision order

On narrower viewports, the page should keep the composer, active query context, answer, confidence, limitations, and evidence ahead of lower-priority explanatory or supporting modules.

Why:
- Responsive stacking alone does not guarantee useful scan order.
- Operational tools need explicit above-the-fold priority on smaller screens.

Alternatives considered:
- Let the desktop order stack naturally.
- Rejected because decorative or secondary content may appear before decision-critical output.

## Risks / Trade-offs

- [Reducing guidance may hurt first-time discoverability] -> Keep one concise orientation path and one prompt-suggestion module.
- [Clearing stale results may make long requests feel emptier] -> Replace old content with a deliberate running state tied to the submitted question.
- [Showing the last successful result after a failed retry may still confuse some users] -> Label it explicitly as previous successful output and separate it visually from the current failure.
- [Flattening surfaces too aggressively may reduce grouping] -> Keep semantic sections and separators, but vary visual weight.
- [Demoting metadata may frustrate power users] -> Keep secondary metadata available outside the primary scan path.
- [SourceDocument routes may currently redirect through compatibility routes] -> Use SourceDocument wording in UI and isolate route compatibility behind small helpers.
- [Component extraction can create churn] -> Extract only local feature components with clear ownership.
- [Focus movement may feel jarring] -> Move attention only on major state changes and respect reduced-motion behavior.

## Migration Plan

1. Correct corrupted Vietnamese copy in market-query UI, labels, validation, toast, and related navigation strings.
2. Remove the competing inner hero and make the composer the first meaningful workbench region.
3. Preserve and clarify explicit run phases for idle, running, success, and failed resubmission.
4. Flatten completed-result surfaces and rebalance answer, trust signals, evidence, events, and reasoning.
5. Align evidence drill-down labels/routes with SourceDocument-oriented traceability.
6. Extract local presentational components after the target layout is stable.
7. Verify idle, running, completed, failed-resubmission, permission-restricted, and narrow-layout flows locally.

Rollback strategy:
- Revert the frontend files under `app/(main)/market-query/*`, related market-query labels, and navigation copy; no backend rollback or data migration is required.

## Open Questions

- Whether SourceDocument detail should use `/source-documents/{id}` directly or keep the current compatibility redirect during this change. The UI copy should still use SourceDocument wording either way.
