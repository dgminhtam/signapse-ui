import { Calendar, ExternalLink, Globe2 } from "lucide-react"
import dynamic from "next/dynamic"

import { AppLocale } from "@/app/lib/i18n/config"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import { formatDateTime as formatLocalizedDateTime } from "@/app/lib/i18n/format"
import { NewsArticleResponse } from "@/app/lib/news-articles/definitions"
import { AppTimeMetadata } from "@/components/app-time-metadata"

const NewsArticleMarkdown = dynamic(() =>
  import("./news-article-markdown").then((module) => module.NewsArticleMarkdown)
)

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
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      month: "2-digit",
      year: "numeric",
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
    <div className="flex flex-col gap-5">
      {description ? (
        <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
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
        <AppTimeMetadata icon={ExternalLink}>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            {dictionary.newsArticles.openOriginalLink}
          </a>
        </AppTimeMetadata>
      </div>

      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={article.featureImage?.altText?.trim() || article.title}
          className="aspect-video max-h-56 w-full rounded-lg object-cover"
        />
      ) : null}

      <NewsArticleMarkdown
        className="max-w-none"
        content={article.content?.trim() || dictionary.newsArticles.contentEmpty}
      />
    </div>
  )
}
