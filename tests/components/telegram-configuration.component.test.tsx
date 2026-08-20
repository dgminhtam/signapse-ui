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

const { routerRefresh } = vi.hoisted(() => ({
  routerRefresh: vi.fn(),
}))

vi.mock("@/app/api/telegram/action", () => ({
  createTelegramBotConnection: vi.fn(),
  createTelegramLinkToken: vi.fn(),
  createTelegramMarketAnalysisSchedule: vi.fn(),
  deleteTelegramBotConnection: vi.fn(),
  deleteTelegramDestination: vi.fn(),
  deleteTelegramMarketAnalysisSchedule: vi.fn(),
  disableTelegramBotConnection: vi.fn(),
  disableTelegramDestination: vi.fn(),
  disableTelegramMarketAnalysisSchedule: vi.fn(),
  sendTelegramTestMessage: vi.fn(),
  updateTelegramFeatureSetting: vi.fn(),
  updateTelegramMarketAnalysisSchedule: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: routerRefresh }),
}))

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}))

import {
  deleteTelegramMarketAnalysisSchedule,
  disableTelegramMarketAnalysisSchedule,
  updateTelegramFeatureSetting,
} from "@/app/api/telegram/action"
import { vi as viDictionary } from "@/app/lib/i18n/dictionaries/vi"
import { LocalizationProvider } from "@/app/lib/i18n/provider"
import type { TelegramConfigurationData } from "@/app/lib/telegram/definitions"
import { TelegramConfigurationPage } from "@/app/[lang]/(main)/telegram/telegram-configuration"

const destination = {
  id: 8,
  botConnectionId: 1,
  chatType: "PRIVATE" as const,
  displayLabel: "Operations",
  status: "ACTIVE" as const,
}

const schedule = {
  id: 11,
  name: "Morning analysis",
  workspaceId: 7,
  workspaceName: "Workspace",
  destination,
  timezone: "Asia/Bangkok",
  localTimes: ["09:00"],
  asset: { assetId: 9, assetName: "Gold", assetSymbol: "GOLD" },
  status: "ACTIVE" as const,
}

const data: TelegramConfigurationData = {
  botConnections: [],
  destinations: [destination],
  featureSettings: [],
  schedules: [schedule],
  currentWorkspace: {
    id: 7,
    name: "Workspace",
    currentWorkspace: true,
    createdDate: "2026-07-29T00:00:00Z",
    lastModifiedDate: "2026-07-29T00:00:00Z",
  },
  watchlistAssets: [
    {
      id: 10,
      assetId: 9,
      assetName: "Gold",
      assetSymbol: "GOLD",
      assetType: "COMMODITY",
      createdDate: "2026-07-29T00:00:00Z",
    },
  ],
  languages: [{ id: 1, isoCode: "en", name: "English" }],
  languageCatalogError: false,
  scheduleLoadError: false,
  sectionAccess: {
    botConnections: false,
    destinations: false,
    featureSettings: true,
    schedules: true,
    watchlistAssets: true,
  },
  manageAccess: {
    botConnections: false,
    destinations: false,
    featureSettings: false,
    schedules: true,
  },
}

const selectControlledWarning =
  "Base UI: A component is changing the uncontrolled value state of Select to be controlled."

function renderConfiguration(configurationData: TelegramConfigurationData = data) {
  return render(
    <LocalizationProvider locale="vi" dictionary={viDictionary}>
      <TelegramConfigurationPage data={configurationData} />
    </LocalizationProvider>
  )
}

function expectNoSelectControlledWarning(calls: unknown[][]) {
  expect(
    calls.some((call) =>
      call.some(
        (argument) =>
          typeof argument === "string" &&
          argument.includes(selectControlledWarning)
      )
    )
  ).toBe(false)
}

describe("Telegram schedule destructive actions", () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    vi.mocked(deleteTelegramMarketAnalysisSchedule).mockReset()
    vi.mocked(disableTelegramMarketAnalysisSchedule).mockReset()
    vi.mocked(updateTelegramFeatureSetting).mockReset()
    routerRefresh.mockReset()
  })

  it("keeps delete confirmation open through failure, supports retry, and restores focus", async () => {
    const user = userEvent.setup()
    renderConfiguration()

    const trigger = screen.getByRole("button", {
      name: viDictionary.telegram.schedule.deleteTrigger,
    })
    await user.click(trigger)

    const dialog = screen.getByRole("alertdialog")
    expect(
      within(dialog).getByRole("heading", {
        name: viDictionary.telegram.schedule.deleteTitle,
      })
    ).toBeVisible()

    vi.mocked(deleteTelegramMarketAnalysisSchedule).mockResolvedValueOnce({
      success: false,
      error: "Delete failed",
    })
    const confirm = within(dialog).getByRole("button", {
      name: viDictionary.telegram.schedule.deleteAction,
    })
    await user.click(confirm)

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Delete failed")
    )
    expect(screen.getByRole("alertdialog")).toBeInTheDocument()
    expect(confirm).toBeEnabled()

    vi.mocked(deleteTelegramMarketAnalysisSchedule).mockResolvedValueOnce({
      success: true,
      data: undefined,
    })
    await user.click(confirm)
    await waitFor(() =>
      expect(deleteTelegramMarketAnalysisSchedule).toHaveBeenCalledTimes(2)
    )
    await waitFor(() => expect(routerRefresh).toHaveBeenCalledTimes(1))
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it("confirms disable through the accessible action label and refreshes on success", async () => {
    const user = userEvent.setup()
    renderConfiguration()
    vi.mocked(disableTelegramMarketAnalysisSchedule).mockResolvedValue({
      success: true,
      data: schedule,
    })

    await user.click(
      screen.getByRole("button", {
        name: viDictionary.telegram.schedule.disableTrigger,
      })
    )
    const dialog = screen.getByRole("alertdialog")
    await user.click(
      within(dialog).getByRole("button", {
        name: viDictionary.telegram.common.disable,
      })
    )

    await waitFor(() =>
      expect(disableTelegramMarketAnalysisSchedule).toHaveBeenCalledWith(11)
    )
    await waitFor(() => expect(routerRefresh).toHaveBeenCalledTimes(1))
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument()
  })

  it("keeps an unassigned feature route Select controlled when assigning a destination", async () => {
    const user = userEvent.setup()
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined)

    vi.mocked(updateTelegramFeatureSetting).mockResolvedValue({
      success: true,
      data: {
        id: 12,
        featureKey: "ECONOMIC_CALENDAR_ALERT",
        workspaceId: 7,
        enabled: false,
        destination,
      },
    })

    try {
      renderConfiguration({
        ...data,
        manageAccess: {
          ...data.manageAccess,
          featureSettings: true,
        },
      })

      const routeRow = screen
        .getByText(viDictionary.telegram.routeDefinitions.ECONOMIC_CALENDAR_ALERT.label)
        .closest("tr")
      expect(routeRow).not.toBeNull()

      await user.click(within(routeRow as HTMLElement).getByRole("combobox"))
      await user.click(
        await screen.findByRole("option", { name: destination.displayLabel })
      )

      await waitFor(() => {
        expect(updateTelegramFeatureSetting).toHaveBeenCalledWith({
          featureKey: "ECONOMIC_CALENDAR_ALERT",
          workspaceId: 7,
          destinationId: 8,
          enabled: false,
        })
      })
      await waitFor(() => expect(routerRefresh).toHaveBeenCalledTimes(1))
      expectNoSelectControlledWarning(consoleError.mock.calls)
    } finally {
      consoleError.mockRestore()
    }
  })
})
