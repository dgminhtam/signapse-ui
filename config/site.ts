import {
  GalleryVerticalEnd,
  LayoutDashboard,
  Newspaper,
  Settings2,
} from "lucide-react"

import { EVENT_NAV_PERMISSIONS } from "@/app/lib/events/permissions"
import { MARKET_QUERY_NAV_PERMISSIONS } from "@/app/lib/market-query/permissions"
import { SOURCE_DOCUMENT_NAV_PERMISSIONS } from "@/app/lib/source-documents/permissions"

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
      plan: "Trang quản trị",
    },
  ],
  brand: {
    name: "Signapse",
    logo: GalleryVerticalEnd,
    subtitle: "Trang quản trị",
  },
  navMain: [
    {
      title: "Biểu đồ tri thức",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Nội dung",
      url: "#",
      icon: Newspaper,
      items: [
        {
          title: "Nguồn dữ liệu",
          url: "/sources",
          permission: "source:read",
        },
        {
          title: "Tài liệu nguồn",
          url: "/source-documents",
          permission: SOURCE_DOCUMENT_NAV_PERMISSIONS,
        },
        {
          title: "Sự kiện",
          url: "/events",
          permission: EVENT_NAV_PERMISSIONS,
        },
        {
          title: "Truy vấn thị trường",
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
      title: "Cài đặt",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Nhà cung cấp AI",
          url: "/ai-provider-configs",
          permission: "ai-provider-config:read",
        },
        {
          title: "Tác vụ định kỳ",
          url: "/cronjobs",
          permission: "cronjob:read",
        },
        {
          title: "Vai trò",
          url: "/roles",
          permission: "role:update",
        },
        {
          title: "Token nhà phát triển",
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
