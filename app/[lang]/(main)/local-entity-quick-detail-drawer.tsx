"use client"

import { AlertTriangle, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"

import { getEventById } from "@/app/api/events/action"
import { getNewsArticleById } from "@/app/api/news-articles/action"
import { EVENT_READ_PERMISSIONS } from "@/app/lib/events/permissions"
import type { EventResponse } from "@/app/lib/events/definitions"
import { useLocalization } from "@/app/lib/i18n/provider"
import { NEWS_ARTICLE_READ_PERMISSIONS } from "@/app/lib/news-articles/permissions"
import type { NewsArticleResponse } from "@/app/lib/news-articles/definitions"
import { AccessDenied } from "@/components/access-denied"
import { LocalizedLink } from "@/components/localized-link"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { useHasAnyPermission } from "@/components/permission-provider"

import { EventQuickDetailContent } from "./events/event-quick-detail-content"
import { NewsArticleQuickDetailContent } from "./news-articles/news-article-quick-detail-content"

export type LocalQuickDetailEntity =
  | { id: number; kind: "event" }
  | { id: number; kind: "news-article" }

type DetailState =
  | { phase: "idle" }
  | { event: EventResponse; key: string; phase: "event" }
  | { article: NewsArticleResponse; key: string; phase: "news-article" }
  | { error: string; key: string; phase: "error" }

interface LocalEntityQuickDetailDrawerProps {
  entity: LocalQuickDetailEntity | null
  onClose: () => void
}

function getEntityFullDetailHref(entity: LocalQuickDetailEntity) {
  return entity.kind === "event"
    ? `/events/${entity.id}`
    : `/news-articles/${entity.id}`
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : null
}

export function LocalEntityQuickDetailDrawer({
  entity,
  onClose,
}: LocalEntityQuickDetailDrawerProps) {
  const { dictionary, locale } = useLocalization()
  const canReadEvents = useHasAnyPermission(EVENT_READ_PERMISSIONS)
  const canReadNewsArticles = useHasAnyPermission(NEWS_ARTICLE_READ_PERMISSIONS)
  const [state, setState] = useState<DetailState>({ phase: "idle" })
  const open = Boolean(entity)
  const entityKey = entity ? `${entity.kind}:${entity.id}` : null
  const canReadSelectedEntity =
    entity?.kind === "event"
      ? canReadEvents
      : entity?.kind === "news-article"
        ? canReadNewsArticles
        : true
  const currentState =
    state.phase !== "idle" && state.key === entityKey ? state : null
  const title =
    !canReadSelectedEntity && entity?.kind === "event"
      ? dictionary.events.quickAccessDeniedTitle
      : !canReadSelectedEntity && entity?.kind === "news-article"
        ? dictionary.newsArticles.quickAccessDeniedTitle
        : currentState?.phase === "event"
          ? currentState.event.title
          : currentState?.phase === "news-article"
            ? currentState.article.title
            : currentState?.phase === "error"
              ? dictionary.quickDetail.errorTitle
              : dictionary.common.loading
  const fullDetailHref = entity ? getEntityFullDetailHref(entity) : null

  useEffect(() => {
    if (!entity || !entityKey || !canReadSelectedEntity) {
      return
    }

    const currentEntity = entity
    const currentEntityKey = entityKey
    let isActive = true

    async function loadDetail() {
      try {
        if (currentEntity.kind === "event") {
          const event = await getEventById(currentEntity.id)

          if (isActive) {
            setState({ event, key: currentEntityKey, phase: "event" })
          }

          return
        }

        const article = await getNewsArticleById(currentEntity.id)

        if (isActive) {
          setState({ article, key: currentEntityKey, phase: "news-article" })
        }
      } catch (error) {
        if (isActive) {
          setState({
            error: getErrorMessage(error) ?? dictionary.quickDetail.errorTitle,
            key: currentEntityKey,
            phase: "error",
          })
        }
      }
    }

    void loadDetail()

    return () => {
      isActive = false
    }
  }, [
    canReadSelectedEntity,
    dictionary.quickDetail.errorTitle,
    entity,
    entityKey,
  ])

  return (
    <Drawer open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DrawerContent
        className="gap-0 overflow-hidden"
        style={{
          height: "min(90svh, 960px)",
          maxHeight: "min(90svh, 960px)",
        }}
      >
        <DrawerHeader className="border-b px-5 py-4 text-left">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-1.5">
            <DrawerTitle className="line-clamp-2 leading-snug">
              {title}
            </DrawerTitle>
          </div>
        </DrawerHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div className="mx-auto w-full max-w-5xl">
            {!entity ? null : !canReadSelectedEntity ? (
              <AccessDenied
                description={
                  entity.kind === "event"
                    ? dictionary.events.detailDenied
                    : dictionary.newsArticles.detailDenied
                }
                permission={
                  entity.kind === "event"
                    ? EVENT_READ_PERMISSIONS[0]
                    : NEWS_ARTICLE_READ_PERMISSIONS[0]
                }
              />
            ) : !currentState ? (
              <div className="flex min-h-[320px] items-center justify-center text-sm text-muted-foreground">
                <Spinner className="size-4" />
                <span className="ml-2">{dictionary.common.loading}</span>
              </div>
            ) : currentState.phase === "error" ? (
              <Empty className="min-h-[320px] rounded-lg border border-dashed">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <AlertTriangle />
                  </EmptyMedia>
                  <EmptyTitle>{dictionary.quickDetail.errorTitle}</EmptyTitle>
                  <EmptyDescription>{currentState.error}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : currentState.phase === "event" ? (
              <EventQuickDetailContent
                canReadNewsArticles={canReadNewsArticles}
                dictionary={dictionary}
                event={currentState.event}
                locale={locale}
              />
            ) : currentState.phase === "news-article" ? (
              <NewsArticleQuickDetailContent
                article={currentState.article}
                dictionary={dictionary}
                locale={locale}
              />
            ) : null}
          </div>
        </div>

        <DrawerFooter className="border-t bg-muted/20 px-5 py-3">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 sm:flex-row sm:justify-end">
            {fullDetailHref ? (
              <Button asChild variant="outline">
                <LocalizedLink href={fullDetailHref}>
                  <ExternalLink aria-hidden="true" data-icon="inline-start" />
                  {dictionary.common.openFullPage}
                </LocalizedLink>
              </Button>
            ) : null}
            <Button type="button" onClick={onClose}>
              {dictionary.common.close}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
