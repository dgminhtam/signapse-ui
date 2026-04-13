"use client"

import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { useDebouncedCallback } from "use-debounce"

import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

export function AiProviderConfigSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", "1")
    if (term) {
      params.set("name[containsIgnoreCase]", term)
    } else {
      params.delete("name[containsIgnoreCase]")
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`)
    })
  }, 300)

  return (
    <div className="relative max-w-sm flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Tìm theo tên cấu hình..."
        className="pl-8"
        defaultValue={searchParams.get("name[containsIgnoreCase]")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {isPending && (
        <div className="absolute right-2.5 top-2.5">
          <Spinner className="size-4" />
        </div>
      )}
    </div>
  )
}
