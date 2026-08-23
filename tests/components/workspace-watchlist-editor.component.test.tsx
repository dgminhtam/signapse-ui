// @vitest-environment jsdom

import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const {
  addAssetsToWorkspaceWatchlist,
  getAssets,
  getWorkspaceWatchlistAssets,
  removeAssetFromWorkspaceWatchlist,
  routerRefresh,
  toastError,
  toastSuccess,
} = vi.hoisted(() => ({
  addAssetsToWorkspaceWatchlist: vi.fn(),
  getAssets: vi.fn(),
  getWorkspaceWatchlistAssets: vi.fn(),
  removeAssetFromWorkspaceWatchlist: vi.fn(),
  routerRefresh: vi.fn(),
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
}))

vi.mock("@/app/api/assets/action", () => ({
  getAssets,
}))

vi.mock("@/app/api/watchlists/action", () => ({
  addAssetsToWorkspaceWatchlist,
  getWorkspaceWatchlistAssets,
  removeAssetFromWorkspaceWatchlist,
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: routerRefresh }),
}))

vi.mock("sonner", () => ({
  toast: { error: toastError, success: toastSuccess },
}))

import { vi as viDictionary } from "@/app/lib/i18n/dictionaries/vi"
import { LocalizationProvider } from "@/app/lib/i18n/provider"
import type { AssetListResponse } from "@/app/lib/assets/definitions"
import type { Page } from "@/app/lib/definitions"
import type { WorkspaceResponse } from "@/app/lib/workspaces/definitions"
import { WorkspaceWatchlistEditor } from "@/components/workspace-watchlist-editor"

const workspace: WorkspaceResponse = {
  id: 7,
  name: "Research",
  currentWorkspace: true,
  createdDate: "2026-07-29T00:00:00Z",
  lastModifiedDate: "2026-07-29T00:00:00Z",
}

function asset(
  id: number,
  name: string,
  symbol: string,
  type = "CRYPTO"
): AssetListResponse {
  return { id, name, symbol, type }
}

function watchlistPage(
  assets: AssetListResponse[],
  pageNumber: number,
  totalPages: number
): Page<{
  assetId: number
  assetName: string
  assetSymbol: string
  assetType: string
}> {
  return {
    content: assets.map((item) => ({
      assetId: item.id,
      assetName: item.name,
      assetSymbol: item.symbol,
      assetType: item.type,
    })),
    pageable: {
      pageNumber,
      pageSize: 200,
      offset: pageNumber * 200,
      paged: true,
      unpaged: false,
    },
    last: pageNumber === totalPages - 1,
    totalElements: assets.length,
    totalPages,
    size: 200,
    number: pageNumber,
    first: pageNumber === 0,
    numberOfElements: assets.length,
    empty: assets.length === 0,
  }
}

function assetPage(
  assets: AssetListResponse[],
  pageNumber: number,
  totalPages: number
): Page<AssetListResponse> {
  return {
    content: assets,
    pageable: {
      pageNumber,
      pageSize: 20,
      offset: pageNumber * 20,
      paged: true,
      unpaged: false,
    },
    last: pageNumber === totalPages - 1,
    totalElements: totalPages * 20,
    totalPages,
    size: 20,
    number: pageNumber,
    first: pageNumber === 0,
    numberOfElements: assets.length,
    empty: assets.length === 0,
  }
}

function renderEditor(
  onOpenChange: (open: boolean) => void = vi.fn(),
  open = true
) {
  return render(
    <LocalizationProvider locale="vi" dictionary={viDictionary}>
      <WorkspaceWatchlistEditor
        open={open}
        onOpenChange={onOpenChange}
        workspace={workspace}
        canReadAsset
        canReadWatchlist
        canCreateWatchlist
        canDeleteWatchlist
      />
    </LocalizationProvider>
  )
}

describe("WorkspaceWatchlistEditor dialog contract", () => {
  beforeEach(() => {
    getAssets.mockResolvedValue(assetPage([], 0, 1))
    getWorkspaceWatchlistAssets.mockResolvedValue(watchlistPage([], 0, 1))
    addAssetsToWorkspaceWatchlist.mockResolvedValue({
      success: true,
      data: { items: [], createdAssetIds: [], existingAssetIds: [] },
    })
    removeAssetFromWorkspaceWatchlist.mockResolvedValue({
      success: true,
      data: undefined,
    })
    routerRefresh.mockReset()
    toastError.mockReset()
    toastSuccess.mockReset()
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it("loads every watchlist page before showing the editable selection", async () => {
    const firstAsset = asset(1, "Bitcoin", "BTCUSD")
    const secondAsset = asset(2, "Ethereum", "ETHUSD")
    getWorkspaceWatchlistAssets
      .mockResolvedValueOnce(watchlistPage([firstAsset], 0, 2))
      .mockResolvedValueOnce(watchlistPage([secondAsset], 1, 2))

    renderEditor()

    expect(
      await screen.findByText(viDictionary.assets.searchLabel)
    ).toBeVisible()
    expect(await screen.findByText(firstAsset.symbol)).toBeVisible()
    expect(await screen.findByText(secondAsset.symbol)).toBeVisible()
    expect(getWorkspaceWatchlistAssets).toHaveBeenNthCalledWith(2, {
      filter: "",
      page: 1,
      size: 200,
      sort: [{ field: "createdDate", direction: "desc" }],
    })
  })

  it("debounces server search, loads more results, and keeps selected chips", async () => {
    const selected = asset(1, "Bitcoin", "BTCUSD")
    const searchResult = asset(2, "Ethereum", "ETHUSD")
    const nextResult = asset(3, "Litecoin", "LTCUSD")
    getWorkspaceWatchlistAssets.mockResolvedValue(
      watchlistPage([selected], 0, 1)
    )
    getAssets
      .mockResolvedValueOnce(assetPage([], 0, 1))
      .mockResolvedValueOnce(assetPage([searchResult], 0, 2))
      .mockResolvedValueOnce(assetPage([nextResult], 1, 2))

    const user = userEvent.setup()
    renderEditor()

    const input = await screen.findByRole("combobox")
    await user.click(input)
    await waitFor(() => expect(getAssets).toHaveBeenCalledTimes(1))

    await user.type(input, "eth")
    await waitFor(() => {
      expect(getAssets).toHaveBeenCalledWith({
        filter: expect.stringContaining("eth"),
        page: 0,
        size: 20,
        sort: [{ field: "name", direction: "asc" }],
      })
    })

    await user.click(
      await screen.findByRole("option", { name: /Ethereum.*ETHUSD/i })
    )
    expect(screen.getByText(selected.symbol)).toBeVisible()
    expect(
      screen.getByRole("button", {
        name: viDictionary.assets.removeSelected.replace(
          "{symbol}",
          searchResult.symbol
        ),
      })
    ).toBeVisible()

    await user.click(
      screen.getByRole("button", { name: viDictionary.assets.loadMore })
    )
    await waitFor(() => expect(getAssets).toHaveBeenCalledTimes(3))
    expect(screen.getByText(nextResult.symbol)).toBeVisible()
  })

  it("opens a discard confirmation for a dirty Cancel dismissal", async () => {
    const selected = asset(1, "Bitcoin", "BTCUSD")
    const added = asset(2, "Ethereum", "ETHUSD")
    getWorkspaceWatchlistAssets.mockResolvedValue(
      watchlistPage([selected], 0, 1)
    )
    getAssets.mockResolvedValue(assetPage([added], 0, 1))

    const onOpenChange = vi.fn()
    const user = userEvent.setup()
    renderEditor(onOpenChange)

    const input = await screen.findByRole("combobox")
    await user.click(input)
    await user.click(
      await screen.findByRole("option", { name: /Ethereum.*ETHUSD/i })
    )
    await user.keyboard("{Escape}")
    await user.click(
      screen.getByRole("button", { name: viDictionary.common.cancel })
    )

    const discardDialog = await screen.findByRole("alertdialog")
    expect(
      within(discardDialog).getByText(viDictionary.watchlist.discardTitle)
    ).toBeVisible()
    expect(onOpenChange).not.toHaveBeenCalledWith(false)
  })

  it("retries only failed save work after reconciling successful operations", async () => {
    const removed = asset(1, "Bitcoin", "BTCUSD")
    const kept = asset(2, "Ethereum", "ETHUSD")
    const added = asset(3, "Litecoin", "LTCUSD")
    getWorkspaceWatchlistAssets.mockResolvedValue(
      watchlistPage([removed, kept], 0, 1)
    )
    getAssets.mockResolvedValue(assetPage([added], 0, 1))
    addAssetsToWorkspaceWatchlist
      .mockResolvedValueOnce({ success: false, error: "add failed" })
      .mockResolvedValueOnce({
        success: true,
        data: { items: [], createdAssetIds: [added.id], existingAssetIds: [] },
      })

    const user = userEvent.setup()
    renderEditor()

    await screen.findByText(removed.symbol)
    await user.click(
      screen.getByRole("button", {
        name: viDictionary.assets.removeSelected.replace(
          "{symbol}",
          kept.symbol
        ),
      })
    )
    const input = screen.getByRole("combobox")
    await user.click(input)
    await user.click(
      await screen.findByRole("option", { name: /Litecoin.*LTCUSD/i })
    )
    await user.keyboard("{Escape}")
    await user.click(
      screen.getByRole("button", { name: viDictionary.watchlist.saveList })
    )

    expect(
      await screen.findByText(viDictionary.watchlist.partialFailure)
    ).toBeVisible()
    expect(removeAssetFromWorkspaceWatchlist).toHaveBeenCalledTimes(1)
    expect(addAssetsToWorkspaceWatchlist).toHaveBeenCalledTimes(1)

    const retry = screen.getByRole("button", {
      name: viDictionary.common.retry,
    })
    await waitFor(() => expect(retry).toBeEnabled())
    await user.click(retry)
    await waitFor(() =>
      expect(addAssetsToWorkspaceWatchlist).toHaveBeenCalledTimes(2)
    )
    expect(removeAssetFromWorkspaceWatchlist).toHaveBeenCalledTimes(1)
  })
})
