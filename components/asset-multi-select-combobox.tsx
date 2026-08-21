"use client"

import * as React from "react"
import { LoaderCircleIcon, RotateCwIcon, XIcon } from "lucide-react"

import { getAssets } from "@/app/api/assets/action"
import { AssetListResponse } from "@/app/lib/assets/definitions"
import { useLocalization } from "@/app/lib/i18n/provider"
import { buildFilterQuery } from "@/app/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { Spinner } from "@/components/ui/spinner"

interface AssetMultiSelectComboboxProps {
  selectedAssets: AssetListResponse[]
  onSelectedAssetsChange: (assets: AssetListResponse[]) => void
  disabled?: boolean
}

const ASSET_PAGE_SIZE = 20
const SEARCH_DEBOUNCE_MS = 250
const ASSET_SEARCH_INPUT_ID = "workspace-watchlist-asset-search"

function mergeUniqueAssets(
  currentAssets: AssetListResponse[],
  nextAssets: AssetListResponse[]
) {
  const assetsById = new Map(
    currentAssets.map((asset) => [asset.id, asset] as const)
  )

  nextAssets.forEach((asset) => {
    assetsById.set(asset.id, asset)
  })

  return Array.from(assetsById.values())
}

export function AssetMultiSelectCombobox({
  selectedAssets,
  onSelectedAssetsChange,
  disabled = false,
}: AssetMultiSelectComboboxProps) {
  const { dictionary, formatMessage, formatNumber } = useLocalization()
  const anchor = useComboboxAnchor()
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState("")
  const [options, setOptions] = React.useState<AssetListResponse[]>([])
  const [page, setPage] = React.useState(0)
  const [hasMore, setHasMore] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isLoadingMore, setIsLoadingMore] = React.useState(false)
  const [loadError, setLoadError] = React.useState<string | null>(null)
  const [failedPage, setFailedPage] = React.useState<number | null>(null)
  const requestIdRef = React.useRef(0)
  const assetLoadErrorFallback = dictionary.assets.loadError

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timeoutId)
  }, [searchTerm])

  const loadAssetsPage = React.useCallback(
    async (nextPage: number, query: string, append: boolean) => {
      const requestId = ++requestIdRef.current

      setLoadError(null)
      setFailedPage(null)
      if (append) {
        setIsLoadingMore(true)
      } else {
        setIsLoading(true)
        setOptions([])
        setPage(0)
        setHasMore(false)
      }

      try {
        const response = await getAssets({
          filter: buildFilterQuery({
            "name[containsIgnoreCase],symbol[containsIgnoreCase]": query,
          }),
          page: nextPage,
          size: ASSET_PAGE_SIZE,
          sort: [{ field: "name", direction: "asc" }],
        })

        if (requestId !== requestIdRef.current) {
          return
        }

        setOptions((currentOptions) =>
          append
            ? mergeUniqueAssets(currentOptions, response.content)
            : mergeUniqueAssets([], response.content)
        )
        setPage(response.number)
        setHasMore(
          !response.last && response.number + 1 < response.totalPages
        )
      } catch (error: unknown) {
        if (requestId !== requestIdRef.current) {
          return
        }

        const errorMessage =
          error instanceof Error ? error.message : assetLoadErrorFallback
        setLoadError(errorMessage)
        setFailedPage(nextPage)
      } finally {
        if (requestId !== requestIdRef.current) {
          return
        }

        setIsLoading(false)
        setIsLoadingMore(false)
      }
    },
    [assetLoadErrorFallback]
  )

  React.useEffect(() => {
    if (!open || disabled) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      void loadAssetsPage(0, debouncedSearchTerm.trim(), false)
    })

    return () => window.clearTimeout(timeoutId)
  }, [debouncedSearchTerm, disabled, loadAssetsPage, open])

  React.useEffect(() => {
    if (!open || disabled || isLoading || isLoadingMore) {
      return
    }

    const animationFrame = window.requestAnimationFrame(() => {
      document.getElementById(ASSET_SEARCH_INPUT_ID)?.focus()
    })

    return () => window.cancelAnimationFrame(animationFrame)
  }, [disabled, isLoading, isLoadingMore, open])

  function handleOpenChange(nextOpen: boolean) {
    if (disabled) {
      return
    }

    setOpen(nextOpen)
    if (!nextOpen) {
      requestIdRef.current += 1
      setSearchTerm("")
      setDebouncedSearchTerm("")
      setOptions([])
      setPage(0)
      setHasMore(false)
      setLoadError(null)
      setFailedPage(null)
    }
  }

  function handleRetry() {
    if (failedPage === null || isLoading || isLoadingMore) {
      return
    }

    void loadAssetsPage(
      failedPage,
      debouncedSearchTerm.trim(),
      failedPage > 0
    )
  }

  function handleLoadMore() {
    if (!hasMore || isLoading || isLoadingMore) {
      return
    }

    void loadAssetsPage(page + 1, debouncedSearchTerm.trim(), true)
  }

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label
        htmlFor={ASSET_SEARCH_INPUT_ID}
        className="text-sm font-medium"
      >
        {dictionary.assets.searchLabel}
      </label>
      <p
        id={`${ASSET_SEARCH_INPUT_ID}-description`}
        className="text-sm text-muted-foreground"
      >
        {dictionary.watchlist.helper}
      </p>

      <Combobox
        multiple
        autoHighlight
        items={options}
        filter={null}
        open={open}
        onOpenChange={(nextOpen, eventDetails) => {
          if (!nextOpen && eventDetails.reason === "item-press") {
            eventDetails.cancel()
            return
          }

          handleOpenChange(nextOpen)
        }}
        value={selectedAssets}
        onValueChange={(value) => {
          onSelectedAssetsChange(value)
        }}
        disabled={disabled}
        isItemEqualToValue={(item, value) => item.id === value.id}
        itemToStringLabel={(item) => item.symbol}
      >
        <ComboboxChips
          ref={anchor}
          className="max-h-32 min-h-12 items-start overflow-y-auto"
          aria-describedby={`${ASSET_SEARCH_INPUT_ID}-description`}
        >
          <ComboboxValue>
            {(values) => (
              <React.Fragment>
                {values.map((asset: AssetListResponse) => (
                  <ComboboxChip
                    key={asset.id}
                    showRemove={false}
                  >
                    {asset.symbol}
                    <button
                      type="button"
                      aria-label={formatMessage(
                        dictionary.assets.removeSelected,
                        { symbol: asset.symbol }
                      )}
                      disabled={disabled}
                      className="inline-flex size-5 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={(event) => {
                        event.stopPropagation()
                        onSelectedAssetsChange(
                          selectedAssets.filter((item) => item.id !== asset.id)
                        )
                      }}
                    >
                      <XIcon className="size-3" aria-hidden="true" />
                    </button>
                  </ComboboxChip>
                ))}
                <ComboboxChipsInput
                  id={ASSET_SEARCH_INPUT_ID}
                  placeholder={dictionary.assets.searchPlaceholder}
                  aria-label={dictionary.assets.searchLabel}
                  aria-describedby={`${ASSET_SEARCH_INPUT_ID}-description`}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </React.Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>

        <ComboboxContent
          anchor={anchor}
          align="start"
          className="w-[min(36rem,calc(100vw-2rem))]"
        >
          {isLoading && options.length > 0 ? (
            <div
              role="status"
              aria-live="polite"
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground"
            >
              <Spinner />
              {dictionary.assets.searchLoading}
            </div>
          ) : null}

          {loadError ? (
            <div
              role="alert"
              className="flex items-center justify-between gap-3 border-b px-3 py-2 text-sm text-destructive"
            >
              <span>{loadError}</span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isLoading || isLoadingMore}
                onClick={handleRetry}
              >
                <RotateCwIcon data-icon="inline-start" />
                {dictionary.assets.retrySearch}
              </Button>
            </div>
          ) : null}

          <ComboboxEmpty>
            {isLoading
              ? dictionary.assets.searchLoading
              : loadError
                ? null
                : dictionary.assets.emptySearch}
          </ComboboxEmpty>

          <ComboboxList>
            {(asset: AssetListResponse) => (
              <ComboboxItem key={asset.id} value={asset}>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{asset.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {asset.symbol}
                  </div>
                </div>
                <Badge variant="outline" className="shrink-0">
                  {asset.type}
                </Badge>
              </ComboboxItem>
            )}
          </ComboboxList>

          {hasMore ? (
            <div className="border-t p-2">
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                disabled={isLoading || isLoadingMore}
                onClick={handleLoadMore}
              >
                {isLoadingMore ? (
                  <LoaderCircleIcon
                    className="animate-spin"
                    data-icon="inline-start"
                  />
                ) : null}
                {isLoadingMore
                  ? dictionary.assets.loadingMore
                  : dictionary.assets.loadMore}
              </Button>
            </div>
          ) : null}
        </ComboboxContent>
      </Combobox>

      <p
        role="status"
        aria-live="polite"
        className="text-sm text-muted-foreground"
      >
        {formatMessage(dictionary.watchlist.selectedCount, {
          count: formatNumber(selectedAssets.length),
        })}
      </p>
    </div>
  )
}
