import {
  startClientPerformanceMeasurement,
  type ClientPerformanceMeasurement,
} from "@/app/lib/observability/client"
import { OBSERVABILITY_OPERATIONS } from "@/app/lib/observability/semantic"

type StartMeasurement = typeof startClientPerformanceMeasurement

export function startAssistantSubmitMeasurement(
  conversationKind: "new" | "existing",
  startMeasurement: StartMeasurement = startClientPerformanceMeasurement
): ClientPerformanceMeasurement {
  return startMeasurement(OBSERVABILITY_OPERATIONS.marketAssistantSubmit, {
    feature: "market_assistant",
    "conversation.kind": conversationKind,
  })
}
