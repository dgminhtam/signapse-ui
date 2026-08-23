import type { ReactNode } from "react"

import { observeServerOperation } from "./server"
import { OBSERVABILITY_OPERATIONS } from "./semantic"

type ServerObserver = typeof observeServerOperation

export function observeDashboardLoad(
  load: () => Promise<ReactNode>,
  observe: ServerObserver = observeServerOperation
): Promise<ReactNode> {
  return observe(
    OBSERVABILITY_OPERATIONS.dashboardLoad,
    { feature: "dashboard" },
    load
  )
}
