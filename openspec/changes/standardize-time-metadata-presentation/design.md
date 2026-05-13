## Context

Signapse renders time metadata in many surfaces: list table columns, detail technical panels, quick detail drawers, dashboard technical rows, market query evidence, market chart helpers, and Telegram configuration preview tables. The current implementation mixes `text-sm`, `font-medium`, badges, detail-card value styling, and icon sizes such as `h-3.5 w-3.5` or `size-4`.

Most of these fields are supporting metadata. They should help users scan recency or audit state without competing with entity names, status, actions, or primary metrics.

## Goals / Non-Goals

**Goals:**

- Normalize all visible time metadata to a single compact visual treatment.
- Ensure every visible time metadata value has an icon.
- Reduce all time metadata icons to `size-3`.
- Make time metadata read as secondary information using muted compact typography.
- Keep time columns stable with tabular numbers.
- Add the rule to `AGENTS.md` so future list/detail/form work follows the convention.

**Non-Goals:**

- No backend API, DTO, sorting, filtering, or date parsing changes.
- No change to the actual formatted date/time strings unless needed to keep existing output intact.
- No shadcn core changes in `components/ui`.
- No broad typography reset for all table cells, badges, cards, or body text.
- No redesign of detail page hierarchy outside timestamp metadata.

## Decisions

### Use An App-Level Time Metadata Primitive

Create or reuse a shared app-level component outside `components/ui`, such as `AppTimeMetadata`, for rendered timestamp metadata. The component should compose normal markup and Lucide icons, not a shadcn primitive override.

Recommended baseline:

```tsx
inline-flex items-center gap-1.5 text-xs font-normal leading-5 text-muted-foreground tabular-nums
```

The icon inside this component should consistently use:

```tsx
size-3 shrink-0
```

Why: A shared app-level component keeps the convention simple and avoids patching `TableCell`, `Badge`, or other shadcn primitives. It also gives future screens one obvious place to follow.

Alternative considered: globally reduce table body text or edit `components/ui/table.tsx`. This is rejected because not every table cell is metadata and the repo already treats shadcn core source as protected.

### Standardize Presentation, Not Necessarily The Same Icon Glyph

All time metadata should share the same layout, typography, and icon size. The icon glyph may be semantic when useful:

- `CalendarClock` or `Calendar` for published, occurred, scheduled, or business event time.
- `Clock3` for created, updated, validated, and generic audit timestamps.
- `RefreshCcw` for sync time when the label is explicitly synchronization-related.

Even when the glyph differs, every icon must use the same `size-3` treatment.

### Treat Time Fields As Metadata By Default

Time fields such as `createdDate`, `lastModifiedDate`, `publishedAt`, `occurredAt`, `scheduledAt`, `syncedAt`, `nextTriggeredTime`, `lastValidatedAt`, and similar rendered timestamps should use the metadata pattern by default.

If a screen currently uses a generic `DetailCard` or `QuickFact` whose value is `font-medium text-foreground`, timestamp values should opt into a metadata variant or use the shared time metadata primitive instead of appearing as a primary fact.

### Avoid Badge Treatment For Plain Time Metadata

Time values should not be rendered in `Badge` unless the timestamp is part of a true status/signal pattern. Badges increase emphasis and make supporting timestamps look like state.

### Update Repo Rules

Add an `AGENTS.md` rule under UI/layout conventions stating that rendered time metadata must use the compact icon-bearing pattern with icon `size-3`, muted text, and tabular numbers, and should not use `font-medium`, large card value styling, or badge treatment unless it is truly a business signal.

## Risks / Trade-offs

- [Risk] Some business-critical time fields may become too quiet. -> Mitigation: preserve placement and labels; if a timestamp is genuinely primary, keep it near the title but still use the time metadata primitive.
- [Risk] Updating many screens manually can miss one-off timestamp renderers. -> Mitigation: audit with searches for `formatDateTime`, `createdDate`, `lastModifiedDate`, `publishedAt`, `occurredAt`, `scheduledAt`, `syncedAt`, `nextTriggeredTime`, `lastValidatedAt`, and raw `date-fns` formatting.
- [Risk] Different icons can still feel inconsistent. -> Mitigation: lock the typography and icon sizing; keep semantic icon choices limited and documented.
- [Risk] Helper abstraction could become overbuilt. -> Mitigation: keep the component small and presentational, with no date parsing or business formatting responsibilities.
