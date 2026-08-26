import { getPersonalFeedback } from "@/app/api/feedback/action"
import { mapFeedbackListItem } from "@/app/lib/feedback/mappers"
import { getServerDictionary } from "@/app/lib/i18n/server"

import { FeedbackListPage } from "./feedback-list"

interface FeedbackPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function FeedbackPage({
  searchParams,
}: FeedbackPageProps) {
  const query = await searchParams
  const requestedPage = Number(
    Array.isArray(query.page) ? query.page[0] : query.page
  )
  const page = Number.isInteger(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1
  const dictionary = await getServerDictionary()

  let response: Awaited<ReturnType<typeof getPersonalFeedback>> | null = null
  try {
    response = await getPersonalFeedback({ page, size: 10 })
  } catch {
    response = null
  }

  return (
    <FeedbackListPage
      initialPage={
        response
          ? {
              ...response,
              content: response.content.map(mapFeedbackListItem),
            }
          : null
      }
      initialError={
        response ? undefined : dictionary.feedback.historyErrorDescription
      }
    />
  )
}
