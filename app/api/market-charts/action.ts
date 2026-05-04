"use server"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { ActionResult } from "@/app/lib/definitions"
import {
  MarketChartCandleRequest,
  MarketChartCandleResponse,
  marketChartCandleRequestSchema,
  marketChartCandleResponseSchema,
} from "@/app/lib/market-charts/definitions"

function createMarketChartCandleQuery(request: MarketChartCandleRequest) {
  const query = new URLSearchParams()

  query.set("symbol", request.symbol.trim())
  query.set("timeframe", request.timeframe)
  query.set("from", request.from)
  query.set("to", request.to)

  return query.toString()
}

export async function getMarketChartCandles(
  request: MarketChartCandleRequest
): Promise<ActionResult<MarketChartCandleResponse>> {
  const parsedRequest = marketChartCandleRequestSchema.safeParse(request)

  if (!parsedRequest.success) {
    return {
      success: false,
      error:
        parsedRequest.error.issues[0]?.message ||
        "Yêu cầu tải biểu đồ giá không hợp lệ.",
    }
  }

  try {
    const response = await fetchAuthenticated<unknown>(
      `/market-charts/candles?${createMarketChartCandleQuery(parsedRequest.data)}`
    )
    const parsedResponse = marketChartCandleResponseSchema.safeParse(response)

    if (!parsedResponse.success) {
      console.error("Market chart candle response validation failed", parsedResponse.error.issues)
      return {
        success: false,
        error: "Backend trả về dữ liệu nến không đúng định dạng mong đợi.",
      }
    }

    return {
      success: true,
      data: parsedResponse.data,
    }
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Không thể tải dữ liệu biểu đồ giá trong lúc này.",
    }
  }
}
