// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

vi.mock("@/app/[lang]/(main)/dashboard/dashboard-quick-detail", () => ({
  DashboardQuickDetailButton: ({
    entity,
    ...props
  }: React.ComponentProps<"button"> & { entity: unknown }) => {
    void entity
    return <button {...props} />
  },
}))

import { vi as viDictionary } from "@/app/lib/i18n/dictionaries/vi"
import { LocalizationProvider } from "@/app/lib/i18n/provider"
import type { DashboardRecentEventsMetricResponse } from "@/app/lib/dashboard/definitions"
import { EventTimeline } from "@/app/[lang]/(main)/dashboard/event-timeline"

const metric: DashboardRecentEventsMetricResponse = {
  state: "AVAILABLE",
  errorCode: null,
  items: [
    {
      id: 11,
      title: "Tàu chở hàng bị tấn công ở eo biển Hormuz",
      description: "Một mô tả sự kiện thị trường.",
      occurredAt: "2026-07-29T00:00:00.000Z",
      confidence: 0.95,
      themes: [],
      affectedAssets: [],
    },
  ],
}

describe("EventTimeline link composition", () => {
  afterEach(() => {
    cleanup()
  })

  it("renders view-all as a native localized link", () => {
    render(
      <LocalizationProvider locale="vi" dictionary={viDictionary}>
        <EventTimeline
          dictionary={viDictionary}
          error={null}
          locale="vi"
          metric={metric}
        />
      </LocalizationProvider>
    )

    const viewAll = screen.getByRole("link", {
      name: viDictionary.workspaceOverview.eventTimeline.viewAll,
    })

    expect(viewAll.tagName).toBe("A")
    expect(viewAll).toHaveAttribute("href", "/vi/events")
    expect(
      screen.queryByRole("button", {
        name: viDictionary.workspaceOverview.eventTimeline.viewAll,
      })
    ).not.toBeInTheDocument()
  })
})
