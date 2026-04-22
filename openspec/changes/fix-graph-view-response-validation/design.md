## Context

`/graph-view` has already been implemented in the frontend, but the first real backend payload exposed a mismatch between runtime data and the Zod schema used at the action boundary. The backend returns several optional node metadata fields as explicit `null` values across `event`, `asset`, `theme`, and `source-document` nodes, while the frontend currently models many of those fields as `optional()` rather than `nullish()`.

Because validation happens before the route renders, the page fails fast in `getGraphView()` even though the underlying graph data is otherwise usable. The client workbench is already mostly null-safe when reading metadata, so the main issue is the parsing boundary and the quality of diagnostics when a real incompatibility does occur.

## Goals / Non-Goals

**Goals:**
- Make `GET /graph-view` parsing accept the backend's real nullability behavior for optional node metadata.
- Preserve a typed validation boundary so the frontend still catches genuine structural contract breaks.
- Ensure the graph browse page, selection panel, and drill-down affordances continue to render when optional metadata values are `null`.
- Improve the validation failure path enough that future payload mismatches are easier to diagnose from local logs.
- Unblock real-payload verification for the existing graph-view rollout.

**Non-Goals:**
- Changing the backend contract or requiring the backend to omit `null` values.
- Relaxing validation for required graph fields such as node IDs, node kinds, edge kinds, or edge endpoints.
- Redesigning the graph-view UX, adding new node kinds, or expanding drill-down support.
- Replacing Zod validation with unchecked runtime parsing.

## Decisions

### 1. Make nullable metadata explicit in the graph-view schema
The frontend will treat optional graph-view node metadata fields as nullable at the schema boundary, rather than assuming the backend will omit them when empty.

Why:
- The observed payload shows `null` values repeatedly across multiple node kinds, so this is a stable runtime compatibility issue rather than a one-off malformed record.
- The UI already behaves acceptably when those values are absent, so widening the parser is the smallest change that restores the feature.
- Capturing nullability in the schema keeps TypeScript and runtime validation aligned.

Alternatives considered:
- Keep the schema strict and require the backend to omit nulls.
- Rejected because the frontend must work against the current real payload, and relying on a backend cleanup would prolong the broken state.
- Remove schema validation for `/graph-view`.
- Rejected because that would hide genuine contract regressions and weaken the feature boundary too broadly.

### 2. Prefer field-level tolerance over whole-payload normalization
The design should update the specific metadata fields that are truly nullable instead of normalizing the full payload into a looser shape before validation.

Why:
- The mismatch is isolated to known metadata fields, not the whole response structure.
- A field-level fix keeps the accepted contract narrow and self-documenting.
- It reduces the risk of accidentally masking future backend issues in required graph fields.

Alternatives considered:
- Preprocess the entire response and convert every `null` to `undefined`.
- Rejected because it is broader than needed and can erase useful distinctions in fields that are intentionally nullable.

### 3. Keep fatal failure for real structural mismatches, but improve diagnostics
The action layer should still reject truly incompatible payloads, but the logging path should surface a bounded, readable subset of issues instead of dumping an oversized opaque array.

Why:
- Validation failures remain valuable when node kinds, IDs, or relation structure drift from the contract.
- The current raw issue dump is noisy and hard to interpret in Next.js development logs once the issue list becomes large.
- Bounded diagnostic output keeps developer feedback actionable without weakening correctness.

Alternatives considered:
- Silence validation details entirely and only throw a generic error.
- Rejected because it makes future contract debugging much slower.

### 4. Treat UI rendering as a compatibility check, not a redesign task
The workbench should continue to omit missing metadata rows and source-link actions when values are null, with only small defensive tweaks if any direct assumptions remain.

Why:
- The existing panel logic already uses optional chaining for most metadata reads.
- The bug is not caused by the browse UI itself, so the change should avoid unnecessary churn in a visually rich feature.

Alternatives considered:
- Rework the side panel to show placeholder text for every missing field.
- Rejected because that would change the browse experience and create noise unrelated to the parser bug.

## Risks / Trade-offs

- [Allowing nullable metadata could hide an accidental backend regression if a previously populated field starts coming back null] -> Keep validation narrow to optional metadata only and rely on graph rendering plus verification to catch suspicious data quality changes.
- [Changing schema types may force minor TypeScript adjustments where code assumed plain strings or booleans] -> Review graph-view display helpers and keep null-safe access explicit at the UI boundary.
- [Improved diagnostics can still become noisy if too much payload detail is logged] -> Log a bounded sample of issue paths and messages instead of entire issue arrays.

## Migration Plan

1. Update the graph-view metadata schema to accept nullable optional fields observed in the real backend payload.
2. Review graph-view UI helpers for any direct assumptions about metadata string or boolean presence and add narrow safeguards only where needed.
3. Improve `getGraphView()` diagnostics so true schema mismatches remain easy to inspect.
4. Re-run graph-view verification against a real backend payload and close the pending verification task in the existing rollout change.

Rollback strategy:
- Revert the schema and diagnostic adjustments if they introduce unexpected behavior.
- The backend contract and graph-view route structure remain unchanged, so rollback is isolated to the frontend graph-view parsing layer.

## Open Questions

- None. The runtime payload already makes the nullability gap concrete enough to implement without additional product decisions.
