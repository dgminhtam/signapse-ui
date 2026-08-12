"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"

import { useLocalization } from "@/app/lib/i18n/provider"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface SortOption {
  label: string
  value: string
}

interface SortSelectProps {
  className?: string
  defaultValue?: string
  label?: string
  options: SortOption[]
  placeholder?: string
  resetParamsOnChange?: string[]
  resetPageOnChange?: boolean
  showLabel?: boolean
  triggerClassName?: string
}

export function SortSelect({
  className,
  defaultValue,
  label,
  options,
  placeholder,
  resetParamsOnChange,
  resetPageOnChange = true,
  showLabel = false,
  triggerClassName,
}: SortSelectProps) {
  const { dictionary } = useLocalization()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const resolvedLabel = label ?? dictionary.lists.sortLabel
  const resolvedPlaceholder = placeholder ?? dictionary.lists.sortPlaceholder

  const sortParam = searchParams.get("sort")
  const hasSortParam = options.some((option) => option.value === sortParam)
  const currentSort = hasSortParam ? (sortParam ?? "") : defaultValue || ""

  const onSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams)

    if (value) {
      params.set("sort", value)
    } else {
      params.delete("sort")
    }

    if (resetPageOnChange) {
      params.set("page", "1")
    } else {
      for (const key of resetParamsOnChange ?? ["page", "size"]) {
        params.delete(key)
      }
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showLabel ? (
        <span className="text-sm text-muted-foreground">{resolvedLabel}</span>
      ) : null}
      <Select
        value={currentSort}
        onValueChange={onSortChange}
        disabled={isPending}
      >
        <SelectTrigger
          className={cn("w-full sm:w-[200px]", triggerClassName)}
          aria-label={resolvedLabel}
          aria-busy={isPending}
        >
          <SelectValue placeholder={resolvedPlaceholder} />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
