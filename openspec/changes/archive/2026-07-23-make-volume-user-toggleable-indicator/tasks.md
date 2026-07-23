## 1. Indicator Control

- [x] 1.1 Add `VOL` to the curated market chart indicator type and option list with the locale-neutral technical label `Volume`.
- [x] 1.2 Derive Volume availability from historical and live candle data, keep the option default-off, disable it when unavailable, and remove an unavailable `VOL` selection after successful data loading.

## 2. KLineChart Synchronization

- [x] 2.1 Route `VOL` through the existing indicator synchronization function while preserving its stable pane identity and compact pane options.
- [x] 2.2 Remove the independent `showVolumePane` prop, automatic workbench derivation, and canvas synchronization effect.
- [x] 2.3 Review the resulting state transitions to confirm repeated Volume toggles cannot create duplicate panes and missing volume is never synthesized as zero.

## 3. Verification

- [x] 3.1 Run focused static searches confirming `VOL` is curated and the legacy `showVolumePane` path is removed.
- [x] 3.2 Run `pnpm lint` and `pnpm typecheck`.
- [x] 3.3 Run OpenSpec validation for `make-volume-user-toggleable-indicator`.
