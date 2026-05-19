## Context

The Events feature already supports reading simplified event data and running asset/theme enrichment. The latest backend contract adds event market reaction derivation endpoints and includes `marketReactions[]` on event detail responses.

The existing event detail page is the right primary surface because market reactions explain the consequence of a specific event. The event list currently does not receive market reaction count or status fields, so list-level display should remain limited to an operator batch action.

## Goals / Non-Goals

**Goals:**

- Make market reactions easy to scan on event detail pages as user-facing insight, not technical metadata.
- Provide single-event and pending-batch derivation actions with permission gating, pending feedback, refresh, and toast summaries.
- Keep the simplified Events hierarchy: status, description, confidence, timestamps, evidence, market impact, assets/themes, then technical metadata.
- Keep UI copy professional Vietnamese and aligned with current shadcn/cardless workspace conventions.
- Update frontend DTOs and system prompt options so the codebase matches the backend contract.

**Non-Goals:**

- Do not create a separate top-level market reactions route.
- Do not add charts, matrix views, or timeline visualizations without richer backend data.
- Do not add event-list market reaction columns until `GET /events` exposes summary fields.
- Do not change backend contracts or add new dependencies.

## Decisions

1. Render market reactions on event detail as a dedicated "Tác động thị trường" section.

   Rationale: Market reactions answer the operator's next question after reading evidence: which assets are affected, in what direction, over what horizon, and with how much confidence. Placing the section after evidence keeps trust first while still promoting market impact above supporting assets/themes.

   Alternative considered: Place reactions below assets/themes. This would bury the most actionable derived insight under relationship metadata.

2. Use compact reaction cards instead of a dense table.

   Rationale: Each reaction has a short narrative `reasoning` field and mixed metadata. Cards let the UI show asset identity, direction, horizon, confidence, observed time, and reasoning without making desktop layout depend on horizontal scrolling.

   Alternative considered: A table. This scans well for many rows but handles reasoning poorly and would encourage truncating the most useful field.

3. Keep the event list unchanged except for a batch derive action.

   Rationale: The list response does not include `marketReactions[]`, reaction counts, or derivation status. Adding columns would require extra detail fetches or placeholder values, both of which make the list slower or misleading.

   Alternative considered: Add a market impact column. This is deferred until backend exposes a list-safe summary.

4. Use shadcn primitives already installed in the repo.

   Rationale: `Badge`, `Button`, `Spinner`, `Empty`, `Skeleton`, `Card`, and existing app-level list surfaces are sufficient. This avoids component churn and keeps the work aligned with repo conventions.

   Alternative considered: Add tabs or charts. Those add interaction weight without matching the current API shape.

5. Introduce a separate frontend permission constant for market reaction derivation.

   Rationale: Even if it initially points to the same permission as event enrichment, a named constant such as `EVENT_MARKET_REACTION_DERIVE_PERMISSIONS` prevents market reaction UI from being semantically tied to asset/theme enrichment forever.

   Alternative considered: Reuse `EVENT_ENRICH_PERMISSIONS` directly in components. This is simpler but makes future backend permission changes harder to localize.

## Risks / Trade-offs

- Backend permission name may differ from current event enrichment permission -> Keep permission mapping centralized in `app/lib/events/permissions.ts`.
- `marketReactions[]` may be absent or empty on older data -> Treat missing arrays as empty and show a purposeful empty state.
- Long reasoning text could make cards visually noisy -> Limit default card copy to a readable short block and keep the full text accessible in the card body if needed.
- Batch derive result can partially fail -> Toast summary must include selected, processed, derived, neutral, skipped, and failed counts.
- Existing event UI text appears partially mojibake in some files -> Implementation should preserve professional Vietnamese copy and avoid copying corrupted strings forward.

## Migration Plan

1. Add DTOs, labels, presentation helpers, and event API actions.
2. Add detail and list action components using the existing pending/toast/refresh pattern.
3. Add the market reactions section to event detail and mirror it in skeleton/empty states.
4. Add `EVENT_MARKET_REACTION_DERIVATION` to system prompt options.
5. Update `docs/APIMAPPING.md` drift notes after implementation.

Rollback is low-risk because the change is frontend-only: remove the new action components, DTO fields, detail section, and system prompt option if backend behavior changes.

## Open Questions

- Confirm whether backend will keep using the existing event enrichment operator permission or introduce a dedicated market reaction derivation permission.
