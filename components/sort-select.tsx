"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"

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

interface SortOption {
  label: string
  value: string
}

interface SortSelectProps {
  className?: string
  label?: string
  options: SortOption[]
  placeholder?: string
  showLabel?: boolean
  triggerClassName?: string
}

export function SortSelect({
  className,
  label = "Sắp xếp danh sách",
  options,
  placeholder = "Sắp xếp",
  showLabel = false,
  triggerClassName,
}: SortSelectProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentSort = searchParams.get("sort") || ""

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
        <span className="text-sm text-muted-foreground">{label}</span>
      ) : null}
      <Select value={currentSort} onValueChange={onSortChange} disabled={isPending}>
        <SelectTrigger
          size="sm"
          className={cn("w-full sm:w-[200px]", triggerClassName)}
          aria-label={label}
        >
          <SelectValue placeholder={placeholder} />
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
      {isPending ? <Spinner className="size-4 text-muted-foreground" /> : null}
    </div>
  )
}
