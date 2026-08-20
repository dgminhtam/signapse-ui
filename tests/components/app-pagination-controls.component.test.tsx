// @vitest-environment jsdom

import { cleanup, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"

const { routerPush } = vi.hoisted(() => ({
  routerPush: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  usePathname: () => "/vi/events",
  useRouter: () => ({ push: routerPush }),
  useSearchParams: () => new URLSearchParams("page=2&size=20"),
}))

import { vi as viDictionary } from "@/app/lib/i18n/dictionaries/vi"
import { LocalizationProvider } from "@/app/lib/i18n/provider"
import { AppPaginationControls } from "@/components/app-pagination-controls"

const page = {
  number: 1,
  numberOfElements: 20,
  size: 20,
  totalElements: 55,
  totalPages: 3,
}

function renderPagination() {
  return render(
    <LocalizationProvider locale="vi" dictionary={viDictionary}>
      <AppPaginationControls page={page} />
    </LocalizationProvider>
  )
}

describe("AppPaginationControls", () => {
  afterEach(() => {
    cleanup()
    routerPush.mockReset()
  })

  it("renders the current page and preserves query state when navigating", async () => {
    const user = userEvent.setup()
    renderPagination()

    expect(screen.getByText("Hiển thị 21-40 trên 55 kết quả")).toBeVisible()

    const navigation = screen.getByRole("navigation", {
      name: viDictionary.pagination.navigationLabel,
    })
    expect(
      within(navigation).getByRole("button", {
        name: "Đi tới trang 2",
      })
    ).toHaveAttribute("aria-current", "page")

    await user.click(
      within(navigation).getByRole("button", {
        name: viDictionary.pagination.goToNext,
      })
    )

    await vi.waitFor(() =>
      expect(routerPush).toHaveBeenCalledWith("/vi/events?page=3&size=20")
    )
  })
})
