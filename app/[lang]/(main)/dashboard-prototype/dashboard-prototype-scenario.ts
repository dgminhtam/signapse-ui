export const DASHBOARD_PROTOTYPE_SCENARIOS = [
  "default",
  "loading",
  "empty",
  "partial-error",
] as const

export type DashboardPrototypeScenario =
  (typeof DASHBOARD_PROTOTYPE_SCENARIOS)[number]

export function normalizeDashboardPrototypeScenario(
  value: string | string[] | undefined
): DashboardPrototypeScenario {
  return typeof value === "string" &&
    DASHBOARD_PROTOTYPE_SCENARIOS.includes(value as DashboardPrototypeScenario)
    ? (value as DashboardPrototypeScenario)
    : "default"
}
