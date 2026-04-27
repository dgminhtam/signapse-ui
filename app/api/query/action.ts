"use server"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { ActionResult } from "@/app/lib/definitions"
import {
  MarketQueryRequest,
  MarketQueryResponse,
  marketQueryRequestSchema,
  marketQueryResponseSchema,
} from "@/app/lib/market-query/definitions"

export async function queryMarket(
  request: MarketQueryRequest
): Promise<ActionResult<MarketQueryResponse>> {
  const parsedRequest = marketQueryRequestSchema.safeParse(request)

  if (!parsedRequest.success) {
    return {
      success: false,
      error: parsedRequest.error.issues[0]?.message || "Yêu cầu truy vấn không hợp lệ.",
    }
  }

  try {
    const payload: MarketQueryRequest = {
      question: parsedRequest.data.question,
    }

    if (typeof parsedRequest.data.asOfTime === "string" && parsedRequest.data.asOfTime.trim()) {
      payload.asOfTime = parsedRequest.data.asOfTime
    }

    const response = await fetchAuthenticated<unknown>("/query", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    const parsedResponse = marketQueryResponseSchema.safeParse(response)

    if (!parsedResponse.success) {
      console.error("Market query response validation failed", parsedResponse.error.issues)
      return {
        success: false,
        error: "Hệ thống trả về dữ liệu truy vấn không đúng định dạng mong đợi.",
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
          : "Không thể thực hiện truy vấn thị trường trong lúc này.",
    }
  }
}
