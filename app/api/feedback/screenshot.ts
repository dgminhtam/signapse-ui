import { NextRequest, NextResponse } from "next/server"

import { getBackendAuthHeaders } from "@/app/api/auth/action"
import { getRequestLocale } from "@/app/lib/i18n/server"
import { injectTraceContextForBackend } from "@/app/lib/observability/server"

const SCREENSHOT_MIME_TYPES = new Set(["image/png", "image/jpeg"])

export async function proxyFeedbackScreenshot(
  request: NextRequest,
  id: string,
  scope: "personal" | "moderation"
): Promise<NextResponse> {
  const invalidId = !/^\d+$/.test(id) || Number(id) <= 0
  if (invalidId) {
    return new NextResponse(null, { status: 404 })
  }

  const baseUrl = process.env.API_BASE_URL
  if (!baseUrl) {
    return new NextResponse(null, { status: 502 })
  }

  const backendPath =
    scope === "personal"
      ? `/me/feedback-submissions/${id}/screenshot`
      : `/feedback-submissions/${id}/screenshot`

  try {
    const locale = await getRequestLocale()
    const authHeaders = await getBackendAuthHeaders()
    const url = new URL(backendPath, baseUrl)
    injectTraceContextForBackend(authHeaders, url.toString(), baseUrl)
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "image/png, image/jpeg",
        "Accept-Language": locale,
        ...authHeaders,
      },
      signal: request.signal,
      opentelemetry: {
        ignore: true,
        propagateContext: false,
      },
    })

    if (!response.ok) {
      return new NextResponse(null, { status: response.status })
    }

    const mimeType = response.headers.get("content-type")?.split(";", 1)[0]
    if (!mimeType || !SCREENSHOT_MIME_TYPES.has(mimeType) || !response.body) {
      return new NextResponse(null, { status: 502 })
    }

    return new NextResponse(await response.arrayBuffer(), {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Disposition": "inline",
        "Content-Type": mimeType,
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch {
    // Screenshot failures are intentionally isolated from the detail response.
    // The caller receives only a retryable status, never backend/storage detail.
    return new NextResponse(null, { status: 502 })
  }
}
