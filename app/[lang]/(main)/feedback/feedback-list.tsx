"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { FEEDBACK_PAGE_SIZE } from "@/app/lib/feedback/definitions"
import { useFeedbackFixture } from "@/app/lib/feedback/fixture-provider"
import { useLocalization } from "@/app/lib/i18n/provider"
import { LocalizedLink as Link } from "@/components/localized-link"
import { FeedbackComposeDialog } from "@/components/feedback/feedback-compose-dialog"
import { AppPaginationControls } from "@/components/app-pagination-controls"
import {
  AppListTable,
  AppListTableHead,
  AppListTableHeaderRow,
} from "@/components/app-list-table"
import {
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Empty,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  FeedbackScreenshotView,
  FeedbackStatusBadge,
  FeedbackTypeBadge,
} from "./feedback-presentation"

export function FeedbackListPage() {
  const { dictionary, formatDateTime } = useLocalization()
  const { personalRecords } = useFeedbackFixture()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [composeOpen, setComposeOpen] = React.useState(false)
  const isHydrated = React.useSyncExternalStore(
    React.useCallback(() => () => undefined, []),
    () => true,
    () => false
  )

  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const totalPages = Math.max(
    1,
    Math.ceil(personalRecords.length / FEEDBACK_PAGE_SIZE)
  )
  const visibleRecords = personalRecords.slice(
    (page - 1) * FEEDBACK_PAGE_SIZE,
    page * FEEDBACK_PAGE_SIZE
  )
  const isEmptyState = searchParams.get("state") === "empty"
  const hasNoPageResults =
    personalRecords.length > 0 && visibleRecords.length === 0

  function openCompose() {
    setComposeOpen(true)
  }

  function retry() {
    router.refresh()
  }

  if (!isHydrated) {
    return <FeedbackListSkeleton />
  }

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {dictionary.feedback.pageTitle}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {dictionary.feedback.pageDescription}
          </p>
        </div>
        <Button type="button" className="shrink-0" onClick={openCompose}>
          <Plus data-icon="inline-start" />
          {dictionary.feedback.newAction}
        </Button>
      </div>

      {searchParams.get("state") === "error" ? (
        <EmptyState
          title={dictionary.feedback.historyErrorTitle}
          description={dictionary.feedback.historyErrorDescription}
          actionLabel={dictionary.feedback.historyRetry}
          onAction={retry}
        />
      ) : isEmptyState || personalRecords.length === 0 ? (
        <EmptyState
          title={dictionary.feedback.historyEmptyTitle}
          description={dictionary.feedback.historyEmptyDescription}
          actionLabel={dictionary.feedback.newAction}
          onAction={openCompose}
        />
      ) : hasNoPageResults ? (
        <EmptyState
          title={dictionary.feedback.queueNoResultsTitle}
          description={dictionary.feedback.queueNoResultsDescription}
          actionLabel={dictionary.common.back}
          onAction={() => {
            const next = new URLSearchParams(searchParams)
            next.set("page", "1")
            router.push(`${pathname}?${next.toString()}`)
          }}
        />
      ) : (
        <>
          <AppListTable>
            <Table>
              <TableHeader>
                <AppListTableHeaderRow>
                  <AppListTableHead>
                    {dictionary.feedback.titleColumn}
                  </AppListTableHead>
                  <AppListTableHead className="w-28">
                    {dictionary.feedback.typeColumn}
                  </AppListTableHead>
                  <AppListTableHead className="w-48">
                    {dictionary.feedback.statusColumn}
                  </AppListTableHead>
                  <AppListTableHead className="w-48">
                    {dictionary.feedback.submittedColumn}
                  </AppListTableHead>
                  <AppListTableHead className="w-28">
                    {dictionary.feedback.screenshotColumn}
                  </AppListTableHead>
                </AppListTableHeaderRow>
              </TableHeader>
              <TableBody>
                {visibleRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="max-w-0 align-top whitespace-normal">
                      <Link
                        href={`/feedback/${record.id}`}
                        className="line-clamp-2 font-medium break-words text-foreground hover:underline"
                      >
                        {record.title}
                      </Link>
                    </TableCell>
                    <TableCell className="align-top">
                      <FeedbackTypeBadge type={record.type} />
                    </TableCell>
                    <TableCell className="align-top">
                      <FeedbackStatusBadge status={record.status} />
                    </TableCell>
                    <TableCell className="align-top text-sm text-muted-foreground">
                      {formatDateTime(record.createdAt, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="align-top">
                      <FeedbackScreenshotView
                        screenshot={record.screenshot}
                        compact
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AppListTable>
          <AppPaginationControls
            page={{
              number: page - 1,
              numberOfElements: visibleRecords.length,
              size: FEEDBACK_PAGE_SIZE,
              totalElements: personalRecords.length,
              totalPages,
            }}
          />
        </>
      )}

      <FeedbackComposeDialog open={composeOpen} onOpenChange={setComposeOpen} />
    </div>
  )
}

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string
  description: string
  actionLabel: string
  onAction: () => void
}) {
  return (
    <Empty className="min-h-[280px] border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Plus />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <Button type="button" onClick={onAction}>
        {actionLabel}
      </Button>
    </Empty>
  )
}

function FeedbackListSkeleton() {
  const { dictionary } = useLocalization()

  return (
    <div
      className="flex min-w-0 flex-col gap-6"
      role="status"
      aria-busy="true"
      aria-label={dictionary.feedback.personalListLoading}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>
      <AppListTable>
        <Table>
          <TableHeader>
            <AppListTableHeaderRow>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableHead key={index}>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
            </AppListTableHeaderRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 5 }).map((__, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton className="h-5 w-full max-w-48" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AppListTable>
    </div>
  )
}
