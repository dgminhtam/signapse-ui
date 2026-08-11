import assert from "node:assert/strict"

import {
  dashboardMarketNarrativesMetricResponseSchema,
  dashboardMetricStates,
  dashboardSummaryResponseSchema,
} from "./definitions.ts"

const assetTypes = ["COMMODITY", "CRYPTO", "EQUITY", "ETF", "FX", "INDEX"]

const assetsInFocusItems = assetTypes.map((assetType, index) => ({
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

const assetsInFocusMetric = {
  state: "AVAILABLE",
  items: assetsInFocusItems,
  errorCode: "FUTURE_CANONICAL_ERROR",
}

const narrativeStatuses = ["EMERGING", "WEAKENING", "ACTIVE"]
const narrativeItems = narrativeStatuses.map((status, index) => ({
  id: index + 1,
  title: index === 0 ? null : `Narrative ${index + 1}`,
  thesis: index === 1 ? null : `Thesis ${index + 1}`,
  status,
  confidence: index === 2 ? null : 0.8 - index / 10,
  lastUpdatedAt: "2026-08-11T00:00:00.000Z",
  primaryTheme: {
    themeId: index + 1,
    themeTitle: index === 2 ? null : `Theme ${index + 1}`,
    themeSlug: `theme-${index + 1}`,
  },
  assets: assetTypes
    .slice(index * 2, index * 2 + 2)
    .map((assetType, assetIndex) => ({
      assetId: index * 2 + assetIndex + 1,
      assetName: `Narrative Asset ${index * 2 + assetIndex + 1}`,
      assetSymbol: `NAR${index * 2 + assetIndex + 1}`,
      assetType,
      relationType: assetIndex === 0 ? "PRIMARY" : "AFFECTED",
      weight: index === 1 && assetIndex === 0 ? null : 0.5,
    })),
}))

const marketNarrativesMetric = {
  state: "AVAILABLE",
  items: narrativeItems,
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
  assetsInFocus: assetsInFocusMetric,
  marketNarratives: marketNarrativesMetric,
}

const oneNarrativeResult =
  dashboardMarketNarrativesMetricResponseSchema.safeParse({
    ...marketNarrativesMetric,
    items: narrativeItems.slice(0, 1),
  })
assert.equal(oneNarrativeResult.success, true)

const allNarrativesResult = dashboardMarketNarrativesMetricResponseSchema.safeParse(
  marketNarrativesMetric
)
assert.equal(allNarrativesResult.success, true)

for (const state of dashboardMetricStates) {
  const result = dashboardMarketNarrativesMetricResponseSchema.safeParse({
    state,
    items: [],
    errorCode: state === "AVAILABLE" || state === "EMPTY" ? null : "STATE_ERROR",
  })
  assert.equal(result.success, true, `state ${state} should be accepted`)
}

const summaryResult = dashboardSummaryResponseSchema.safeParse(summary)
assert.equal(summaryResult.success, true)
if (summaryResult.success) {
  assert.deepEqual(summaryResult.data.assetsInFocus.items, assetsInFocusItems)
  assert.equal(summaryResult.data.assetsInFocus.items[0].context.summary, null)
  assert.equal(summaryResult.data.recentEvents.items[0].description, null)
  assert.equal(summaryResult.data.recentEvents.items[0].confidence, null)
  assert.deepEqual(summaryResult.data.marketNarratives.items, narrativeItems)
  assert.equal(summaryResult.data.marketNarratives.items[0].title, null)
  assert.equal(summaryResult.data.marketNarratives.items[1].thesis, null)
  assert.equal(summaryResult.data.marketNarratives.items[2].confidence, null)
  assert.equal(
    summaryResult.data.marketNarratives.items[2].primaryTheme.themeTitle,
    null
  )
  assert.equal(summaryResult.data.marketNarratives.items[1].assets[0].weight, null)
  assert.equal(
    summaryResult.data.assetsInFocus.errorCode,
    "FUTURE_CANONICAL_ERROR"
  )
  assert.equal(
    summaryResult.data.marketNarratives.errorCode,
    "FUTURE_CANONICAL_ERROR"
  )
}

const missingRequiredField = { ...narrativeItems[0] }
delete missingRequiredField.title
const missingFieldResult =
  dashboardMarketNarrativesMetricResponseSchema.safeParse({
    ...marketNarrativesMetric,
    items: [missingRequiredField],
  })
assert.equal(missingFieldResult.success, false)

const nullThemeResult =
  dashboardMarketNarrativesMetricResponseSchema.safeParse({
    ...marketNarrativesMetric,
    items: [{ ...narrativeItems[0], primaryTheme: null }],
  })
assert.equal(nullThemeResult.success, false)

const tooManyItemsResult =
  dashboardMarketNarrativesMetricResponseSchema.safeParse({
    ...marketNarrativesMetric,
    items: [...narrativeItems, { ...narrativeItems[0], id: 4 }],
  })
assert.equal(tooManyItemsResult.success, false)

console.log("dashboard definitions assertions passed")
