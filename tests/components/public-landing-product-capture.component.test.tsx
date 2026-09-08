// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"

vi.mock("next/image", () => ({ default: "img" }))

import { LandingProductCapture } from "@/app/[lang]/landing-product-capture"

const capture = {
  feature: "ai-assistant" as const,
  locale: "vi" as const,
  src: "/images/landing/vi/ai-conversation.webp",
  width: 1200,
  height: 800,
  sourceRef: "fixture:approved-demo",
  approvalStatus: "approved" as const,
}

const labels = {
  alt: "Hội thoại với Trợ lý AI trong workspace đang hoạt động.",
  caption:
    "Ảnh hội thoại cho thấy câu hỏi và phản hồi trong workspace đang hoạt động.",
  dialogDescription: "Xem ảnh sản phẩm ở kích thước lớn hơn.",
  dialogTitle: "Ảnh hội thoại với Trợ lý AI",
  enlarge: "Xem ảnh lớn",
  close: "Đóng",
  loading: "Đang tải ảnh…",
  error: "Không thể tải ảnh này.",
}

afterEach(() => {
  cleanup()
})

describe("LandingProductCapture", () => {
  it("opens the matching image dialog and restores focus to its trigger", async () => {
    const user = userEvent.setup()
    render(<LandingProductCapture capture={capture} labels={labels} />)

    const trigger = screen.getByRole("button", { name: labels.enlarge })
    trigger.focus()
    await user.click(trigger)

    const dialog = screen.getByRole("dialog")
    expect(
      within(dialog).getByRole("heading", { name: labels.dialogTitle })
    ).toBeVisible()
    const closeButton = within(dialog).getByRole("button", {
      name: labels.close,
    })
    expect(closeButton).toBeVisible()
    expect(closeButton).toHaveFocus()
    expect(within(dialog).getByRole("status")).toHaveTextContent(labels.loading)
    expect(window.location.hash).toBe("")

    fireEvent.load(within(dialog).getByRole("img"))
    expect(within(dialog).queryByRole("status")).not.toBeInTheDocument()

    await user.keyboard("{Escape}")
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it("keeps the dialog dismissible and announces a failed large image", async () => {
    const user = userEvent.setup()
    render(<LandingProductCapture capture={capture} labels={labels} />)

    await user.click(screen.getByRole("button", { name: labels.enlarge }))
    const dialog = screen.getByRole("dialog")
    fireEvent.error(within(dialog).getByRole("img"))

    expect(within(dialog).getByRole("alert")).toHaveTextContent(labels.error)
    await user.click(within(dialog).getByRole("button", { name: labels.close }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })
})
