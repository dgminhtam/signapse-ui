"use client"

import * as React from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import {
  FEEDBACK_PAGE_SIZE,
  FEEDBACK_STATUSES,
  FEEDBACK_TYPES,
  type FeedbackStatus,
  type FeedbackType,
} from "@/app/lib/feedback/definitions"
import { FEEDBACK_READ_PERMISSION } from "@/app/lib/feedback/permissions"
import { useFeedbackFixture } from "@/app/lib/feedback/fixture-provider"
import { useLocalization } from "@/app/lib/i18n/provider"
import { LocalizedLink as Link } from "@/components/localized-link"
import { AccessDenied } from "@/components/access-denied"
import {
  AppListTable,
  AppListTableHead,
  AppListTableHeaderRow,
} from "@/components/app-list-table"
import {
  AppListToolbar,
  AppListToolbarLeading,
  AppListToolbarTrailing,
} from "@/components/app-list-toolbar"
import {
  PaginationNavigation,
  PaginationPageSizeSelect,
} from "@/components/app-pagination-controls"
import { Button } from "@/components/ui/button"
import {
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Empty,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
} from "../feedback/feedback-presentation"

const DEFAULT_SORT = "createdAt_desc"
const PAGE_SIZE_OPTIONS = [10, 20, 50]

export function FeedbackQueuePage() {
  const { dictionary, formatDateTime } = useLocalization()
  const t = dictionary.feedback
  const { moderationRecords, hasFeedbackPermission } = useFeedbackFixture()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isHydrated = React.useSyncExternalStore(
    React.useCallback(() => () => undefined, []),
    () => true,
    () => false
  )
  const [searchValue, setSearchValue] = React.useState(
    searchParams.get("search") ?? ""
  )

  React.useEffect(() => {
    // URL-backed draft state must follow browser Back/Forward changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchValue(searchParams.get("search") ?? "")
  }, [searchParams])

  const activeSearch = searchParams.get("search")?.trim().toLowerCase() ?? ""
  const requestedType = searchParams.get("type")
  const typeFilter = FEEDBACK_TYPES.includes(requestedType as FeedbackType)
    ? (requestedType as FeedbackType)
    : ""
  const requestedStatus = searchParams.get("status")
  const statusFilter = FEEDBACK_STATUSES.includes(
    requestedStatus as FeedbackStatus
  )
    ? (requestedStatus as FeedbackStatus)
    : "PENDING_REVIEW"
  const sort = searchParams.get("sort") ?? DEFAULT_SORT
  const pageSize = PAGE_SIZE_OPTIONS.includes(Number(searchParams.get("size")))
    ? Number(searchParams.get("size"))
    : FEEDBACK_PAGE_SIZE
  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const state = searchParams.get("state")

  const filteredRecords = React.useMemo(() => {
    const next = moderationRecords.filter((record) => {
      const matchesSearch =
        !activeSearch || record.title.toLowerCase().includes(activeSearch)
      const matchesType = !typeFilter || record.type === typeFilter
      const matchesStatus = record.status === statusFilter
      return matchesSearch && matchesType && matchesStatus
    })

    return [...next].sort((left, right) => {
      if (sort === "title_asc") return left.title.localeCompare(right.title)
      if (sort === "title_desc") return right.title.localeCompare(left.title)
      const direction = sort === "createdAt_asc" ? 1 : -1
      return (
        (new Date(left.createdAt).getTime() -
          new Date(right.createdAt).getTime()) *
        direction
      )
    })
  }, [activeSearch, moderationRecords, sort, statusFilter, typeFilter])

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize))
  const visibleRecords = filteredRecords.slice(
    (page - 1) * pageSize,
    page * pageSize
  )
  const hasNoPageResults =
    filteredRecords.length > 0 && visibleRecords.length === 0

  function updateQuery(updates: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams)
    for (const [key, value] of Object.entries(updates)) {
      if (!value) next.delete(key)
      else next.set(key, value)
    }
    router.push(`${pathname}?${next.toString()}`)
  }

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    updateQuery({ search: searchValue.trim() || null, page: "1" })
  }

  if (!isHydrated) {
    return <FeedbackQueueSkeleton />
  }

  if (!hasFeedbackPermission(FEEDBACK_READ_PERMISSION)) {
    return (
      <AccessDenied
        description={t.readDenied}
        permission={FEEDBACK_READ_PERMISSION}
      />
    )
  }

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="flex min-w-0 flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t.moderationTitle}
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          {t.moderationDescription}
        </p>
        <p className="text-xs text-muted-foreground">
          {t.moderationFixtureNote}
        </p>
      </div>

      <AppListToolbar>
        <AppListToolbarLeading>
          <form
            className="flex min-w-0 flex-1 items-center gap-2"
            onSubmit={submitSearch}
          >
            <label htmlFor="feedback-queue-search" className="sr-only">
              {t.queueSearchLabel}
            </label>
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="feedback-queue-search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder={t.queueSearchPlaceholder}
                className="pl-9"
                aria-label={t.queueSearchLabel}
              />
            </div>
            <Button type="submit" variant="outline">
              {t.queueSearchLabel}
            </Button>
          </form>
        </AppListToolbarLeading>
        <AppListToolbarTrailing>
          <Select
            value={typeFilter || "ALL"}
            onValueChange={(value) =>
              updateQuery({ type: value === "ALL" ? null : value, page: "1" })
            }
            items={[
              { value: "ALL", label: t.queueAllTypes },
              ...FEEDBACK_TYPES.map((type) => ({
                value: type,
                label: t.types[type],
              })),
            ]}
          >
            <SelectTrigger
              aria-label={t.queueTypeLabel}
              className="w-full sm:w-[150px]"
            >
              <SelectValue placeholder={t.queueAllTypes} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="ALL">{t.queueAllTypes}</SelectItem>
                {FEEDBACK_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {t.types[type]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              updateQuery({ status: value || null, page: "1" })
            }
            items={FEEDBACK_STATUSES.map((status) => ({
              value: status,
              label: t.statuses[status],
            }))}
          >
            <SelectTrigger
              aria-label={t.queueStatusLabel}
              className="w-full sm:w-[180px]"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {FEEDBACK_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {t.statuses[status]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={sort}
            onValueChange={(value) =>
              updateQuery({ sort: value || DEFAULT_SORT, page: "1" })
            }
            items={[
              { value: "createdAt_desc", label: t.queueSortNewest },
              { value: "createdAt_asc", label: t.queueSortOldest },
              { value: "title_asc", label: t.queueSortTitleAsc },
              { value: "title_desc", label: t.queueSortTitleDesc },
            ]}
          >
            <SelectTrigger
              aria-label={t.queueSortLabel}
              className="w-full sm:w-[180px]"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="createdAt_desc">
                  {t.queueSortNewest}
                </SelectItem>
                <SelectItem value="createdAt_asc">
                  {t.queueSortOldest}
                </SelectItem>
                <SelectItem value="title_asc">{t.queueSortTitleAsc}</SelectItem>
                <SelectItem value="title_desc">
                  {t.queueSortTitleDesc}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </AppListToolbarTrailing>
      </AppListToolbar>

      {state === "error" ? (
        <QueueEmptyState
          title={t.queueErrorTitle}
          description={t.queueErrorDescription}
          actionLabel={t.queueRetry}
          onAction={() => router.refresh()}
        />
      ) : state === "empty" || filteredRecords.length === 0 ? (
        <QueueEmptyState
          title={
            activeSearch || typeFilter || requestedStatus
              ? t.queueNoResultsTitle
              : t.queueEmptyTitle
          }
          description={
            activeSearch || typeFilter || requestedStatus
              ? t.queueNoResultsDescription
              : t.queueEmptyDescription
          }
          actionLabel={
            activeSearch || typeFilter || requestedStatus
              ? dictionary.common.reset
              : t.queueRetry
          }
          onAction={() =>
            updateQuery({ search: null, type: null, status: null, page: "1" })
          }
        />
      ) : hasNoPageResults ? (
        <QueueEmptyState
          title={t.queueNoResultsTitle}
          description={t.queueNoResultsDescription}
          actionLabel={dictionary.common.back}
          onAction={() => updateQuery({ page: "1" })}
        />
      ) : (
        <>
          <AppListTable>
            <Table>
              <TableHeader>
                <AppListTableHeaderRow>
                  <AppListTableHead className="w-24">
                    {t.queueType}
                  </AppListTableHead>
                  <AppListTableHead>{t.queueTitle}</AppListTableHead>
                  <AppListTableHead className="w-48">
                    {t.queueStatus}
                  </AppListTableHead>
                  <AppListTableHead className="w-48">
                    {t.queueDate}
                  </AppListTableHead>
                  <AppListTableHead className="w-32">
                    {t.queueScreenshot}
                  </AppListTableHead>
                </AppListTableHeaderRow>
              </TableHeader>
              <TableBody>
                {visibleRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="align-top">
                      <FeedbackTypeBadge type={record.type} />
                    </TableCell>
                    <TableCell className="max-w-0 align-top whitespace-normal">
                      <Link
                        href={{
                          pathname: `/feedback-submissions/${record.id}`,
                          query: Object.fromEntries(searchParams.entries()),
                        }}
                        className="line-clamp-2 font-medium break-words text-foreground hover:underline"
                      >
                        {record.title}
                      </Link>
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

          <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <PaginationPageSizeSelect
                value={pageSize}
                options={PAGE_SIZE_OPTIONS}
                isPending={false}
                showLabel
                onValueChange={(value) =>
                  updateQuery({ size: String(value), page: "1" })
                }
              />
              <PaginationNavigation
                currentPage={page}
                totalPageCount={totalPages}
                isPending={false}
                onPageChange={(nextPage) =>
                  updateQuery({ page: String(nextPage) })
                }
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function QueueEmptyState({
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
          <SlidersHorizontal />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <Button type="button" variant="outline" onClick={onAction}>
        {actionLabel}
      </Button>
    </Empty>
  )
}

function FeedbackQueueSkeleton() {
  const { dictionary } = useLocalization()

  return (
    <div
      className="flex min-w-0 flex-col gap-6"
      role="status"
      aria-busy="true"
      aria-label={dictionary.feedback.queueLoading}
    >
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-40" />
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
            {Array.from({ length: 6 }).map((_, index) => (
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
