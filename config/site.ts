import {
  GalleryVerticalEnd,
  LayoutDashboard,
  Newspaper,
  Settings2,
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
          url: "/news-sources",
        },
        {
          title: "Bài viết",
          url: "/articles",
        },
        {
          title: "Blog",
          url: "/blogs",
        },
        {
          title: "Lịch kinh tế",
          url: "/economic-calendar",
        },
        {
          title: "Wiki",
          url: "/wiki",
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
        },
        {
          title: "cronjob",
          url: "/cronjobs",
        },
      ],
    },
  ],
}
