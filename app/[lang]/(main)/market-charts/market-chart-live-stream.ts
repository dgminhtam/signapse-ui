import {
  type MarketChartLiveCandleResponse,
  type MarketChartLiveErrorResponse,
  type MarketChartLiveQuoteResponse,
  type MarketChartLiveSnapshotResponse,
  type MarketChartLiveStatusResponse,
  type MarketChartTimeframe,
  marketChartLiveCandleResponseSchema,
  marketChartLiveErrorResponseSchema,
  marketChartLiveQuoteResponseSchema,
  marketChartLiveSnapshotResponseSchema,
  marketChartLiveStatusResponseSchema,
} from "@/app/lib/market-charts/definitions"

type MarketChartLiveStreamHandlers = {
  onCandle: (value: MarketChartLiveCandleResponse) => void
  onErrorEvent: (value: MarketChartLiveErrorResponse) => void
  onInvalidEvent: (message: string) => void
  onOpen: () => void
  onPrice: (value: MarketChartLiveQuoteResponse) => void
  onSnapshot: (value: MarketChartLiveSnapshotResponse) => void
  onStatus: (value: MarketChartLiveStatusResponse) => void
  onTransportError: () => void
}

type OpenMarketChartLiveStreamParams = {
  assetId: number
  timeframe: MarketChartTimeframe
} & MarketChartLiveStreamHandlers

function parseEventData(value: MessageEvent) {
  if (!value.data) {
    return null
  }

  return JSON.parse(String(value.data))
}

export function openMarketChartLiveStream({
  assetId,
  timeframe,
  onCandle,
  onErrorEvent,
  onInvalidEvent,
  onOpen,
  onPrice,
  onSnapshot,
  onStatus,
  onTransportError,
}: OpenMarketChartLiveStreamParams) {
  const url = new URL("/api/market-charts/live", window.location.origin)

  url.searchParams.set("assetId", String(assetId))
  url.searchParams.set("timeframe", timeframe)

  const source = new EventSource(url.toString())

  function handleEvent<T>(
    event: MessageEvent,
    parse: { safeParse: (value: unknown) => { success: true; data: T } | { success: false } },
    onValid: (value: T) => void
  ) {
    try {
      const parsed = parse.safeParse(parseEventData(event))

      if (!parsed.success) {
        onInvalidEvent("Market chart live event payload is invalid.")
        return
      }

      onValid(parsed.data)
    } catch {
      onInvalidEvent("Market chart live event payload is invalid.")
    }
  }

  source.addEventListener("open", onOpen)
  source.addEventListener("snapshot", (event) => {
    handleEvent(event, marketChartLiveSnapshotResponseSchema, onSnapshot)
  })
  source.addEventListener("price", (event) => {
    handleEvent(event, marketChartLiveQuoteResponseSchema, onPrice)
  })
  source.addEventListener("candle", (event) => {
    handleEvent(event, marketChartLiveCandleResponseSchema, onCandle)
  })
  source.addEventListener("status", (event) => {
    handleEvent(event, marketChartLiveStatusResponseSchema, onStatus)
  })
  source.addEventListener("error", (event) => {
    if (event instanceof MessageEvent && event.data) {
      handleEvent(event, marketChartLiveErrorResponseSchema, onErrorEvent)
      return
    }

    onTransportError()
  })

  return {
    close() {
      source.close()
    },
  }
}
