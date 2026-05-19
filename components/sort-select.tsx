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
  showLabel?: boolean
  triggerClassName?: string
}

export function SortSelect({
  className,
  defaultValue,
  label,
  options,
  placeholder,
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

  const currentSort = searchParams.get("sort") || defaultValue || ""

  const onSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams)

    if (value) {
      params.set("sort", value)
    } else {
      params.delete("sort")
    }

    params.set("page", "1")

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showLabel ? (
        <span className="text-sm text-muted-foreground">{resolvedLabel}</span>
      ) : null}
      <Select value={currentSort} onValueChange={onSortChange} disabled={isPending}>
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
