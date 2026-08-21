import { describe, expect, it } from "vitest"

import {
  resolveLocalQuickDetailPresentation,
  type LocalQuickDetailKind,
  type LocalQuickDetailOwner,
} from "@/app/[lang]/(main)/local-entity-quick-detail-presentation"

const supportedQuickDetailCases: Array<
  [LocalQuickDetailOwner, LocalQuickDetailKind]
> = [
  ["dashboard", "event"],
  ["dashboard", "news-article"],
  ["graph-view", "event"],
  ["graph-view", "news-article"],
  ["market-charts", "event"],
]

function resolve(
  [owner, kind]: [LocalQuickDetailOwner, LocalQuickDetailKind],
  viewportWidth: number
) {
  return resolveLocalQuickDetailPresentation({
    kind,
    owner,
    viewportWidth,
  })
}

describe("resolveLocalQuickDetailPresentation", () => {
  it.each(supportedQuickDetailCases)(
    "uses shared side-sheet geometry at 1440px for %s/%s",
    (owner, kind) => {
      expect(resolve([owner, kind], 1440)).toEqual({
        contentHeight: "100dvh",
        contentMaxHeight: "100dvh",
        contentWidth: kind === "event" ? "32rem" : "44rem",
        placement: "right",
        swipeDirection: "right",
      })
    }
  )

  it.each([768, 1439])(
    "uses shared bottom-sheet geometry at %spx for every approved owner",
    (viewportWidth) => {
      for (const [owner, kind] of supportedQuickDetailCases) {
        const presentation = resolve([owner, kind], viewportWidth)
        const expectedHeight =
          kind === "event" ? "min(60dvh, 36rem)" : "min(72dvh, 48rem)"

        expect(presentation).toMatchObject({
          contentMaxHeight: expectedHeight,
          placement: "bottom",
          swipeDirection: "down",
        })

        if (kind === "event") {
          expect(presentation).not.toHaveProperty("contentHeight")
        } else {
          expect(presentation.contentHeight).toBe(expectedHeight)
        }
      }
    }
  )

  it("keeps placement independent from the owner at the desktop threshold", () => {
    const eventPresentations = supportedQuickDetailCases
      .filter(([, kind]) => kind === "event")
      .map((testCase) => resolve(testCase, 1440))

    expect(eventPresentations).toHaveLength(3)
    expect(eventPresentations[1]).toEqual(eventPresentations[0])
    expect(eventPresentations[2]).toEqual(eventPresentations[0])
  })

  it.each(supportedQuickDetailCases)(
    "uses narrow bottom placement at 767px for %s/%s",
    (owner, kind) => {
      const presentation = resolve([owner, kind], 767)

      expect(presentation).toMatchObject({
        contentMaxHeight: "90dvh",
        placement: "bottom",
        swipeDirection: "down",
      })

      if (kind === "event") {
        expect(presentation).not.toHaveProperty("contentHeight")
      } else {
        expect(presentation.contentHeight).toBe("90dvh")
      }
    }
  )
})
