"use server"

import { z } from "zod"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { ActionResult } from "@/app/lib/definitions"
import { getDictionary } from "@/app/lib/i18n/dictionaries"
import { getRequestLocale } from "@/app/lib/i18n/server"
import { reportValidationFailure } from "@/app/lib/observability/server"
import { OBSERVABILITY_OPERATIONS } from "@/app/lib/observability/semantic"
import {
  MarketChartAnnotationRequest,
  MarketChartAnnotationResponse,
  MarketChartCandleRequest,
  MarketChartCandleResponse,
  MarketChartEconomicCalendarEventRequest,
  MarketChartEconomicCalendarEventResponse,
  getMarketChartAnnotationRequestSchema,
  getMarketChartCandleRequestSchema,
  getMarketChartEconomicCalendarEventRequestSchema,
  marketChartAnnotationResponseSchema,
  marketChartCandleResponseSchema,
  marketChartEconomicCalendarEventResponseSchema,
} from "@/app/lib/market-charts/definitions"

function createMarketChartCandleQuery(request: MarketChartCandleRequest) {
  const query = new URLSearchParams()

  query.set("assetId", String(request.assetId))
  query.set("timeframe", request.timeframe)
  query.set("to", request.to)
  query.set("countBack", String(request.countBack))

  return query.toString()
}

function createMarketChartAnnotationQuery(
  request: MarketChartAnnotationRequest
) {
  const query = new URLSearchParams()

  query.set("assetId", String(request.assetId))
  query.set("from", request.from)
  query.set("to", request.to)

  return query.toString()
}

function createMarketChartEconomicCalendarEventQuery(
  request: MarketChartEconomicCalendarEventRequest
) {
  const query = new URLSearchParams()

  query.set("assetId", String(request.assetId))
  query.set("from", request.from)
  query.set("to", request.to)
  request.impact.forEach((impact) => query.append("impact", impact))

  return query.toString()
}

export async function getMarketChartCandles(
  request: MarketChartCandleRequest
): Promise<ActionResult<MarketChartCandleResponse>> {
  const dictionary = await getDictionary(await getRequestLocale())
  const parsedRequest =
    getMarketChartCandleRequestSchema(dictionary).safeParse(request)

  if (!parsedRequest.success) {
    return {
      success: false,
      error:
        parsedRequest.error.issues[0]?.message ||
        dictionary.marketCharts.validationInvalid,
    }
  }

  try {
    const response = await fetchAuthenticated<unknown>(
      `/market-charts/candles?${createMarketChartCandleQuery(parsedRequest.data)}`
    )
    const parsedResponse = marketChartCandleResponseSchema.safeParse(response)

    if (!parsedResponse.success) {
      reportValidationFailure(
        OBSERVABILITY_OPERATIONS.backendRequest,
        { feature: "market_chart", route: "/market-charts/candles" },
        parsedResponse.error.issues
      )
      return {
        success: false,
        error: dictionary.marketCharts.responseInvalid,
      }
    }

    if (
      parsedResponse.data.asset.id !== parsedRequest.data.assetId ||
      parsedResponse.data.timeframe !== parsedRequest.data.timeframe
    ) {
      reportValidationFailure(
        OBSERVABILITY_OPERATIONS.backendRequest,
        { feature: "market_chart", route: "/market-charts/candles" },
        [{ code: "identity_mismatch", path: ["asset", "id"] }]
      )
      return {
        success: false,
        error: dictionary.marketCharts.responseInvalid,
      }
    }

    if (
      parsedResponse.data.candles.length === 0 &&
      (Date.parse(parsedResponse.data.from) !==
        Date.parse(parsedRequest.data.to) ||
        Date.parse(parsedResponse.data.to) !==
          Date.parse(parsedRequest.data.to))
    ) {
      reportValidationFailure(
        OBSERVABILITY_OPERATIONS.backendRequest,
        { feature: "market_chart", route: "/market-charts/candles" },
        [{ code: "anchor_mismatch", path: ["candles"] }]
      )
      return {
        success: false,
        error: dictionary.marketCharts.responseInvalid,
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
          : dictionary.marketCharts.loadError,
    }
  }
}

export async function getMarketChartAnnotations(
  request: MarketChartAnnotationRequest
): Promise<ActionResult<MarketChartAnnotationResponse[]>> {
  const dictionary = await getDictionary(await getRequestLocale())
  const parsedRequest =
    getMarketChartAnnotationRequestSchema(dictionary).safeParse(request)

  if (!parsedRequest.success) {
    return {
      success: false,
      error:
        parsedRequest.error.issues[0]?.message ||
        dictionary.marketCharts.validationInvalid,
    }
  }

  try {
    const response = await fetchAuthenticated<unknown>(
      `/market-charts/annotations?${createMarketChartAnnotationQuery(parsedRequest.data)}`
    )
    const parsedResponse = z
      .array(marketChartAnnotationResponseSchema)
      .safeParse(response)

    if (!parsedResponse.success) {
      reportValidationFailure(
        OBSERVABILITY_OPERATIONS.backendRequest,
        { feature: "market_chart", route: "/market-charts/annotations" },
        parsedResponse.error.issues
      )
      return {
        success: false,
        error: dictionary.marketCharts.responseInvalid,
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
          : dictionary.marketCharts.loadError,
    }
  }
}

export async function getMarketChartEconomicCalendarEvents(
  request: MarketChartEconomicCalendarEventRequest
): Promise<ActionResult<MarketChartEconomicCalendarEventResponse[]>> {
  const dictionary = await getDictionary(await getRequestLocale())
  const parsedRequest =
    getMarketChartEconomicCalendarEventRequestSchema(dictionary).safeParse(
      request
    )

  if (!parsedRequest.success) {
    return {
      success: false,
      error:
        parsedRequest.error.issues[0]?.message ||
        dictionary.marketCharts.validationInvalid,
    }
  }

  try {
    const response = await fetchAuthenticated<unknown>(
      `/market-charts/economic-calendar-events?${createMarketChartEconomicCalendarEventQuery(parsedRequest.data)}`
    )
    const parsedResponse = z
      .array(marketChartEconomicCalendarEventResponseSchema)
      .safeParse(response)

    if (!parsedResponse.success) {
      reportValidationFailure(
        OBSERVABILITY_OPERATIONS.backendRequest,
        {
          feature: "market_chart",
          route: "/market-charts/economic-calendar-events",
        },
        parsedResponse.error.issues
      )
      return {
        success: false,
        error: dictionary.marketCharts.calendar.responseInvalid,
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
          : dictionary.marketCharts.calendar.loadError,
    }
  }
}
