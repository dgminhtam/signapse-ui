## 1. Shared Impact Mapping

- [x] 1.1 Move the economic calendar list's existing impact Badge prop mapping into the shared economic calendar definitions module without changing its approved palettes.
- [x] 1.2 Update the economic calendar list to use the shared mapping and remove its local duplicate.

## 2. Surface Synchronization

- [x] 2.1 Update the economic calendar detail Badge to use the shared mapping and canonical localized label without the impact prefix.
- [x] 2.2 Update `MarketChartCalendarEventList` to render present impact values as canonical localized Badges and omit absent optional impact values.
- [x] 2.3 Remove the obsolete detail variant helper and unused EN/VI impact-prefix dictionary entries while preserving unrelated worktree changes.

## 3. Verification

- [x] 3.1 Add one focused runnable check covering recognized, unknown, and missing impact mapping and EN/VI labels.
- [x] 3.2 Run the focused check, targeted lint, and project typecheck.
- [x] 3.3 Run strict OpenSpec validation and inspect the final diff for duplicate mappings, raw chart impact metadata, and unrelated edits.
