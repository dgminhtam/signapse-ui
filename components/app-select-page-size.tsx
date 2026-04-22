"use client"

import { PaginationPageSizeSelect } from "@/components/app-pagination-controls"

import { DEFAULT_PAGE_SIZE_OPTIONS } from "./app-pagination-utils"
import { useAppPaginationQuery } from "./use-app-pagination-query"

interface AppSelectPageSizeProps {
  className?: string
  defaultSize?: number
  label?: string
  options?: readonly number[] | number[]
  showLabel?: boolean
  triggerClassName?: string
}

export function AppSelectPageSize({
  className,
  defaultSize = 12,
  label,
  options = DEFAULT_PAGE_SIZE_OPTIONS,
  showLabel = true,
  triggerClassName,
}: AppSelectPageSizeProps) {
  const { isPending, pageSize, setPageSize } = useAppPaginationQuery({
    defaultSize,
  })

  return (
    <PaginationPageSizeSelect
      className={className}
      value={pageSize}
      isPending={isPending}
      onValueChange={setPageSize}
      label={label}
      options={options}
      showLabel={showLabel}
      triggerClassName={triggerClassName}
    />
  )
}
