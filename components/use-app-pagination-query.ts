"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"

const DEFAULT_PAGE = 1

const isPositiveInteger = (value: number) =>
  Number.isFinite(value) && Number.isInteger(value) && value > 0

export function useAppPaginationQuery({
  defaultSize = 12,
  totalPages,
}: {
  defaultSize?: number
  totalPages?: number
}) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const rawPage = Number(searchParams.get("page"))
  const rawSize = Number(searchParams.get("size"))
  const currentPage = isPositiveInteger(rawPage) ? rawPage : DEFAULT_PAGE
  const pageSize = isPositiveInteger(rawSize) ? rawSize : defaultSize

  const maxPage =
    typeof totalPages === "number" && totalPages > 0
      ? totalPages
      : Number.POSITIVE_INFINITY

  const pushParams = (params: URLSearchParams) => {
    const query = params.toString()

    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname)
    })
  }

  const setPage = (page: number) => {
    if (isPending || !isPositiveInteger(page)) {
      return
    }

    if (page === currentPage || page > maxPage) {
      return
    }

    const params = new URLSearchParams(searchParams)
    params.set("page", page.toString())
    pushParams(params)
  }

  const setPageSize = (size: number) => {
    if (isPending || !isPositiveInteger(size) || size === pageSize) {
      return
    }

    const params = new URLSearchParams(searchParams)
    params.set("size", size.toString())
    params.set("page", DEFAULT_PAGE.toString())
    pushParams(params)
  }

  return {
    currentPage,
    isPending,
    pageSize,
    setPage,
    setPageSize,
  }
}
