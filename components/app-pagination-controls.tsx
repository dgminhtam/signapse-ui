"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Page } from "@/app/lib/definitions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

import {
  DEFAULT_PAGE_SIZE_OPTIONS,
  DOTS,
  getPaginationRange,
  getVisibleItemRange,
} from "./app-pagination-utils"
import { useAppPaginationQuery } from "./use-app-pagination-query"

interface PaginationNavigationProps {
  className?: string
  currentPage: number
  isPending: boolean
  onPageChange: (page: number) => void
  siblingCount?: number
  totalPageCount: number
}

interface PaginationPageSizeSelectProps {
  className?: string
  isPending: boolean
  label?: string
  onValueChange: (value: number) => void
  options?: readonly number[] | number[]
  showLabel?: boolean
  triggerClassName?: string
  value: number
}

interface AppPaginationControlsProps<T> {
  className?: string
  page: Pick<
    Page<T>,
    "number" | "numberOfElements" | "size" | "totalElements" | "totalPages"
  >
}

export function PaginationPageSizeSelect({
  className,
  isPending,
  label = "Số mục mỗi trang",
  onValueChange,
  options = DEFAULT_PAGE_SIZE_OPTIONS,
  showLabel = true,
  triggerClassName,
  value,
}: PaginationPageSizeSelectProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showLabel ? (
        <span className="text-sm text-muted-foreground">{label}</span>
      ) : null}
      <Select
        value={value.toString()}
        onValueChange={(nextValue) => onValueChange(Number(nextValue))}
        disabled={isPending}
      >
        <SelectTrigger
          size="sm"
          className={cn("w-full sm:w-[120px]", triggerClassName)}
          aria-label={label}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option} / trang
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {isPending ? <Spinner className="size-4 text-muted-foreground" /> : null}
    </div>
  )
}

export function PaginationNavigation({
  className,
  currentPage,
  isPending,
  onPageChange,
  siblingCount = 1,
  totalPageCount,
}: PaginationNavigationProps) {
  const paginationRange = getPaginationRange({
    currentPage,
    siblingCount,
    totalPageCount,
  })

  if (totalPageCount <= 1) {
    return null
  }

  const isPreviousDisabled = currentPage <= 1 || isPending
  const isNextDisabled = currentPage >= totalPageCount || isPending

  return (
    <Pagination
      className={cn("mx-0 w-full justify-start sm:justify-end", className)}
      aria-label="Điều hướng phân trang"
    >
      <PaginationContent className="flex-wrap justify-start sm:justify-end">
        <PaginationItem>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Đi tới trang trước"
            disabled={isPreviousDisabled}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeftIcon data-icon="inline-start" />
          </Button>
        </PaginationItem>

        {paginationRange.map((entry, index) => {
          if (entry === DOTS) {
            return (
              <PaginationItem key={`${entry}-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }

          const isCurrentPage = currentPage === entry

          return (
            <PaginationItem key={entry}>
              <Button
                type="button"
                variant={isCurrentPage ? "default" : "outline"}
                size="icon"
                aria-label={`Đi tới trang ${entry}`}
                aria-current={isCurrentPage ? "page" : undefined}
                disabled={isPending}
                onClick={() => {
                  if (!isCurrentPage) {
                    onPageChange(entry)
                  }
                }}
              >
                {entry}
              </Button>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Đi tới trang sau"
            disabled={isNextDisabled}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRightIcon data-icon="inline-start" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export function AppPaginationControls<T>({
  className,
  page,
}: AppPaginationControlsProps<T>) {
  const { isPending, setPage } = useAppPaginationQuery({
    defaultSize: page.size,
    totalPages: page.totalPages,
  })

  const currentPage = page.number + 1
  const visibleItems = getVisibleItemRange({
    currentItemCount: page.numberOfElements,
    currentPage,
    itemsPerPage: page.size,
    totalElements: page.totalElements,
  })

  const summaryText =
    page.totalElements > 0
      ? `Hiển thị ${visibleItems.start}-${visibleItems.end} trên ${page.totalElements} kết quả`
      : "Chưa có dữ liệu để hiển thị"

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3",
        className
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="text-sm text-muted-foreground">{summaryText}</p>
          {isPending ? (
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Spinner className="size-3.5" />
                Đang cập nhật
              </Badge>
            </div>
          ) : null}
        </div>

        {page.totalPages > 1 ? (
          <PaginationNavigation
            className="w-full sm:w-auto"
            currentPage={currentPage}
            totalPageCount={page.totalPages}
            isPending={isPending}
            onPageChange={setPage}
          />
        ) : null}
      </div>
    </div>
  )
}
