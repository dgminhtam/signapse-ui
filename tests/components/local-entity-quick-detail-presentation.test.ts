import { describe, expect, it } from "vitest"

import {
  resolveLocalQuickDetailPresentation,
  type LocalQuickDetailKind,
  type LocalQuickDetailOwner,
} from "@/app/[lang]/(main)/local-entity-quick-detail-presentation"

describe("resolveLocalQuickDetailPresentation", () => {
  it.each([
    ["event", "right", "32rem", "100dvh", "100dvh"],
    ["news-article", "right", "44rem", "100dvh", "100dvh"],
  ])(
    "uses Dashboard side-sheet geometry at 1440px for %s",
    (kind, placement, width, height, maxHeight) => {
      expect(
        resolveLocalQuickDetailPresentation({
          kind: kind as LocalQuickDetailKind,
          owner: "dashboard",
          viewportWidth: 1440,
        })
      ).toEqual({
        contentHeight: height,
        contentMaxHeight: maxHeight,
        contentWidth: width,
        placement,
        swipeDirection: "right",
      })
    }
  )

  it.each([
    ["event", "min(60dvh, 36rem)"],
    ["news-article", "min(72dvh, 48rem)"],
  ])(
    "uses the shared bottom-sheet geometry at 768px for %s",
    (kind, height) => {
      const presentation = resolveLocalQuickDetailPresentation({
        kind: kind as LocalQuickDetailKind,
        owner: "graph-view",
        viewportWidth: 768,
      })

      expect(presentation).toMatchObject({
        contentMaxHeight: height,
        placement: "bottom",
        swipeDirection: "down",
      })

      if (kind === "event") {
        expect(presentation).not.toHaveProperty("contentHeight")
      } else {
        expect(presentation.contentHeight).toBe(height)
      }
    }
  )

  it.each([
    ["dashboard", "event"],
    ["graph-view", "news-article"],
    ["market-charts", "event"],
  ])("uses narrow bottom placement for %s/%s", (owner, kind) => {
    expect(
      resolveLocalQuickDetailPresentation({
        kind: kind as LocalQuickDetailKind,
        owner: owner as LocalQuickDetailOwner,
        viewportWidth: 767,
      })
    ).toMatchObject({
      contentMaxHeight: kind === "event" ? "90dvh" : "90dvh",
      placement: "bottom",
      swipeDirection: "down",
    })
  })
})
