import {
  startClientPerformanceMeasurement,
  type ClientPerformanceMeasurement,
} from "@/app/lib/observability/client"
import {
  OBSERVABILITY_OPERATIONS,
  type ObservabilityOutcome,
} from "@/app/lib/observability/semantic"

type StartMeasurement = typeof startClientPerformanceMeasurement

export function createMarketChartInitialLoadObserver(
  startMeasurement: StartMeasurement = startClientPerformanceMeasurement
) {
  let activeAttempt:
    | { generation: number; measurement: ClientPerformanceMeasurement }
    | undefined

  return {
    cancelCurrent() {
      activeAttempt?.measurement.finish("stale")
      activeAttempt = undefined
    },
    finish(generation: number, outcome: ObservabilityOutcome) {
      if (activeAttempt?.generation !== generation) {
        return
      }
      activeAttempt.measurement.finish(outcome)
      activeAttempt = undefined
    },
    start(generation: number) {
      activeAttempt?.measurement.finish("stale")
      activeAttempt = {
        generation,
        measurement: startMeasurement(
          OBSERVABILITY_OPERATIONS.marketChartInitialLoad,
          { feature: "market_chart" }
        ),
      }
    },
  }
}
