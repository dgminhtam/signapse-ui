import assert from "node:assert/strict"

import {
  dashboardAssetsInFocusMetricResponseSchema,
  dashboardMetricStates,
  dashboardSummaryResponseSchema,
} from "./definitions.ts"

const assetTypes = ["COMMODITY", "CRYPTO", "EQUITY", "ETF", "FX", "INDEX"]

const items = assetTypes.map((assetType, index) => ({
  assetId: index + 1,
  assetName: `Asset ${index + 1}`,
  assetSymbol: `AST${index + 1}`,
  assetType,
  context: {
    title: `Context ${index + 1}`,
    summary: index === 0 ? null : `Summary ${index + 1}`,
    observedAt: "2026-08-11T00:00:00.000Z",
  },
}))

const metric = {
  state: "AVAILABLE",
  items,
  errorCode: "FUTURE_CANONICAL_ERROR",
}

const summary = {
  asOf: "2026-08-11T00:00:00.000Z",
  timezone: "UTC",
  scope: { workspaceId: 1, watchlistAssetCount: null },
  nextKeyEvent: { state: "EMPTY", data: null, errorCode: null },
  recentEvents: {
    state: "AVAILABLE",
    items: [
      {
        id: 1,
        title: "Event with nullable context",
        description: null,
        occurredAt: "2026-08-11T00:00:00.000Z",
        confidence: null,
        themes: [],
        affectedAssets: [],
      },
    ],
    errorCode: null,
  },
  marketEvents24h: {
    state: "EMPTY",
    count: null,
    window: null,
    errorCode: null,
  },
  activeNarratives: {
    state: "EMPTY",
    count: null,
    statuses: [],
    errorCode: null,
  },
  latestNews6h: {
    state: "EMPTY",
    count: null,
    window: null,
    errorCode: null,
  },
  assetsInFocus: metric,
}

const oneItemResult = dashboardAssetsInFocusMetricResponseSchema.safeParse({
  ...metric,
  items: items.slice(0, 1),
})
assert.equal(oneItemResult.success, true)

const allItemsResult = dashboardAssetsInFocusMetricResponseSchema.safeParse(metric)
assert.equal(allItemsResult.success, true)

for (const state of dashboardMetricStates) {
  const result = dashboardAssetsInFocusMetricResponseSchema.safeParse({
    state,
    items: [],
    errorCode: state === "AVAILABLE" || state === "EMPTY" ? null : "STATE_ERROR",
  })
  assert.equal(result.success, true, `state ${state} should be accepted`)
}

const summaryResult = dashboardSummaryResponseSchema.safeParse(summary)
assert.equal(summaryResult.success, true)
if (summaryResult.success) {
  assert.deepEqual(summaryResult.data.assetsInFocus.items, items)
  assert.equal(summaryResult.data.assetsInFocus.items[0].context.summary, null)
  assert.equal(summaryResult.data.recentEvents.items[0].description, null)
  assert.equal(summaryResult.data.recentEvents.items[0].confidence, null)
  assert.equal(
    summaryResult.data.assetsInFocus.errorCode,
    "FUTURE_CANONICAL_ERROR"
  )
}

const missingRequiredField = { ...items[0] }
delete missingRequiredField.assetName
const missingFieldResult = dashboardAssetsInFocusMetricResponseSchema.safeParse({
  ...metric,
  items: [missingRequiredField],
})
assert.equal(missingFieldResult.success, false)

const tooManyItemsResult = dashboardAssetsInFocusMetricResponseSchema.safeParse({
  ...metric,
  items: [...items, { ...items[0], assetId: 7 }],
})
assert.equal(tooManyItemsResult.success, false)

console.log("dashboard definitions assertions passed")
