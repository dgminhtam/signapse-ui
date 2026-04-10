"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Globe, Filter } from "lucide-react"
import { useTransition } from "react"
import { Spinner } from "@/components/ui/spinner"

export function EconomicCalendarSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSearch = useDebouncedCallback((key: string, term: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", "1")
    if (term) {
      params.set(key, term)
    } else {
      params.delete(key)
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`)
    })
  }, 300)

  const handleImpactChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", "1")
    if (value && value !== "all") {
      params.set("impact[eq]", value)
    } else {
      params.delete("impact[eq]")
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`)
    })
  }

  const currentImpact = searchParams.get("impact[eq]") || "all"

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title..."
          className="pl-8"
          defaultValue={searchParams.get("title[containsIgnoreCase]")?.toString()}
          onChange={(e) => handleSearch("title[containsIgnoreCase]", e.target.value)}
        />
        {isPending && <div className="absolute right-2.5 top-2.5"><Spinner className="size-4" /></div>}
      </div>

      <div className="relative flex-1">
        <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by country..."
          className="pl-8"
          defaultValue={searchParams.get("country[containsIgnoreCase]")?.toString()}
          onChange={(e) => handleSearch("country[containsIgnoreCase]", e.target.value)}
        />
      </div>

      <div className="flex w-full items-center gap-2 sm:w-[200px]">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={currentImpact} onValueChange={handleImpactChange}>
          <SelectTrigger>
            <SelectValue placeholder="Impact Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="HIGH">HIGH (High)</SelectItem>
            <SelectItem value="MEDIUM">MEDIUM (Medium)</SelectItem>
            <SelectItem value="LOW">LOW (Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
