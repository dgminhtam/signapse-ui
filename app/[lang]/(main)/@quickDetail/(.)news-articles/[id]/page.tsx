import { notFound } from "next/navigation"

import { getNewsArticleById } from "@/app/api/news-articles/action"
import { getRequestLocale, getServerDictionary } from "@/app/lib/i18n/server"
import { EVENT_READ_PERMISSIONS } from "@/app/lib/events/permissions"
import { NEWS_ARTICLE_READ_PERMISSIONS } from "@/app/lib/news-articles/permissions"
import { hasAnyPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { EntityQuickDetailDrawer } from "@/components/entity-quick-detail-drawer"

import { NewsArticleQuickDetailContent } from "../../../news-articles/news-article-quick-detail-content"

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

async function getNewsArticleOrNotFound(newsArticleId: number) {
  try {
    return await getNewsArticleById(newsArticleId)
  } catch (error) {
    if (isNotFoundError(error)) {
      notFound()
    }

    throw error
  }
}

export default async function NewsArticleQuickDetailRoute({ params }: PageProps) {
  const { id } = await params
  const newsArticleId = Number(id)

  if (!Number.isInteger(newsArticleId) || newsArticleId <= 0) {
    notFound()
  }

  const permissions = await getCurrentPermissions()
  const locale = await getRequestLocale()
  const dictionary = await getServerDictionary()
  const fullDetailHref = `/news-articles/${newsArticleId}`

  if (!hasAnyPermission(permissions, NEWS_ARTICLE_READ_PERMISSIONS)) {
    return (
      <EntityQuickDetailDrawer
        title={dictionary.newsArticles.quickAccessDeniedTitle}
        description={dictionary.newsArticles.quickAccessDeniedDescription}
        fullDetailHref={fullDetailHref}
      >
        <AccessDenied
          description={dictionary.newsArticles.detailDenied}
          permission={NEWS_ARTICLE_READ_PERMISSIONS[0]}
        />
      </EntityQuickDetailDrawer>
    )
  }

  const article = await getNewsArticleOrNotFound(newsArticleId)
  const canReadEvents = hasAnyPermission(permissions, EVENT_READ_PERMISSIONS)

  return (
    <EntityQuickDetailDrawer
      title={article.title}
      description={dictionary.newsArticles.quickDescription}
      fullDetailHref={fullDetailHref}
    >
      <NewsArticleQuickDetailContent
        article={article}
        canReadEvents={canReadEvents}
        dictionary={dictionary}
        locale={locale}
      />
    </EntityQuickDetailDrawer>
  )
}
