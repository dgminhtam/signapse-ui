## Why

Admin list pages in Signapse are still using inconsistent table surfaces even after the toolbar and pagination hierarchy was standardized. Header styling, border radius ownership, empty states, and loading skeletons now drift by feature, which makes the product feel uneven and keeps reintroducing UI debt on new list pages.

Some list pages can also break horizontally when backend content is longer than expected. The shared table primitive keeps cells `whitespace-nowrap` by default, which is useful for metadata but means each list page needs an explicit column strategy for primary text, metadata, status, timestamps, and actions.

## What Changes

- Introduce a shared list-table surface capability that standardizes the outer shell, header treatment, and clipping behavior for admin list pages.
- Standardize how empty-result states are rendered inside tables so adopted pages use one consistent in-table empty presentation instead of page-specific padding and wrappers.
- Define a loading-state contract for adopted list pages so table skeletons mirror the final table surface instead of inventing a conflicting header bar or shell.
- Define a column overflow contract so long titles, descriptions, URLs, slugs, model IDs, prompt names, or other backend-provided text cannot expand desktop list tables beyond their intended layout.
- Migrate active admin list pages to the shared table surface while leaving hidden or redirected legacy list pages out of the first rollout.
- Update `AGENTS.md` so table-surface rules and related review expectations are explicit repository guidance instead of tribal knowledge.

## Capabilities

### New Capabilities
- `shared-list-table-surface`: Provide a reusable surface pattern for admin list tables that standardizes shell styling, header presentation, in-table empty states, loading-state parity, and column overflow behavior.

### Modified Capabilities

## Impact

- Affected code: new shared table-surface composition components outside `components/ui`, active `*-list.tsx` pages, affected list-page skeletons under `app/(main)`, and `AGENTS.md` table guidance.
- Affected UX: adopted list pages will present the same table shell, header hierarchy, empty-state rhythm, loading shape, and stable column behavior across features.
- APIs: no backend API, DTO, or query-parameter contract changes.
- Guidance and review: `AGENTS.md` will gain explicit table rules so future list-page work and reviews check shell, header, empty state, skeleton consistency, and long-content overflow handling by default.
