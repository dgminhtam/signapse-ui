"use client"

export const DOTS = "..." as const

export type PaginationEntry = number | typeof DOTS

export const DEFAULT_PAGE_SIZE_OPTIONS = [12, 20, 40, 80] as const

const range = (start: number, end: number) => {
  const length = end - start + 1

  return Array.from({ length }, (_, index) => index + start)
}

export function getPaginationRange({
  currentPage,
  siblingCount = 1,
  totalPageCount,
}: {
  currentPage: number
  siblingCount?: number
  totalPageCount: number
}): PaginationEntry[] {
  const totalPageNumbers = siblingCount + 5

  if (totalPageCount <= 0) {
    return []
  }

  if (totalPageNumbers >= totalPageCount) {
    return range(1, totalPageCount)
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount)
  const shouldShowLeftDots = leftSiblingIndex > 2
  const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2
  const firstPageIndex = 1
  const lastPageIndex = totalPageCount

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount
    const leftRange = range(1, leftItemCount)

    return [...leftRange, DOTS, totalPageCount]
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount
    const rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount)

    return [firstPageIndex, DOTS, ...rightRange]
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = range(leftSiblingIndex, rightSiblingIndex)

    return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex]
  }

  return []
}

export function getVisibleItemRange({
  currentItemCount,
  currentPage,
  itemsPerPage,
  totalElements,
}: {
  currentItemCount: number
  currentPage: number
  itemsPerPage: number
  totalElements: number
}) {
  if (totalElements <= 0 || currentItemCount <= 0 || itemsPerPage <= 0) {
    return { start: 0, end: 0 }
  }

  const start = (currentPage - 1) * itemsPerPage + 1
  const end = start + currentItemCount - 1

  return {
    start,
    end: Math.min(end, totalElements),
  }
}
