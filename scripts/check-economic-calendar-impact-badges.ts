import assert from "node:assert/strict"

import type { Dictionary } from "../app/lib/i18n/dictionary-types"

const {
  getEconomicCalendarImpactBadgeProps,
  getEconomicCalendarImpactLabel,
  getEconomicCalendarImpactLevel,
  isEconomicCalendarImpactSelected,
} = await import("../app/lib/economic-calendar/definitions" + ".ts")

const dictionary = (labels: {
  HIGH: string
  LOW: string
  MEDIUM: string
  UNKNOWN: string
  noImpact: string
}) =>
  ({
    economicCalendar: {
      impactLabels: {
        HIGH: labels.HIGH,
        LOW: labels.LOW,
        MEDIUM: labels.MEDIUM,
        UNKNOWN: labels.UNKNOWN,
      },
      noImpact: labels.noImpact,
    },
  }) as Dictionary

const en = dictionary({
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
  UNKNOWN: "UNKNOWN",
  noImpact: "NO IMPACT",
})
const vi = dictionary({
  HIGH: "CAO",
  MEDIUM: "TRUNG BÌNH",
  LOW: "THẤP",
  UNKNOWN: "KHÔNG XÁC ĐỊNH",
  noImpact: "CHƯA CÓ TÁC ĐỘNG",
})

assert.deepEqual(getEconomicCalendarImpactBadgeProps("high"), {
  className: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
})
assert.deepEqual(getEconomicCalendarImpactBadgeProps("MEDIUM"), {
  className:
    "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
})
assert.deepEqual(getEconomicCalendarImpactBadgeProps("Low impact"), {
  className: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
})
assert.deepEqual(getEconomicCalendarImpactBadgeProps("unexpected"), {
  variant: "outline",
})
assert.deepEqual(getEconomicCalendarImpactBadgeProps(null), {
  variant: "outline",
})

assert.equal(getEconomicCalendarImpactLabel("high", en), "HIGH")
assert.equal(getEconomicCalendarImpactLabel("medium", vi), "TRUNG BÌNH")
assert.equal(getEconomicCalendarImpactLabel("unexpected", vi), "KHÔNG XÁC ĐỊNH")
assert.equal(getEconomicCalendarImpactLabel(undefined, en), "NO IMPACT")

assert.equal(getEconomicCalendarImpactLevel(" high impact "), "HIGH")
assert.equal(getEconomicCalendarImpactLevel("medium"), "MEDIUM")
assert.equal(getEconomicCalendarImpactLevel("Low impact"), "LOW")
assert.equal(getEconomicCalendarImpactLevel(""), null)
assert.equal(getEconomicCalendarImpactLevel("unexpected"), null)
assert.equal(getEconomicCalendarImpactLevel(null), null)

assert.equal(
  isEconomicCalendarImpactSelected("high", ["HIGH", "MEDIUM", "LOW"]),
  true
)
assert.equal(isEconomicCalendarImpactSelected("high", ["MEDIUM", "LOW"]), false)
assert.equal(isEconomicCalendarImpactSelected("unknown", ["HIGH", "MEDIUM", "LOW"]), false)
assert.equal(isEconomicCalendarImpactSelected("low", []), false)

console.log("Economic calendar impact checks passed")
