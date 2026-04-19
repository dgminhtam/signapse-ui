"use client"

import { Page } from "@/app/lib/definitions"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
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
  pageSizeOptions?: readonly number[] | number[]
}

export function PaginationPageSizeSelect({
  className,
  isPending,
  label = "Số mục / trang",
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
          className={cn("min-w-20 sm:min-w-24", triggerClassName)}
          aria-label={label}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
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
          <PaginationPrevious
            href="#"
            text="Trước"
            aria-label="Đi tới trang trước"
            aria-disabled={isPreviousDisabled}
            tabIndex={isPreviousDisabled ? -1 : undefined}
            className={cn(isPreviousDisabled && "pointer-events-none opacity-50")}
            onClick={(event) => {
              event.preventDefault()
              if (!isPreviousDisabled) {
                onPageChange(currentPage - 1)
              }
            }}
          />
        </PaginationItem>

        {paginationRange.map((entry, index) => (
          <PaginationItem key={`${entry}-${index}`}>
            {entry === DOTS ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                isActive={currentPage === entry}
                aria-label={`Đi tới trang ${entry}`}
                tabIndex={isPending ? -1 : undefined}
                className={cn(isPending && "pointer-events-none opacity-50")}
                onClick={(event) => {
                  event.preventDefault()
                  if (!isPending) {
                    onPageChange(entry)
                  }
                }}
              >
                {entry}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            text="Tiếp"
            aria-label="Đi tới trang sau"
            aria-disabled={isNextDisabled}
            tabIndex={isNextDisabled ? -1 : undefined}
            className={cn(isNextDisabled && "pointer-events-none opacity-50")}
            onClick={(event) => {
              event.preventDefault()
              if (!isNextDisabled) {
                onPageChange(currentPage + 1)
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export function AppPaginationControls<T>({
  className,
  page,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: AppPaginationControlsProps<T>) {
  const { isPending, pageSize, setPage, setPageSize } = useAppPaginationQuery({
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
      ? `Hiển thị ${visibleItems.start}-${visibleItems.end} trong ${page.totalElements} kết quả`
      : "Không có dữ liệu để hiển thị"

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border bg-muted/20 p-4",
        className
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {page.totalElements > 0 ? (
              <Badge variant="secondary">
                Trang {currentPage}/{page.totalPages}
              </Badge>
            ) : (
              <Badge variant="secondary">0 kết quả</Badge>
            )}
            {isPending ? (
              <Badge variant="outline" className="gap-1">
                <Spinner className="size-3.5" />
                Đang cập nhật
              </Badge>
            ) : null}
          </div>
          <p className="text-sm font-medium text-foreground">{summaryText}</p>
        </div>

        <div className="flex flex-col gap-2 sm:items-start lg:items-end">
          <span className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
            Tùy chọn hiển thị
          </span>
          <PaginationPageSizeSelect
            value={pageSize}
            isPending={isPending}
            onValueChange={setPageSize}
            options={pageSizeOptions}
            showLabel={false}
            triggerClassName="w-full sm:w-24"
          />
        </div>
      </div>

      {page.totalPages > 1 ? (
        <>
          <Separator />
          <PaginationNavigation
            currentPage={currentPage}
            totalPageCount={page.totalPages}
            isPending={isPending}
            onPageChange={setPage}
          />
        </>
      ) : null}
    </div>
  )
}
