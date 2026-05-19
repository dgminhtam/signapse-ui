"use client"

import React from "react"
import { LocalizedLink as Link } from "@/components/localized-link"
import { usePathname } from "next/navigation"

import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import { useLocalization } from "@/app/lib/i18n/provider"
import { stripLocaleFromPathname } from "@/app/lib/i18n/routing"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb"

function getFriendlySegmentNames(
  dictionary: Dictionary
): Record<string, string> {
  return {
    categories: dictionary.navigation.categories,
    create: dictionary.common.create,
    "ai-provider-configs": dictionary.navigation.aiProviders,
    blogs: dictionary.navigation.blogs,
    cronjobs: dictionary.navigation.cronjobs,
    "developer-token": dictionary.navigation.developerToken,
    "economic-calendar": dictionary.navigation.economicCalendar,
    events: dictionary.navigation.events,
    "graph-view": dictionary.navigation.knowledgeGraph,
    "market-charts": dictionary.navigation.marketCharts,
    "market-query": dictionary.navigation.marketQuery,
    "news-articles": dictionary.navigation.newsArticles,
    "news-outlets": dictionary.navigation.newsOutlets,
    roles: dictionary.navigation.roles,
    "source-documents": dictionary.navigation.sourceDocuments,
    "system-prompts": dictionary.navigation.systemPrompts,
  }
}

function formatSegment(
  segment: string,
  index: number,
  dictionary: Dictionary
) {
  const decodedSegment = decodeURIComponent(segment)
  const friendlySegmentNames = getFriendlySegmentNames(dictionary)

  if (friendlySegmentNames[decodedSegment]) {
    return friendlySegmentNames[decodedSegment]
  }

  if (index > 0) {
    return dictionary.common.detail
  }

  return decodedSegment
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function AppBreadcrumb() {
  const pathname = usePathname()
  const { dictionary } = useLocalization()
  const segments = stripLocaleFromPathname(pathname).split("/").filter(Boolean)

  return (
    <Breadcrumb className="min-w-0" aria-label={dictionary.navigation.breadcrumb}>
      <BreadcrumbList className="flex-nowrap">
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink asChild>
            <Link href="/">{dictionary.common.home}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`
          const isLast = index === segments.length - 1
          const title = formatSegment(segment, index, dictionary)

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className={!isLast ? "hidden md:block" : "min-w-0"}>
                {isLast ? (
                  <BreadcrumbPage className="max-w-[45vw] truncate md:max-w-[36rem]">
                    {title}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
