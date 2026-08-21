import { ArrowUpRightIcon, Calendar, Globe2 } from "lucide-react"
import Image from "next/image"

import { AppLocale } from "@/app/lib/i18n/config"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import { formatDateTime as formatLocalizedDateTime } from "@/app/lib/i18n/format"
import type { NewsArticleResponse } from "@/app/lib/news-articles/definitions"
import { AppTimeMetadata } from "@/components/app-time-metadata"
import { Badge } from "@/components/ui/badge"

import { NewsArticleMarkdown } from "./news-article-markdown"

function formatDateTime(
  value: string | null | undefined,
  locale: AppLocale,
  dictionary: Dictionary
) {
  if (!value) {
    return dictionary.common.notAvailable
  }

  return formatLocalizedDateTime(
    value,
    locale,
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    },
    dictionary.common.notAvailable
  )
}

function getImageUrl(article: NewsArticleResponse) {
  return (
    article.featureImage?.urlMedium ||
    article.featureImage?.urlLarge ||
    article.featureImage?.urlOriginal
  )
}

export function NewsArticleQuickDetailContent({
  article,
  dictionary,
  locale,
}: {
  article: NewsArticleResponse
  dictionary: Dictionary
  locale: AppLocale
}) {
  const imageUrl = getImageUrl(article)
  const description = article.description?.trim()

  return (
    <div className="flex flex-col gap-4">
      {description ? (
        <p className="whitespace-pre-wrap text-muted-foreground">
          {description}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <AppTimeMetadata icon={Globe2}>
          {article.sourceName?.trim() || dictionary.newsArticles.noOutlet}
        </AppTimeMetadata>
        <AppTimeMetadata icon={Calendar}>
          {formatDateTime(article.publishedAt, locale, dictionary)}
        </AppTimeMetadata>
        {article.url ? (
          <Badge
            className="min-h-6"
            render={
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            {dictionary.newsArticles.openOriginalLink}
            <ArrowUpRightIcon aria-hidden="true" data-icon="inline-end" />
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-col gap-4">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={article.featureImage?.altText?.trim() || article.title}
            width={800}
            height={450}
          />
        ) : null}

        <NewsArticleMarkdown
          className="max-w-none"
          content={
            article.content?.trim() || dictionary.newsArticles.contentEmpty
          }
        />
      </div>
    </div>
  )
}
