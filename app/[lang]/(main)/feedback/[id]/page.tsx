import { notFound } from "next/navigation"

import { isP0FixtureModeEnabled } from "@/app/lib/dev-auth-mode"

import { FeedbackDetailPage } from "../feedback-detail"

interface FeedbackDetailRouteProps {
  params: Promise<{ id: string }>
}

export default async function FeedbackDetailRoute({
  params,
}: FeedbackDetailRouteProps) {
  if (!isP0FixtureModeEnabled()) {
    notFound()
  }

  const { id } = await params
  return <FeedbackDetailPage id={id} />
}
