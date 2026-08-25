import { notFound } from "next/navigation"

import { isP0FixtureModeEnabled } from "@/app/lib/dev-auth-mode"
import { FEEDBACK_READ_PERMISSION } from "@/app/lib/feedback/permissions"
import { getServerDictionary } from "@/app/lib/i18n/server"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { hasPermission } from "@/app/lib/permissions"
import { AccessDenied } from "@/components/access-denied"

import { FeedbackDetailPage } from "../../feedback/feedback-detail"

interface FeedbackModerationDetailRouteProps {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function FeedbackModerationDetailRoute({
  params,
  searchParams,
}: FeedbackModerationDetailRouteProps) {
  if (!isP0FixtureModeEnabled()) {
    notFound()
  }

  const permissions = await getCurrentPermissions()
  const dictionary = await getServerDictionary()
  if (!hasPermission(permissions, FEEDBACK_READ_PERMISSION)) {
    return (
      <AccessDenied
        description={dictionary.feedback.readDenied}
        permission={FEEDBACK_READ_PERMISSION}
      />
    )
  }

  const [{ id }, query] = await Promise.all([params, searchParams])
  const backQuery = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      value.forEach((item) => backQuery.append(key, item))
    } else if (value) {
      backQuery.set(key, value)
    }
  }
  const queryString = backQuery.toString()

  return (
    <FeedbackDetailPage
      id={id}
      moderation
      backHref={
        queryString ? `/feedback-submissions?${queryString}` : undefined
      }
    />
  )
}
