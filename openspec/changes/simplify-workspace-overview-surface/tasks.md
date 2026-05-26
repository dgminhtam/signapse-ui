## 1. Information Hierarchy

- [x] 1.1 Simplify the successful root overview layout to active workspace identity plus tracked-asset readiness.
- [x] 1.2 Remove the duplicated active/status stat treatment from the primary overview.
- [x] 1.3 Remove the duplicate watchlist management action so only one visible action opens the watchlist editor.
- [x] 1.4 Demote or remove technical workspace details from the default first-viewport content.

## 2. Tracked-Asset Preview

- [x] 2.1 Render tracked assets with one compact preview representation instead of both chips and repeated item cards.
- [x] 2.2 Cap the number of visible tracked assets in the overview and preserve the management action as the full-list path.
- [x] 2.3 Preserve watchlist denied, load error, and empty states with localized professional Vietnamese copy.

## 3. Loading And Copy

- [x] 3.1 Update the overview skeleton so it mirrors the simplified final layout.
- [x] 3.2 Remove or revise unused/redundant overview dictionary entries created by the simplified surface.
- [x] 3.3 Verify touched UI composition follows Signapse shadcn policy: existing wrappers, `gap-*`, semantic tokens, and no `components/ui/*` chrome changes.

## 4. Verification

- [x] 4.1 Run `openspec validate simplify-workspace-overview-surface --strict`.
- [x] 4.2 Run the repo lint check.
- [x] 4.3 Run the repo typecheck.
- [x] 4.4 Perform a deterministic review for duplicated overview copy/actions, first-viewport technical metadata, and skeleton mismatch.

User-owned manual QA note: after implementation, a logged-in user can optionally open `/vi` and inspect the overview with tracked assets, no tracked assets, and limited watchlist permissions.
