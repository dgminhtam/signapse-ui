"use client"

export function WatchlistSearch() {
  return null
}

/*

import { SearchIcon, PlusIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { useDebouncedCallback } from "use-debounce"
import { toast } from "sonner"

import { createWatchlistGroup } from "@/app/api/watchlists/action"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"

interface WatchlistSearchProps {
  canCreateWatchlist: boolean
}

export function WatchlistSearch({ canCreateWatchlist }: WatchlistSearchProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term.trim()) {
      params.set("query", term.trim())
    } else {
      params.delete("query")
    }

    startTransition(() => {
      router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname)
    })
  }, 300)

  const handleCreateWatchlist = () => {
    const trimmedName = name.trim()
    const trimmedDescription = description.trim()

    if (!trimmedName) {
      toast.error("Vui lòng nhập tên watchlist")
      return
    }

    startTransition(async () => {
      const result = await createWatchlistGroup({
        name: trimmedName,
        ...(trimmedDescription ? { description: trimmedDescription } : {}),
      })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(`Đã tạo watchlist "${result.data.name}"`)
      setName("")
      setDescription("")
      setIsCreateOpen(false)
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <SearchIcon className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            className="pl-8"
            placeholder="Tìm theo tên watchlist hoặc mã tài sản..."
            defaultValue={searchParams.get("query")?.toString() ?? ""}
            onChange={(event) => handleSearch(event.target.value)}
          />
          {isPending ? (
            <div className="absolute top-2.5 right-2.5">
              <Spinner className="size-4" />
            </div>
          ) : null}
        </div>

        {canCreateWatchlist ? (
          <Collapsible open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline">
                <PlusIcon data-icon="inline-start" />
                Tạo watchlist
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 rounded-lg border bg-muted/20 p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tên watchlist</label>
                  <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Ví dụ: Crypto ngắn hạn"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mô tả</label>
                  <Textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Mô tả ngắn mục đích của watchlist này"
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsCreateOpen(false)}
                    disabled={isPending}
                  >
                    Hủy
                  </Button>
                  <Button type="button" onClick={handleCreateWatchlist} disabled={isPending}>
                    {isPending ? "Đang tạo..." : "Lưu watchlist"}
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ) : null}
      </div>
    </div>
  )
}
*/
