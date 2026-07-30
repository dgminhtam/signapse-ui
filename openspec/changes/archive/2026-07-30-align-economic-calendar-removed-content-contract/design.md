## Context

The current OpenAPI snapshot keeps the Economic Calendar list, detail and sync endpoints plus the Market Chart economic-calendar endpoint, but removes `contentAvailable` from all related response DTOs and removes `content` from the detail DTO. Frontend types, status helpers, list expansion, detail content state and Market Chart runtime validation still depend on those fields.

The direct runtime failure is in Market Chart: its Zod response schema requires `contentAvailable`, so a valid response from the new backend is rejected before calendar markers can update. Economic Calendar list/detail requests are typed without runtime parsing, so they do not throw, but the list silently loses its expansion affordance and the detail page always shows a misleading content-unavailable state.

The change spans contracts, two user-visible surfaces, localization and existing OpenSpec requirements. It must preserve endpoint paths, permissions, URL state, date grouping, marker behavior and canonical detail navigation.

## Goals / Non-Goals

**Goals:**

- Match Economic Calendar and Market Chart DTOs/runtime schemas to the current backend snapshot.
- Use `status` as the only publication-state signal and remove compatibility fallback to `contentAvailable`.
- Remove list/detail UI that promises or explains detailed content the backend no longer exposes.
- Keep every Economic Calendar event navigable to its localized canonical detail route.
- Preserve useful detail information: description, release values, timestamps and technical metadata.
- Keep OpenSpec and API mapping documentation aligned with the implemented behavior.

**Non-Goals:**

- Do not restore, synthesize or derive detailed content from `description` or other fields.
- Do not remove Economic Calendar detail routes or backend actions.
- Do not change permissions, search, sort, UTC+7 grouping, sync behavior, chart range loading or marker grouping.
- Do not add a new endpoint, dependency, UI primitive or compatibility fallback.
- Do not rewrite archived OpenSpec changes.

## Decisions

### Remove obsolete fields at the contract boundary

`EconomicCalendarListResponse` drops `contentAvailable`; `EconomicCalendarResponse` becomes a type alias of the list response because the two backend schemas now expose the same field surface. `MarketChartEconomicCalendarEventResponse` and its Zod object both drop `contentAvailable` so runtime parsing accepts the new payload.

Alternative considered: make `contentAvailable` optional. Rejected because the backend removed the field, and retaining it would preserve dead compatibility behavior and allow future code to depend on a contract that no longer exists.

### Treat status as the only publication signal

Economic Calendar status helpers accept `status` plus an optional dictionary only; they no longer infer status from content availability. List, detail and Market Chart badges all use the retained `PENDING` / `AVAILABLE` enum.

Alternative considered: infer availability from actual/forecast values or description. Rejected because those fields are nullable domain data and are not publication-state discriminators.

### Delete list expansion instead of repurposing it

The list removes expansion state, controls, supporting rows and expanded-row span calculations. Canonical title and Eye links remain available for every event. A compact status Badge is placed in the event/title cell so the retained publication state stays scannable without adding another table column.

Alternative considered: render `description` inside the expansion. Rejected because that would introduce a new interaction contract unrelated to the backend removal, duplicate detail-page context and retain row-span complexity with little decision value.

### Remove the detail content section and matching skeleton

The detail page removes the `hasContent` branch, detailed-content section and permanent content-unavailable message. Its Suspense skeleton removes the matching large content block. Description remains in the primary reading path, and the existing metrics and technical metadata remain unchanged.

Alternative considered: retain an informational empty state. Rejected because content is no longer expected; presenting it as temporarily unavailable would instruct users to retry or sync for data that cannot arrive.

### Keep Market Chart behavior except for contract parsing

The Market Chart action keeps the same request and failure handling. Updating the shared response schema restores parsing; the canvas removes the obsolete helper argument while preserving markers, quick lists, status badges and canonical detail links. Copy and specs describe the destination as canonical entry details, not full content.

### Remove only copy owned by deleted behavior

Vietnamese and English dictionaries drop expansion labels, content-availability summaries, content section/empty-state copy and the unused Market Chart content-availability label. Dictionary typing continues to derive from the Vietnamese dictionary.

## Risks / Trade-offs

- [Backend returns an undocumented status value] → Keep the existing unknown status fallback in shared helpers and retain strict Market Chart enum validation.
- [Detail page feels less rich after content removal] → Preserve description, release metrics and technical timestamps; do not manufacture substitute content.
- [Status Badge increases list density] → Place it inside the existing event/title cell rather than adding a new column.
- [OpenSpec archives still mention removed fields] → Leave archives immutable and update only main capability deltas plus current API mapping status.

## Migration Plan

1. Update DTOs, Zod response schema and status helper signatures first so TypeScript exposes every stale caller.
2. Remove Economic Calendar list expansion and add the compact status Badge without changing canonical links.
3. Remove detail content UI and its skeleton footprint.
4. Update Market Chart status rendering and delete obsolete dictionary copy.
5. Validate static references, runtime schema acceptance, typecheck, lint and OpenSpec artifacts.
6. Run API mapping sync after implementation to mark the documented frontend drift resolved.

The frontend and backend changes must be treated as one contract migration. Rolling back this frontend change while the new backend remains deployed would restore Market Chart parse failures; rollback is safe only with the old backend contract or a forward fix.

## Open Questions

None. The current snapshot retains `status` as `PENDING` / `AVAILABLE` and retains all affected endpoint paths.
