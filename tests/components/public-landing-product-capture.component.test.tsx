// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

vi.mock("next/image", () => ({ default: "img" }))

import { LandingProductCapture } from "@/app/[lang]/landing-product-capture"

const capture = {
  feature: "knowledge-graph" as const,
  locale: "vi" as const,
  src: "/images/landing/vi/knowledge-graph.webp",
  width: 1200,
  height: 800,
  sourceRef: "fixture:approved-demo",
  approvalStatus: "approved" as const,
}

const labels = {
  alt: "Đồ thị Tri thức hiển thị sự kiện, tài sản và nguồn tin liên quan.",
  label: "Ảnh Đồ thị Tri thức",
  caption: "Ảnh Graph View cho thấy các mối liên hệ trong thị trường.",
  error: "Không thể tải ảnh này.",
}

afterEach(() => {
  cleanup()
})

describe("LandingProductCapture", () => {
  it("renders the approved capture without an enlargement interaction", () => {
    render(<LandingProductCapture capture={capture} labels={labels} />)

    expect(screen.getByAltText(labels.alt)).toBeVisible()
    expect(screen.getByText(labels.caption)).toBeVisible()
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("keeps an inline image failure understandable", () => {
    render(<LandingProductCapture capture={capture} labels={labels} />)

    fireEvent.error(screen.getByAltText(labels.alt))

    expect(screen.getByRole("img", { name: labels.alt })).toHaveTextContent(
      labels.error
    )
    expect(screen.getByText(labels.caption)).toBeVisible()
  })
})
