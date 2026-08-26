import { NextRequest } from "next/server"

import { proxyFeedbackScreenshot } from "@/app/api/feedback/screenshot"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  return proxyFeedbackScreenshot(request, id, "personal")
}
