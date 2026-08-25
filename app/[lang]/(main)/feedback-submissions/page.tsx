import { notFound } from "next/navigation"

import { isP0FixtureModeEnabled } from "@/app/lib/dev-auth-mode"
import { FEEDBACK_READ_PERMISSION } from "@/app/lib/feedback/permissions"
import { getServerDictionary } from "@/app/lib/i18n/server"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { hasPermission } from "@/app/lib/permissions"
import { AccessDenied } from "@/components/access-denied"

import { FeedbackQueuePage } from "./feedback-queue"

export default async function FeedbackSubmissionsPage() {
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

  return <FeedbackQueuePage />
}
