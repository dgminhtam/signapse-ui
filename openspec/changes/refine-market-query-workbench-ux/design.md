## Context

`/market-query` already exists as a protected, stateless workbench for one-shot grounded analysis. The first release solved the core contract and rendering path, but the current UI still carries onboarding copy, helper panels, and permission feedback that were useful while shaping the feature and are now competing with the actual analysis result.

The review surfaced three concrete operator-experience problems:

- the page repeats the same guidance in the route description, hero copy, side panel, and empty state
- running a second query leaves the previous briefing visible until the new response arrives, which can misrepresent which question the user is currently executing
- some secondary metadata and disabled permission controls occupy more visual weight than the answer and evidence that operators most need to verify

Follow-up review with a UI/UX audit lens highlighted several adjacent gaps that should be resolved in the same pass:

- the UI does not yet define how the active question stays visible across running, success, and failure states
- a failed resubmission after a successful query needs an explicit rule so operators do not confuse "current run failed" with "current result is still valid"
- toast-only completion and error feedback is weak for a tall, dense workbench where the user's reading position may be far from the newly changed content
- responsive behavior should intentionally preserve composer, active query context, answer, and trust signals before lower-priority supporting detail

This change builds on the existing `add-market-query-workbench` work without changing the backend API, route, or permission model. The work is frontend-only and must stay aligned with repo conventions around Card shells, shadcn composition, Vietnamese copy, and explicit loading feedback.

## Goals / Non-Goals

**Goals:**
- Make the workbench faster to understand on first open by removing duplicated guidance and prompt modules.
- Ensure the running state for a new query is unambiguous and never reuses stale briefing content as if it belonged to the new question.
- Keep the active query visible and legible through running, success, and failure transitions.
- Rebalance the information hierarchy so operators can scan answer quality and supporting evidence before static explanations or debug-like metadata.
- Keep permission-aware traceability useful without repeating disabled actions across every evidence item.
- Improve in-page completion and error visibility for keyboard, screen-reader, and long-page usage.
- Preserve the primary decision path on narrower layouts by keeping the composer, current query context, answer, and trust signals above lower-priority material.
- Preserve the route's stateless, one-shot nature and existing backend contract.

**Non-Goals:**
- Adding query history, conversation threads, exports, or streaming results.
- Changing `POST /query`, the result schema, or backend permission semantics.
- Introducing a new route or navigation pattern for market analysis.
- Hiding all low-level metadata from power users; the goal is to demote it from the primary scan path, not erase it entirely.

## Decisions

### 1. Model the client surface around explicit run phases
The workbench will distinguish between at least three user-visible phases: first-run idle, query in progress, and latest completed result. On submission, the UI will immediately transition away from treating the previous result as the active answer for the newly entered question.

Why:
- The current "leave old result in place until new data returns" behavior creates a trust problem.
- A workbench can tolerate temporary emptiness during a run more easily than it can tolerate ambiguity about which result belongs to which query.

Alternatives considered:
- Keep the current result visible and rely on button spinners alone.
- Rejected because it preserves the ambiguity that triggered the review finding.
- Keep the old result visible behind a small loading badge.
- Rejected because the old briefing still dominates the viewport and reads as current output.

### 2. Preserve the latest successful result only as historical context after a failed resubmission
If a new query fails after a previous query succeeded, the UI will surface the failed attempt as the current state and may retain the last successful result only as clearly labeled prior context. The earlier briefing must not appear as though it answers the failed question.

Why:
- Operators often retry adjacent questions and still need the last successful output for reference.
- Throwing away the last successful briefing entirely would reduce usefulness, but leaving it visually primary would blur state ownership.

Alternatives considered:
- Discard the previous successful result immediately on failure.
- Rejected because it removes still-useful analytical context during iterative work.
- Keep the previous successful result unchanged and rely on a toast or inline error message.
- Rejected because it preserves the ambiguity between current run status and last successful output.

### 3. Consolidate guidance into one primary entry path
The route will keep a concise page description and one primary first-run guidance surface. Example prompts should appear once in the initial experience, not in multiple stacked modules. After a result exists, helper space should shift to contextual query metadata or disappear entirely.

Why:
- Operators need to act quickly; repeated explanatory copy slows the first action without improving comprehension proportionally.
- Prompt suggestions are valuable, but duplication makes the page feel longer and noisier than necessary.

Alternatives considered:
- Preserve the current hero, side panel, and lower empty state together.
- Rejected because they restate the same product story with little incremental value.
- Remove all guidance and show only a textarea.
- Rejected because the feature still benefits from one concise orientation block and example prompts.

### 4. Keep active query context visible throughout the workbench state transitions
The running state, completed-result view, and error view will all keep a clear textual reference to the query they apply to. The page should never make the operator infer which question the visible status belongs to.

Why:
- In a one-shot workbench, the question is the anchor for interpreting every subsequent state.
- This becomes even more important once duplicated onboarding copy is removed.

Alternatives considered:
- Show the query only inside the textarea value.
- Rejected because the user may edit the textarea while inspecting a prior or in-flight result, which breaks the state association.

### 5. Reorder the briefing toward evidence-backed decision support
The completed result should foreground the final answer, confidence, limitations, and evidence before lower-priority supporting material. `Sự kiện trọng yếu` and `Quá trình tổng hợp` remain available, but they should not outrank evidence in either spatial prominence or reading order.

Why:
- The answer tells the operator the conclusion.
- Confidence and limitations tell them how much to trust it.
- Evidence tells them why they should trust it.
- Events and reasoning remain useful, but they are secondary to validation.

Alternatives considered:
- Keep the current section ordering.
- Rejected because it gives equivalent or greater emphasis to panels that are less central to operator verification.

### 6. Replace repetitive disabled controls with compact permission cues
When users lack `event:read` or `source-document:read`, the UI should preserve analytical metadata but avoid rendering repeated disabled buttons inside each evidence row. Instead, it should use compact non-interactive cues or short supporting text that explains why the drill-down is unavailable.

Why:
- Repeated disabled buttons add noise without creating an actionable next step.
- Preserving the metadata still respects the decision that query output itself is readable to authorized market-query users.

Alternatives considered:
- Keep disabled buttons for every inaccessible action.
- Rejected because the list becomes visually heavy and repetitive.
- Hide the related metadata entirely.
- Rejected because it removes analytical context that belongs to the query output.

### 7. Demote raw internal-looking metadata from primary labels
Raw IDs, slugs, or other fallback values may still appear when the backend lacks richer labels, but they should not occupy primary headline space unless they are the only usable identifier. When used, they should be rendered as subdued fallback metadata rather than the main takeaway of a card.

Why:
- Operators scan for semantic meaning first, not internal identifiers.
- Internal-looking fallback text is sometimes necessary, but it should feel like a fallback.

Alternatives considered:
- Continue showing raw fallback values as primary titles or primary chip sets.
- Rejected because it makes the page feel more diagnostic than operational.

### 8. Add explicit in-page announcement and focus strategy for result-state changes
The workbench will not rely on toast notifications alone to communicate completion or failure. It should provide in-page state messaging and move the user's attention predictably toward the updated result or error region through focus management, viewport positioning, or another deliberate announcement pattern.

Why:
- Toasts are transient and easy to miss on long pages.
- Keyboard and assistive-technology users need a stronger signal that the state changed.

Alternatives considered:
- Keep current toast-only signaling.
- Rejected because it does not reliably communicate where new content appeared or which state changed.

### 9. Preserve a mobile and narrow-layout reading order that keeps the decision path first
On narrower viewports, the page should keep the composer, active query context, answer, confidence, limitations, and evidence ahead of lower-priority explanatory or supporting modules. The layout may stack, but the reading order must remain intentional.

Why:
- Responsive collapse alone does not guarantee useful scan order.
- Operational tools still need an explicit above-the-fold priority on smaller screens.

Alternatives considered:
- Let the existing desktop section order stack naturally on smaller screens.
- Rejected because the resulting order may preserve decorative or explanatory content ahead of the most decision-relevant output.

## Risks / Trade-offs

- [Reducing guidance may hurt discoverability for first-time users] -> Keep one concise orientation block and a single prompt-suggestion module.
- [Clearing stale results may make the page feel briefly emptier during long requests] -> Replace old content with a deliberate running state tied to the submitted question so the empty interval still feels informative.
- [Showing the last successful result after a failed retry may still confuse some users] -> Label it explicitly as previous successful output and separate it visually from the current failure state.
- [Demoting metadata may frustrate power users who want every field visible] -> Keep secondary metadata available, but move it out of the primary scan path.
- [Changing section order may surprise users familiar with the current page] -> Preserve section labels and overall workbench structure while improving emphasis rather than redesigning the route from scratch.
- [Extra focus movement may feel jarring] -> Move attention only to major state changes and keep the motion or jump bounded to the relevant result or error region.

## Migration Plan

1. Update the client state model in `market-query-workbench.tsx` so resubmission has an explicit running state.
2. Define how failed resubmissions preserve prior successful context without mislabeling it as the current answer.
3. Simplify duplicated guidance and empty-state content while preserving one first-run prompt module.
4. Rebalance completed-result layout and permission-aware evidence affordances.
5. Add explicit result and error announcement behavior and verify narrow-layout reading order.
6. Verify idle, running, completed, failed-resubmission, and permission-restricted flows locally.

Rollback strategy:
- Revert the route-level UI changes in `app/(main)/market-query/*`; no backend rollback or data migration is required.

## Open Questions

- None at the moment; the review findings are specific enough to translate directly into implementation tasks.
