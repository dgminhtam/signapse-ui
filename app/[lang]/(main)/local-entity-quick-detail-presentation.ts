export type LocalQuickDetailOwner = "dashboard" | "graph-view" | "market-charts"

export type LocalQuickDetailKind = "event" | "news-article"

export type LocalQuickDetailPlacement = "bottom" | "right"

export interface LocalQuickDetailPresentation {
  placement: LocalQuickDetailPlacement
  swipeDirection: "down" | "right"
  contentWidth?: string
  contentHeight?: string
  contentMaxHeight?: string
}

export const LOCAL_QUICK_DETAIL_BREAKPOINTS = {
  dashboardSideSheet: 1440,
  bottomSheet: 768,
} as const

export function resolveLocalQuickDetailPresentation({
  kind,
  owner,
  viewportWidth,
}: {
  kind: LocalQuickDetailKind
  owner: LocalQuickDetailOwner
  viewportWidth: number
}): LocalQuickDetailPresentation {
  const isDashboardSideSheet =
    owner === "dashboard" &&
    viewportWidth >= LOCAL_QUICK_DETAIL_BREAKPOINTS.dashboardSideSheet

  if (isDashboardSideSheet) {
    return {
      contentHeight: "100dvh",
      contentMaxHeight: "100dvh",
      contentWidth: kind === "event" ? "32rem" : "44rem",
      placement: "right",
      swipeDirection: "right",
    }
  }

  if (viewportWidth < LOCAL_QUICK_DETAIL_BREAKPOINTS.bottomSheet) {
    return kind === "event"
      ? {
          contentMaxHeight: "90dvh",
          placement: "bottom",
          swipeDirection: "down",
        }
      : {
          contentHeight: "90dvh",
          contentMaxHeight: "90dvh",
          placement: "bottom",
          swipeDirection: "down",
        }
  }

  return kind === "event"
    ? {
        contentMaxHeight: "min(60dvh, 36rem)",
        placement: "bottom",
        swipeDirection: "down",
      }
    : {
        contentHeight: "min(72dvh, 48rem)",
        contentMaxHeight: "min(72dvh, 48rem)",
        placement: "bottom",
        swipeDirection: "down",
      }
}
