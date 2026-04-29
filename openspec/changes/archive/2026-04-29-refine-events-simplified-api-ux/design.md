## Context

The event screens were introduced when the frontend still modeled events with separate event lifecycle and enrichment lifecycle fields. The latest backend snapshot now exposes a smaller event contract:

- `EventListResponse`: `id`, `title`, `slug`, `canonicalKey`, `description`, `status`, `confidence`, `occurredAt`, `confirmedAt`, `createdDate`, `lastModifiedDate`
- `EventResponse`: the list fields plus `assets`, `themes`, and `evidence`
- `EventEnrichmentResult.outcome`: `ENRICHMENT_PENDING`, `ENRICHED`, `ENRICHMENT_NO_MATCH`, `ENRICHMENT_FAILED`, `ARCHIVED`

The current UI still renders `summary`, `active`, `enrichmentStatus`, enrichment timestamps, and an enrichment error section. Those fields no longer exist in the simplified contract, so the page now risks showing empty, stale, or misleading information.

The audience is an operator or analyst using a Signapse admin dashboard. Their main task is to quickly understand what happened, whether enrichment succeeded, which assets/themes were linked, and what evidence supports the event. They should not have to scan implementation metadata before seeing the event's source evidence.

## Goals / Non-Goals

**Goals:**

- Align event DTOs, labels, and operator result helpers with the simplified backend event contract.
- Make `/events` list optimized for quick scanning: event title, description, single status, occurred time, confidence, and detail action.
- Make `/events/{id}` prioritize event meaning and evidence above technical identifiers.
- Remove obsolete UI sections tied to fields that no longer exist in the backend snapshot.
- Keep event enrichment actions available, but update their result handling and copy to the new outcome enum.
- Add a reusable `AGENTS.md` rule so future simplified backend features follow the same hierarchy principle.
- Keep the implementation within existing shadcn composition and Signapse list/detail conventions.

**Non-Goals:**

- Add event create, edit, archive, or delete flows.
- Add a new analytics dashboard or charting layer for events.
- Introduce a custom design system or modify `components/ui`.
- Add advanced event filters beyond the existing search, sort, pagination, and backend query conventions.
- Change backend permissions, endpoint names, or request semantics.

## Decisions

### 1. Use `status` as the only visible event lifecycle indicator

The UI will replace the old combination of event status, enrichment status, and active flag with one badge driven by `status`.

Why:
- Backend now folds the relevant enrichment lifecycle into `status`.
- A single status reduces badge clutter and makes row scanning faster.

Alternatives considered:
- Keep a placeholder enrichment badge when enrichment fields are missing.
- Rejected because it preserves the shape of the old contract and trains users to read nonexistent state.

### 2. Treat `description` as the event summary everywhere

The frontend will rename the displayed short text from `summary` to `description` in DTOs and components.

Why:
- This matches the backend field name.
- The UI's job is still to show a short explanatory sentence under the event title, so no extra display concept is needed.

Alternatives considered:
- Keep a local `summary` alias after parsing.
- Rejected because it hides contract drift and makes future API mapping harder to audit.

### 3. Put evidence before assets and themes on detail

The detail page will present the event header, core facts, and description first, then evidence, then assets, then themes, then technical details.

Why:
- Evidence answers "why should I trust this event?" and is the highest-value operator content.
- Assets and themes explain classification and impact after trust is established.
- Technical metadata is useful for debugging but does not deserve the primary reading path.

Alternatives considered:
- Keep assets and themes before evidence.
- Rejected because the simplified event page should support verification before classification review.

### 4. Move identifiers and audit timestamps into a technical details area

`id`, `slug`, `canonicalKey`, `createdDate`, and `lastModifiedDate` will be shown in a lower-priority collapsible or compact technical section.

Why:
- These fields help debugging and support, but they are not the main user decision.
- This keeps above-the-fold content focused on event meaning, status, confidence, and evidence access.

Alternatives considered:
- Remove technical metadata entirely.
- Rejected because operators and developers still need traceability during investigation.

### 5. Capture the simplified-surface rule in `AGENTS.md`

`AGENTS.md` will gain a rule for backend-simplified feature surfaces: remove obsolete UI fields, elevate remaining user-relevant fields, and avoid preserving sections only because the previous schema had them.

Why:
- The same pattern has already appeared across source/news article/event migrations.
- A repo-wide rule makes future Codex work more consistent without requiring a new skill lookup every time.

Alternatives considered:
- Keep this guidance only in the OpenSpec change.
- Rejected because the user explicitly wants future screens to follow the concept, and `AGENTS.md` is the active repo-wide guidance file.

## Risks / Trade-offs

- [Operators may miss technical identifiers that were previously visible near the top] -> Keep them available in a technical details section with predictable labels.
- [The new status enum may need copy refinement after real backend data is seen] -> Centralize labels in `event-presentation.ts` or `definitions.ts` so updates are small.
- [Removing obsolete sections changes visual density and screenshot expectations] -> Update skeletons and APIMAPPING notes in the same change to avoid stale documentation.
- [Event enrichment permission naming remains cross-domain] -> Preserve existing permission helpers unless the backend changes the permission contract.

## Migration Plan

1. Update event DTOs and labels to the simplified backend schema.
2. Refine event list and skeleton around the reduced row model.
3. Refine event detail and skeleton around header, core facts, evidence, assets, themes, and technical details.
4. Update enrichment result helpers for the new outcome enum and `deferredCount`.
5. Add the simplified backend surface rule to `AGENTS.md`.
6. Update `docs/APIMAPPING.md` to mark event FE alignment.
7. Run focused lint/typecheck/build verification for the changed scope.

## Open Questions

- Should event enrichment operators continue to be gated by `source-document:analyze`, or will backend introduce an event-specific permission later? This proposal keeps the current frontend permission decision until BE changes it.
