## 1. Localized Impact Labels

- [x] 1.1 Add uppercase high, medium, low, unknown, and no-impact labels to the Vietnamese and English economic calendar dictionaries.
- [x] 1.2 Update the shared impact-label helper to normalize recognized values and return localized labels for recognized, missing, and unknown impact.
- [x] 1.3 Add one focused Node built-in test covering case-insensitive impact mapping and localized missing/unknown fallbacks.

## 2. List Badge Colors

- [x] 2.1 Map high, medium, and low list badges to the exact approved red, purple, and sky palettes while keeping missing or unknown impact outline-neutral.

## 3. Verification

- [x] 3.1 Run the focused impact-label test and targeted lint for the touched economic calendar and dictionary files.
- [x] 3.2 Run `pnpm typecheck`, `openspec validate highlight-economic-calendar-impact-badges --strict`, and `git diff --check`.

## 4. Status Column Removal

- [x] 4.1 Remove the list status header, row badge, local helper/import, dead column labels, and update every affected live-table column span.
- [x] 4.2 Remove the matching status header and cells from the economic calendar loading skeleton and update its column span.

## 5. Follow-up Verification

- [x] 5.1 Run targeted lint, typecheck, strict OpenSpec validation, `git diff --check`, and a focused formatting review without reformatting unrelated code.
