## Context

The root English and Vietnamese guidance files each contain 185 lines of repo-wide and domain-specific policy. Three scoped override files now own API boundary, library/contract, and UI/shared-component guidance, but Codex does not automatically load every nested override when a task starts from the repository root. The root also references `app/(main)` and `app/(auth)` even though the actual route groups live below `app/[lang]`.

## Goals / Non-Goals

**Goals:**

- Make the root guidance a concise index of repo-wide policy and scoped instruction sources.
- Ensure root-started tasks explicitly load every applicable override.
- Remove only rules already represented by equivalent or stronger scoped guidance.
- Preserve unmatched product-critical and cross-domain constraints.
- Correct locale-aware route examples and keep English/Vietnamese guidance synchronized.

**Non-Goals:**

- Rewriting or expanding the three existing override files.
- Changing application code, runtime behavior, dependencies, or API contracts.
- Moving every remaining UI rule out of root before it has a scoped owner.

## Decisions

### Use an explicit scoped-instruction router

Add a compact root section mapping `app/api/**`, `app/lib/**`, and UI work under `app/[lang]/**` or `components/**` to their existing override files. Tasks spanning domains must read all applicable files.

Alternative considered: rely only on automatic nested `AGENTS.override.md` discovery. Rejected because root-started tasks would not reliably load sibling nested guidance.

### Consolidate conservatively

Delete a root rule only when the relevant override expresses the same or a stronger constraint. Keep feature structure, unmatched UI invariants, quick-detail behavior, sidebar policy, content policy, cross-domain contract hierarchy, and review expectations in root until a scoped file owns them.

Alternative considered: replace the root with only the router and generic workflow rules. Rejected because the current overrides do not yet cover every product-critical invariant.

### Correct route paths in the same change

Update architecture, feature-tree, and page-layout references from bare `app/(main)` and `app/(auth)` paths to `app/[lang]/(main)` and `app/[lang]/(auth)`.

### Treat both root language files as one policy surface

Apply every structural and semantic change to both `AGENTS.md` and `AGENTS.vi.md` in the same patch. Verification compares section structure and checks both files for stale route paths.

## Risks / Trade-offs

- [Risk] Removing a short root rule may weaken a more precise constraint hidden in its wording. → Compare each candidate against the scoped text and retain unmatched details.
- [Risk] The root remains longer than an ideal pure index. → Accept the remaining length until those rules receive an explicit scoped owner.
- [Risk] English and Vietnamese files drift during manual editing. → Use narrow paired patches and verify headings and route references in both files.
- [Risk] The router becomes stale when scoped files move. → Reference only the three existing stable paths and verify that each file exists.
