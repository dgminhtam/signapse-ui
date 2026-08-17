"use client"

import * as React from "react"
import { ChevronsUpDownIcon, SearchIcon, XIcon } from "lucide-react"

import { getAssets } from "@/app/api/assets/action"
import { AssetListResponse } from "@/app/lib/assets/definitions"
import { useLocalization } from "@/app/lib/i18n/provider"
import { buildFilterQuery } from "@/app/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuContentInOverlay as DropdownMenuContent } from "@/components/ui/dropdown-menu-content-in-overlay"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

interface AssetMultiSelectComboboxProps {
  selectedAssets: AssetListResponse[]
  onSelectedAssetsChange: (assets: AssetListResponse[]) => void
  disabled?: boolean
}

export function AssetMultiSelectCombobox({
  selectedAssets,
  onSelectedAssetsChange,
  disabled = false,
}: AssetMultiSelectComboboxProps) {
  const { dictionary, formatMessage, formatNumber } = useLocalization()
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const deferredSearchTerm = React.useDeferredValue(searchTerm)
  const [options, setOptions] = React.useState<AssetListResponse[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [loadError, setLoadError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!open || disabled) {
      return
    }

    let cancelled = false

    async function loadAssets() {
      setIsLoading(true)
      setLoadError(null)

      try {
        const response = await getAssets({
          filter: buildFilterQuery({
            "name[containsIgnoreCase],symbol[containsIgnoreCase]":
              deferredSearchTerm.trim(),
          }),
          page: 0,
          size: 20,
          sort: [{ field: "name", direction: "asc" }],
        })

        if (cancelled) {
          return
        }

        setOptions(response.content)
      } catch (error: unknown) {
        if (cancelled) {
          return
        }

        const errorMessage =
          error instanceof Error ? error.message : dictionary.assets.loadError
        setLoadError(errorMessage)
        setOptions([])
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadAssets()

    return () => {
      cancelled = true
    }
  }, [deferredSearchTerm, disabled, open])

  function isSelected(assetId: number) {
    return selectedAssets.some((asset) => asset.id === assetId)
  }

  function toggleAsset(asset: AssetListResponse, checked: boolean) {
    if (checked) {
      if (isSelected(asset.id)) {
        return
      }

      onSelectedAssetsChange([...selectedAssets, asset])
      return
    }

    onSelectedAssetsChange(
      selectedAssets.filter((item) => item.id !== asset.id)
    )
  }

  function removeAsset(assetId: number) {
    onSelectedAssetsChange(selectedAssets.filter((item) => item.id !== assetId))
  }

  return (
    <div className="flex flex-col gap-3">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between"
              disabled={disabled}
            />
          }
        >
          <span className="truncate">
            {selectedAssets.length > 0
              ? formatMessage(dictionary.assets.selectedCount, {
                  count: formatNumber(selectedAssets.length),
                })
              : dictionary.assets.chooseTracked}
          </span>
          {isLoading ? (
            <Spinner className="size-4" />
          ) : (
            <ChevronsUpDownIcon className="size-4" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[min(36rem,calc(100vw-2rem))] p-0"
          sideOffset={8}
        >
          <div className="border-b p-2">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={(event) => event.stopPropagation()}
                placeholder={dictionary.assets.searchPlaceholder}
                className="pl-8"
              />
            </div>
          </div>

          <DropdownMenuLabel>{dictionary.assets.library}</DropdownMenuLabel>

          {loadError ? (
            <div className="px-2 pb-2 text-sm text-destructive">
              {loadError}
            </div>
          ) : null}

          {!loadError && !isLoading && options.length === 0 ? (
            <div className="px-2 pb-2 text-sm text-muted-foreground">
              {dictionary.assets.emptySearch}
            </div>
          ) : null}

          {options.length > 0 ? (
            <div className="max-h-72 overflow-y-auto">
              <DropdownMenuGroup>
                {options.map((asset) => (
                  <DropdownMenuCheckboxItem
                    key={asset.id}
                    checked={isSelected(asset.id)}
                    onCheckedChange={(checked) =>
                      toggleAsset(asset, checked === true)
                    }
                    closeOnClick={false}
                  >
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate font-medium">{asset.name}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {asset.symbol}
                        </div>
                      </div>
                      <Badge variant="outline">{asset.type}</Badge>
                    </div>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
            </div>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="h-px bg-border" />

      {selectedAssets.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selectedAssets.map((asset) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => removeAsset(asset.id)}
              className="inline-flex"
              disabled={disabled}
            >
              <Badge variant="secondary" className="gap-1">
                <span>{asset.symbol}</span>
                <XIcon className="size-3" />
              </Badge>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {dictionary.assets.emptyTracked}
        </p>
      )}
    </div>
  )
}
