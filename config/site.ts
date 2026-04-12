import {
  Bot,
  GalleryVerticalEnd,
  LayoutDashboard,
  Newspaper,
  Settings2,
  TrendingUp,
} from "lucide-react"

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
      title: "Tổng quan",
      url: "#",
      icon: LayoutDashboard,
      items: [
        {
          title: "Trang chủ",
          url: "/",
        },
      ],
    },
    {
      title: "Nội dung",
      url: "#",
      icon: Newspaper,
      items: [
        {
          title: "Nguồn tin",
          url: "/news-sources",
        },
        {
          title: "Bài viết",
          url: "/articles",
        },
        {
          title: "Chuyên mục blog",
          url: "/blogs",
        },
        {
          title: "Kho kiến thức",
          url: "/wiki",
        },
      ],
    },
    {
      title: "AI",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Nhà cung cấp AI",
          url: "/ai-provider-configs",
        },
      ],
    },
    {
      title: "Thị trường",
      url: "#",
      icon: TrendingUp,
      items: [
        {
          title: "Lịch kinh tế",
          url: "/economic-calendar",
        },
      ],
    },
    {
      title: "Vận hành",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Tác vụ định kỳ",
          url: "/cronjobs",
        },
      ],
    },
  ],
}
