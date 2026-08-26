import { notFound } from "next/navigation"

import { getPersonalFeedbackDetail } from "@/app/api/feedback/action"
import { mapFeedbackDetail } from "@/app/lib/feedback/mappers"
import { getServerDictionary } from "@/app/lib/i18n/server"

import { FeedbackDetailPage } from "../feedback-detail"

interface FeedbackDetailRouteProps {
  params: Promise<{ id: string }>
}

export default async function FeedbackDetailRoute({
  params,
}: FeedbackDetailRouteProps) {
  const { id } = await params
  const numericId = Number(id)
  if (!Number.isInteger(numericId) || numericId <= 0) {
    notFound()
  }

  let record = null
  let initialError: string | undefined
  try {
    const response = await getPersonalFeedbackDetail(numericId)
    record = mapFeedbackDetail(response)
  } catch {
    const dictionary = await getServerDictionary()
    initialError = dictionary.feedback.missingDescription
  }

  return <FeedbackDetailPage record={record} initialError={initialError} />
}
