import { notFound } from "next/navigation"

import { getEventById } from "@/app/api/events/action"
import { NEWS_ARTICLE_READ_PERMISSIONS } from "@/app/lib/news-articles/permissions"
import { hasAnyPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { EVENT_READ_PERMISSIONS } from "@/app/lib/events/permissions"
import { AccessDenied } from "@/components/access-denied"
import { EntityQuickDetailDrawer } from "@/components/entity-quick-detail-drawer"

import { EventQuickDetailContent } from "../../../events/event-quick-detail-content"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

type ApiLikeError = Error & { status?: number }

function isNotFoundError(error: unknown) {
  if (!(error instanceof Error)) {
    return false
  }

  if ((error as ApiLikeError).status === 404) {
    return true
  }

  return /(?:^|\b)(?:404|not[\s-]?found)(?:\b|$)/i.test(error.message)
}

async function getEventOrNotFound(eventId: number) {
  try {
    return await getEventById(eventId)
  } catch (error) {
    if (isNotFoundError(error)) {
      notFound()
    }

    throw error
  }
}

export default async function EventQuickDetailRoute({ params }: PageProps) {
  const { id } = await params
  const eventId = Number(id)

  if (!Number.isInteger(eventId) || eventId <= 0) {
    notFound()
  }

  const permissions = await getCurrentPermissions()
  const fullDetailHref = `/events/${eventId}`

  if (!hasAnyPermission(permissions, EVENT_READ_PERMISSIONS)) {
    return (
      <EntityQuickDetailDrawer
        title="Không có quyền xem sự kiện"
        description="Bạn không thể xem chi tiết sự kiện từ biểu đồ tri thức."
        fullDetailHref={fullDetailHref}
      >
        <AccessDenied
          description="Bạn không có quyền xem chi tiết sự kiện."
          permission={EVENT_READ_PERMISSIONS[0]}
        />
      </EntityQuickDetailDrawer>
    )
  }

  const event = await getEventOrNotFound(eventId)
  const canReadNewsArticles = hasAnyPermission(
    permissions,
    NEWS_ARTICLE_READ_PERMISSIONS
  )

  return (
    <EntityQuickDetailDrawer
      title={event.title}
      description="Chi tiết sự kiện từ biểu đồ tri thức."
      fullDetailHref={fullDetailHref}
    >
      <EventQuickDetailContent
        event={event}
        canReadNewsArticles={canReadNewsArticles}
      />
    </EntityQuickDetailDrawer>
  )
}
