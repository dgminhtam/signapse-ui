import {
  GalleryVerticalEnd,
  LayoutDashboard,
  Newspaper,
  Settings2,
} from "lucide-react"

export interface NavSubItem {
  title: string
  url: string
  permission?: string
}

export interface NavItem {
  title: string
  url: string
  icon?: React.ElementType
  isActive?: boolean
  permission?: string
  items?: NavSubItem[]
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
      title: "Đồ thị kiến thức",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Nội dung",
      url: "#",
      icon: Newspaper,
      items: [
        {
          title: "Nguồn tin",
          url: "/sources",
          permission: "source:read",
        },
        {
          title: "Bài viết",
          url: "/articles",
          permission: "article:read",
        },
        {
          title: "Blog",
          url: "/blogs",
          permission: "blog:read",
        },
        {
          title: "Lịch kinh tế",
          url: "/economic-calendar",
          permission: "event:read",
        },
        {
          title: "Wiki",
          url: "/wiki",
          permission: "wiki:read",
        },
      ],
    },
    {
      title: "Setting",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "AI providers",
          url: "/ai-provider-configs",
          permission: "ai-provider-config:read",
        },
        {
          title: "cronjob",
          url: "/cronjobs",
          permission: "cronjob:read",
        },
        {
          title: "Roles",
          url: "/roles",
          permission: "role:update",
        },
        {
          title: "Developer Token",
          url: "/developer-token",
          permission: "system:admin",
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
    const hasDirectPermission = !item.permission || permissions.includes(item.permission)
    const filteredSubItems = item.items?.filter(
      (subItem) => !subItem.permission || permissions.includes(subItem.permission)
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
