## Context

The market chart canvas initializes KLineCharts with `locale: intlLocale`. In the Vietnamese route, Signapse provides `vi-VN`, but KLineCharts 10 beta only registers `zh-CN` and `en-US` by default. Its tooltip i18n helper reads `locales[locale][key]`, so an unregistered `vi-VN` locale crashes when the candle tooltip resolves keys such as `time`.

This is a chart-adapter integration issue. Backend candle fields, annotation grouping, live SSE events, and lazy history are not the source of this runtime error.

## Goals / Non-Goals

**Goals:**

- Register Vietnamese KLineCharts locale copy before the chart instance is initialized.
- Keep the chart using the app locale so Vietnamese users see Vietnamese tooltip labels.
- Make locale setup safe to call from the client canvas lifecycle without causing duplicate side effects.
- Add a minimal fallback boundary for future unsupported app locales.

**Non-Goals:**

- Do not change backend candle, annotation, or live stream contracts.
- Do not change app-wide i18n configuration.
- Do not replace KLineCharts or add `@klinecharts/pro`.
- Do not redesign tooltip UI, chart toolbar, drawing tools, or chart status rail.

## Decisions

### Register KLineCharts Vietnamese locale

Use KLineCharts `registerLocale()` to add `vi-VN` with the required tooltip and period labels: `time`, `open`, `high`, `low`, `close`, `volume`, `turnover`, `change`, `second`, `minute`, `hour`, `day`, `week`, `month`, and `year`.

Alternative considered: map `vi-VN` to KLineCharts built-in `en-US`. This avoids the crash but regresses Vietnamese UI copy inside the chart and conflicts with the product localization rule.

### Register `vi` as a defensive alias

Register both `vi-VN` and `vi` to the same dictionary. The app currently passes `vi-VN`, but registering `vi` protects future adapter usage that might pass the short app locale.

Alternative considered: only register `vi-VN`. This is sufficient for today but makes the locale boundary more brittle for almost no benefit.

### Keep locale resolution inside the chart adapter

Keep KLineCharts-specific locale setup in the market chart canvas adapter or a small same-feature helper. Domain DTOs and app i18n helpers should not learn about KLineCharts vendor locale requirements.

Alternative considered: change `getIntlLocale()` or global app locale mapping. That would overfit app-wide localization to a chart vendor limitation.

### Make setup idempotent

Guard locale registration with a module-level boolean or equivalent helper so repeated client renders and chart remounts do not repeatedly register the same dictionaries.

## Risks / Trade-offs

- [Risk] KLineCharts may add new required locale keys in a future version. → Mitigation: keep locale setup close to the chart adapter and verify tooltip rendering after chart dependency upgrades.
- [Risk] Vietnamese tooltip labels can drift from product copy. → Mitigation: use concise professional Vietnamese labels and keep this copy scoped to chart vendor tooltip labels only.
- [Risk] Future app locales beyond `vi` and `en` may repeat this issue. → Mitigation: route KLineCharts locale through a small resolver that falls back to `en-US` only for unsupported locales.
