import { NextRequest, NextResponse } from "next/server"

import { getClerkToken } from "@/app/api/auth/action"
import { getDictionary } from "@/app/lib/i18n/dictionaries"
import { getRequestLocale } from "@/app/lib/i18n/server"
import {
  isMarketChartTimeframe,
  marketChartLiveRequestSchema,
} from "@/app/lib/market-charts/definitions"

export async function GET(request: NextRequest) {
  const dictionary = await getDictionary(await getRequestLocale())
  const messages = dictionary.marketCharts.live
  const assetId = Number(request.nextUrl.searchParams.get("assetId"))
  const timeframe = request.nextUrl.searchParams.get("timeframe") ?? ""
  const parsedRequest = marketChartLiveRequestSchema.safeParse({
    assetId,
    timeframe,
  })

  if (!parsedRequest.success || !isMarketChartTimeframe(timeframe)) {
    return NextResponse.json(
      { message: messages.requestInvalid },
      { status: 400 }
    )
  }

  const apiBaseUrl = process.env.API_BASE_URL

  if (!apiBaseUrl) {
    return NextResponse.json(
      { message: messages.apiBaseMissing },
      { status: 500 }
    )
  }

  try {
    const token = await getClerkToken()
    const url = new URL("/market-charts/live", apiBaseUrl)

    url.searchParams.set("assetId", String(parsedRequest.data.assetId))
    url.searchParams.set("timeframe", parsedRequest.data.timeframe)

    const response = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        Accept: "text/event-stream",
        Authorization: `Bearer ${token}`,
      },
      signal: request.signal,
    })

    if (!response.ok) {
      const errorText = await response.text()

      return new NextResponse(errorText || messages.openError, {
        status: response.status,
      })
    }

    if (!response.body) {
      return new NextResponse(messages.emptyStream, {
        status: 502,
      })
    }

    return new Response(response.body, {
      headers: {
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "Content-Type": "text/event-stream",
      },
      status: 200,
    })
  } catch (error) {
    if (request.signal.aborted) {
      return new NextResponse(null, { status: 204 })
    }

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : messages.openError,
      },
      { status: 500 }
    )
  }
}
