import assert from "node:assert/strict"

import { normalizeDashboardPrototypeScenario } from "./dashboard-prototype-scenario.ts"

assert.equal(normalizeDashboardPrototypeScenario("default"), "default")
assert.equal(normalizeDashboardPrototypeScenario("loading"), "loading")
assert.equal(normalizeDashboardPrototypeScenario("empty"), "empty")
assert.equal(
  normalizeDashboardPrototypeScenario("partial-error"),
  "partial-error"
)
assert.equal(normalizeDashboardPrototypeScenario(undefined), "default")
assert.equal(
  normalizeDashboardPrototypeScenario(["loading", "empty"]),
  "default"
)
assert.equal(normalizeDashboardPrototypeScenario("unsupported"), "default")

console.log("dashboard prototype scenario assertions passed")
