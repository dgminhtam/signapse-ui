## 1. Align Frontend Contracts

- [x] 1.1 Remove `contentAvailable` and detail `content` from Economic Calendar DTOs, alias the detail response to the list response, and simplify status helpers to use `status` only.
- [x] 1.2 Remove `contentAvailable` from the Market Chart Economic Calendar DTO and Zod response schema, then verify the schema accepts a representative backend item without that field.

## 2. Remove Obsolete Content UI

- [x] 2.1 Delete Economic Calendar list expansion state, controls, support rows and expansion-aware row-span logic; keep canonical title/Eye links and render a compact localized status Badge in the event cell.
- [x] 2.2 Delete the Economic Calendar detail content branch, content-unavailable state and matching skeleton block; update all detail status rendering to use `status` only.
- [x] 2.3 Update the Market Chart calendar quick list to call the status variant without `contentAvailable` while preserving markers, publication labels and localized detail navigation.

## 3. Clean Localization And Mapping Documentation

- [x] 3.1 Remove obsolete Economic Calendar expansion/content copy and the unused Market Chart content-availability label from both Vietnamese and English dictionaries.
- [x] 3.2 Run the API mapping sync workflow after code changes and update `docs/APIMAPPING.md` from contract-drift status to confirmed frontend alignment without changing endpoint documentation.

## 4. Verify The Change

- [x] 4.1 Run targeted static searches to confirm application code no longer references `contentAvailable`, Economic Calendar `content`, expansion helpers or removed dictionary keys.
- [x] 4.2 Run `pnpm typecheck` and `pnpm lint`.
- [x] 4.3 Run strict OpenSpec validation for `align-economic-calendar-removed-content-contract` and confirm all change artifacts remain apply-ready.
