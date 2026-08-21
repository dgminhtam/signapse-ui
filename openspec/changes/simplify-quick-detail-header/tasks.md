## 1. Shared quick-detail header

- [x] 1.1 Render the actual entity/state title without the profile prefix and remove the redundant quick-detail header description.
- [x] 1.2 Preserve the existing body loading, error, missing, access-denied, live-region, busy, retry, focus, and canonical-link behavior.

## 2. Localization and contracts

- [x] 2.1 Remove English and Vietnamese dictionary entries used only by the deleted profile/header copy, retaining strings still rendered by body states.
- [x] 2.2 Sync the delta requirement into `openspec/specs/workspace-local-quick-detail-overlays/spec.md` and update the Quick Detail section of `docs/design/DESIGN.md`.

## 3. Verification

- [x] 3.1 Update focused component and browser assertions for the entity-only title and absent header description.
- [x] 3.2 Run OpenSpec validation, focused quick-detail tests, targeted lint, and typecheck. OpenSpec validation, 13 focused tests, targeted lint, and typecheck pass; full-repo lint still reports seven pre-existing errors outside this change.
