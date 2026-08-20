// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import {
  cloneElement,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react"

const { getEventById, getNewsArticleById, useHasAnyPermission } = vi.hoisted(
  () => ({
    getEventById: vi.fn(),
    getNewsArticleById: vi.fn(),
    useHasAnyPermission: vi.fn(() => true),
  })
)

vi.mock("@/app/api/events/action", () => ({
  getEventById,
}))

vi.mock("@/app/api/news-articles/action", () => ({
  getNewsArticleById,
}))

vi.mock("@/components/permission-provider", () => ({
  useHasAnyPermission,
}))

vi.mock("@/components/ui/drawer", () => ({
  DrawerHeader: ({ children }: { children: ReactNode }) => (
    <header>{children}</header>
  ),
  DrawerTitle: ({ children }: { children: ReactNode }) => (
    <h2>{children}</h2>
  ),
}))

vi.mock("@/components/ui/drawer-content-in-overlay", () => ({
  DrawerInOverlay: ({
    open,
    children,
  }: {
    open?: boolean
    children: ReactNode
  }) => (open ? <div role="dialog">{children}</div> : null),
  DrawerContentInOverlay: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}))

vi.mock("@/components/ui/badge", () => ({
  Badge: ({
    children,
    render,
  }: {
    children: ReactNode
    render?: ReactElement
  }) => (render ? cloneElement(render, {}, children) : <span>{children}</span>),
}))

vi.mock("next/image", () => ({
  default: (props: ComponentProps<"img">) => (
    <img {...props} alt={props.alt ?? ""} />
  ),
}))

import { vi as viDictionary } from "@/app/lib/i18n/dictionaries/vi"
import { LocalizationProvider } from "@/app/lib/i18n/provider"
import type { NewsArticleResponse } from "@/app/lib/news-articles/definitions"

import { LocalEntityQuickDetailDrawer } from "@/app/[lang]/(main)/local-entity-quick-detail-drawer"

const article: NewsArticleResponse = {
  id: 42,
  title: "Bài viết mẫu",
  description: "Tóm tắt bài viết.",
  url: "https://example.com/articles/42",
  sourceName: "Reuters",
  publishedAt: "2026-08-19T12:30:00.000Z",
  status: "INGESTED",
  createdDate: "2026-08-19T12:00:00.000Z",
  content: "# Nội dung\n\nMột đoạn Markdown.",
  featureImage: {
    id: 7,
    name: "article-image.jpg",
    altText: "Ảnh minh họa bài viết",
    urlOriginal: "/images/article-original.jpg",
    urlMedium: "/images/article-medium.jpg",
  },
  linkedEvents: [
    {
      eventId: 9,
      eventTitle: "Sự kiện liên quan không hiển thị",
    },
  ],
}

function renderDrawer(selectedArticle: NewsArticleResponse = article) {
  getNewsArticleById.mockResolvedValueOnce(selectedArticle)

  return render(
    <LocalizationProvider locale="vi" dictionary={viDictionary}>
      <LocalEntityQuickDetailDrawer
        entity={{ id: selectedArticle.id, kind: "news-article" }}
        onClose={vi.fn()}
      />
    </LocalizationProvider>
  )
}

describe("LocalEntityQuickDetailDrawer news article reading surface", () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it("renders the current reader hierarchy without linked-event or full-page actions", async () => {
    renderDrawer()

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 2, name: article.title })
      ).toBeInTheDocument()
    })

    expect(screen.getByText(article.description!)).toBeInTheDocument()
    expect(screen.getByText(article.sourceName!)).toBeInTheDocument()
    expect(
      screen.getByRole("link", {
        name: viDictionary.newsArticles.openOriginalLink,
      })
    ).toHaveAttribute("href", article.url)
    expect(
      screen.getByRole("img", { name: article.featureImage!.altText! })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: "Nội dung" })
    ).toBeInTheDocument()
    expect(
      screen.queryByText("Sự kiện liên quan không hiển thị")
    ).not.toBeInTheDocument()
    expect(screen.getAllByRole("link")).toHaveLength(1)
  })

  it("omits the original-source action and media when optional values are absent", async () => {
    const articleWithoutOptionalRegions: NewsArticleResponse = {
      ...article,
      id: 43,
      title: "Bài viết không có URL",
      description: undefined,
      url: "",
      featureImage: undefined,
    }

    renderDrawer(articleWithoutOptionalRegions)

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          level: 2,
          name: articleWithoutOptionalRegions.title,
        })
      ).toBeInTheDocument()
    })

    expect(screen.queryByRole("link")).not.toBeInTheDocument()
    expect(screen.queryByRole("img")).not.toBeInTheDocument()
    expect(
      screen.queryByText("Sự kiện liên quan không hiển thị")
    ).not.toBeInTheDocument()
  })
})
