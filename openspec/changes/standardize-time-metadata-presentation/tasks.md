## 1. Shared Pattern

- [x] 1.1 Add a small app-level time metadata helper outside `components/ui` that renders inline time metadata with compact muted typography, tabular numbers, and an icon using `size-3`.
- [x] 1.2 Keep date/time formatting responsibility in existing feature formatters; the helper should only handle presentation.
- [x] 1.3 Confirm no `components/ui` shadcn primitive is modified for this change.

## 2. List Table Timestamp Fields

- [x] 2.1 Update event list time metadata to the shared icon-bearing compact presentation.
- [x] 2.2 Update news article list time metadata to the shared icon-bearing compact presentation.
- [x] 2.3 Update economic calendar list time metadata to the shared icon-bearing compact presentation.
- [x] 2.4 Update blog, cronjob, AI provider config, news outlet, and system prompt list time metadata to the shared icon-bearing compact presentation.
- [x] 2.5 Update Telegram configuration preview table time metadata to the shared icon-bearing compact presentation.

## 3. Detail, Drawer, And Supporting Surfaces

- [x] 3.1 Update event, news article, and economic calendar detail timestamp cards/technical fields so time values no longer use primary `font-medium text-foreground` value styling.
- [x] 3.2 Update event and news article quick detail drawer time metadata to the shared compact icon-bearing presentation.
- [x] 3.3 Update dashboard technical time metadata to the shared compact icon-bearing presentation.
- [x] 3.4 Update market query evidence/key event time metadata to the shared compact icon-bearing presentation and remove plain timestamp badge treatment where present.
- [x] 3.5 Review market chart timestamp helper surfaces and update visible supporting time metadata where applicable.

## 4. Documentation And Guardrails

- [x] 4.1 Add the time metadata rule to `AGENTS.md`: rendered time metadata uses compact muted typography, tabular numbers, an icon with `size-3`, and avoids primary value or badge styling unless it is a true business signal.
- [x] 4.2 Search for remaining timestamp renderers using `formatDateTime`, `createdDate`, `lastModifiedDate`, `publishedAt`, `occurredAt`, `scheduledAt`, `syncedAt`, `nextTriggeredTime`, and similar fields; update or explicitly justify any exceptions.

## 5. Verification

- [x] 5.1 Run `pnpm typecheck`.
- [x] 5.2 Run targeted lint for touched components/pages.
- [x] 5.3 Run `pnpm build`.
- [x] 5.4 Run `openspec validate standardize-time-metadata-presentation --strict`.
- [x] 5.5 Smoke review at least one list table, one detail page, one quick detail drawer, and one supporting panel to confirm all visible time metadata has an icon sized `size-3` and reads as secondary metadata.
