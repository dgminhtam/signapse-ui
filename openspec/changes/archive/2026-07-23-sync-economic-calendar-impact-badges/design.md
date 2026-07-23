## Context

The economic calendar list already defines the approved impact colors and localized uppercase labels. The detail page independently selects a generic variant, while the Market Charts calendar quick list renders raw impact text among generic metadata. The three surfaces share the same impact values but not the same presentation path.

## Goals / Non-Goals

**Goals:**

- Make the list's impact badge treatment canonical across list, detail, and chart quick lists.
- Keep color selection and label normalization in shared economic calendar helpers.
- Preserve existing behavior for absent optional chart metadata.

**Non-Goals:**

- Recolor calendar lane markers or change their grouping and priority.
- Change status presentation, API contracts, DTOs, or global theme tokens.
- Introduce a new badge component or dependency.

## Decisions

1. Export the existing list badge-prop mapping from the shared economic calendar definitions module. All three consumers will call the helper directly. A new component was rejected because the existing Badge plus two shared pure helpers already cover composition.
2. Keep the approved mapping unchanged: high uses red, medium uses purple, low uses sky, and unknown or missing values use outline.
3. Use the existing localized label helper on every surface. The detail badge will show the same label as the list without a redundant impact prefix.
4. Market Charts will render a Badge only when its optional impact field is present. Present but unrecognized values render the localized unknown label; absent values remain omitted with the other missing optional fields.
5. Marker styling and impact-based grouping priority remain unchanged because this change only standardizes visible badges.

## Risks / Trade-offs

- [Shared helper changes could alter the existing list] → Move the current mapping without changing its branches or exact approved classes, and cover recognized, unknown, and missing values with one focused runnable check.
- [Dictionary files contain unrelated worktree edits] → Apply only exact key-level cleanup and verify the final diff preserves unrelated changes.
- [Chart quick lists appear in two popovers] → Change their shared `MarketChartCalendarEventList` renderer once rather than editing both callers.
