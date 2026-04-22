import {
  GalleryVerticalEnd,
  LayoutDashboard,
  Newspaper,
  Settings2,
} from "lucide-react"

import { EVENT_NAV_PERMISSIONS } from "@/app/lib/events/permissions"
import { GRAPH_VIEW_NAV_PERMISSIONS } from "@/app/lib/graph-view/permissions"
import { MARKET_QUERY_NAV_PERMISSIONS } from "@/app/lib/market-query/permissions"
import { NEWS_ARTICLE_NAV_PERMISSIONS } from "@/app/lib/news-articles/permissions"
import { NEWS_OUTLET_NAV_PERMISSIONS } from "@/app/lib/news-outlets/permissions"

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

export const siteConfig = {
  teams: [
    {
      name: "Signapse",
      logo: GalleryVerticalEnd,
      plan: "Trang quan tri",
    },
  ],
  brand: {
    name: "Signapse",
    logo: GalleryVerticalEnd,
    subtitle: "Trang quan tri",
  },
  navMain: [
    {
      title: "Bieu do tri thuc",
      url: "/graph-view",
      icon: LayoutDashboard,
      permission: GRAPH_VIEW_NAV_PERMISSIONS,
    },
    {
      title: "Noi dung",
      url: "#",
      icon: Newspaper,
      items: [
        {
          title: "Nguon tin",
          url: "/news-outlets",
          permission: NEWS_OUTLET_NAV_PERMISSIONS,
        },
        {
          title: "Bai viet tin tuc",
          url: "/news-articles",
          permission: NEWS_ARTICLE_NAV_PERMISSIONS,
        },
        {
          title: "Su kien",
          url: "/events",
          permission: EVENT_NAV_PERMISSIONS,
        },
        {
          title: "Truy van thi truong",
          url: "/market-query",
          permission: MARKET_QUERY_NAV_PERMISSIONS,
        },
        {
          title: "Blog",
          url: "/blogs",
          permission: "blog:read",
        },
      ],
    },
    {
      title: "Cai dat",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Nha cung cap AI",
          url: "/ai-provider-configs",
          permission: "ai-provider-config:read",
        },
        {
          title: "Tac vu dinh ky",
          url: "/cronjobs",
          permission: "cronjob:read",
        },
        {
          title: "Vai tro",
          url: "/roles",
          permission: "role:update",
        },
        {
          title: "Token nha phat trien",
          url: "/developer-token",
        },
      ],
    },
  ] satisfies NavItem[],
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
