import {
  ChartCandlestick,
  GalleryVerticalEnd,
  LayoutDashboard,
  Newspaper,
  Settings2,
} from "lucide-react"

import { ECONOMIC_CALENDAR_NAV_PERMISSIONS } from "@/app/lib/economic-calendar/permissions"
import { EVENT_NAV_PERMISSIONS } from "@/app/lib/events/permissions"
import { GRAPH_VIEW_NAV_PERMISSIONS } from "@/app/lib/graph-view/permissions"
import { MARKET_CHART_NAV_PERMISSIONS } from "@/app/lib/market-charts/permissions"
import { MARKET_QUERY_NAV_PERMISSIONS } from "@/app/lib/market-query/permissions"
import { NEWS_ARTICLE_NAV_PERMISSIONS } from "@/app/lib/news-articles/permissions"
import { NEWS_OUTLET_NAV_PERMISSIONS } from "@/app/lib/news-outlets/permissions"
import { SYSTEM_PROMPT_NAV_PERMISSIONS } from "@/app/lib/system-prompts/permissions"
import { TELEGRAM_NAV_PERMISSIONS } from "@/app/lib/telegram/permissions"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"

export interface NavSubItem {
  title: string
  url: string
  permission?: string | readonly string[]
}

export interface NavItem {
  title: string
  url: string
  icon?: React.ElementType
  isActive?: boolean
  permission?: string | readonly string[]
  items?: NavSubItem[]
}

function hasPermissionMatch(
  permissions: string[],
  requirement?: string | readonly string[]
): boolean {
  if (!requirement) {
    return true
  }

  if (typeof requirement === "string") {
    return permissions.includes(requirement)
  }

  return requirement.some((permission) => permissions.includes(permission))
}

export function createSiteConfig(dictionary: Dictionary) {
  return {
  teams: [
    {
      name: "Signapse",
      logo: GalleryVerticalEnd,
      plan: dictionary.common.adminDashboard,
    },
  ],
  brand: {
    name: "Signapse",
    logo: GalleryVerticalEnd,
    subtitle: dictionary.common.adminDashboard,
  },
  navMain: [
    {
      title: dictionary.navigation.dashboard,
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: dictionary.navigation.knowledgeGraph,
      url: "/graph-view",
      icon: LayoutDashboard,
      permission: GRAPH_VIEW_NAV_PERMISSIONS,
    },
    {
      title: dictionary.navigation.marketCharts,
      url: "/market-charts",
      icon: ChartCandlestick,
      permission: MARKET_CHART_NAV_PERMISSIONS,
    },
    {
      title: dictionary.navigation.content,
      url: "#",
      icon: Newspaper,
      items: [
        {
          title: dictionary.navigation.newsOutlets,
          url: "/news-outlets",
          permission: NEWS_OUTLET_NAV_PERMISSIONS,
        },
        {
          title: dictionary.navigation.newsArticles,
          url: "/news-articles",
          permission: NEWS_ARTICLE_NAV_PERMISSIONS,
        },
        {
          title: dictionary.navigation.events,
          url: "/events",
          permission: EVENT_NAV_PERMISSIONS,
        },
        {
          title: dictionary.navigation.economicCalendar,
          url: "/economic-calendar",
          permission: ECONOMIC_CALENDAR_NAV_PERMISSIONS,
        },
        {
          title: dictionary.navigation.marketQuery,
          url: "/market-conversations",
          permission: MARKET_QUERY_NAV_PERMISSIONS,
        },
        {
          title: dictionary.navigation.blogs,
          url: "/blogs",
          permission: "blog:read",
        },
      ],
    },
    {
      title: dictionary.navigation.settings,
      url: "#",
      icon: Settings2,
      items: [
        {
          title: dictionary.navigation.telegram,
          url: "/telegram",
          permission: TELEGRAM_NAV_PERMISSIONS,
        },
        {
          title: dictionary.navigation.aiProviders,
          url: "/ai-provider-configs",
          permission: "ai-provider-config:read",
        },
        {
          title: dictionary.navigation.systemPrompts,
          url: "/system-prompts",
          permission: SYSTEM_PROMPT_NAV_PERMISSIONS,
        },
        {
          title: dictionary.navigation.cronjobs,
          url: "/cronjobs",
          permission: "cronjob:read",
        },
        {
          title: dictionary.navigation.roles,
          url: "/roles",
          permission: "role:update",
        },
        {
          title: dictionary.navigation.developerToken,
          url: "/developer-token",
        },
      ],
    },
  ] satisfies NavItem[],
  }
}

export function filterNavItemsByPermissions(
  items: NavItem[],
  permissions: string[]
): NavItem[] {
  return items.flatMap((item) => {
    const hasDirectPermission = hasPermissionMatch(permissions, item.permission)
    const filteredSubItems = item.items?.filter((subItem) =>
      hasPermissionMatch(permissions, subItem.permission)
    )

    if (filteredSubItems) {
      if (filteredSubItems.length === 0) {
        return []
      }

      return [{ ...item, items: filteredSubItems }]
    }

    return hasDirectPermission ? [item] : []
  })
}
