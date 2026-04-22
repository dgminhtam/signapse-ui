"use client"

import { Filter } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"

import {
  SOURCE_DOCUMENT_TYPE_LABELS,
} from "@/app/lib/source-documents/definitions"
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const typeOptions = [
  { value: "ALL", label: "Tất cả loại tài liệu" },
  ...Object.entries(SOURCE_DOCUMENT_TYPE_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
] as const

export function SourceDocumentTypeFilter() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [isPending, startTransition] = useTransition()
  const currentType = searchParams.get("documentType[eq]") || "ALL"

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", "1")

    if (value === "ALL") {
      params.delete("documentType[eq]")
    } else {
      params.set("documentType[eq]", value)
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-muted-foreground" />
      <Select value={currentType} onValueChange={handleValueChange} disabled={isPending}>
        <SelectTrigger
          size="sm"
          className="w-full sm:w-[220px]"
          aria-label="Lọc theo loại tài liệu"
        >
          <SelectValue placeholder="Lọc theo loại" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            {typeOptions.map((option) => (
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
