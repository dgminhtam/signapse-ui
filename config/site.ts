import {
  Bot,
  FileBarChart,
  GalleryVerticalEnd,
  LayoutDashboard,
  Newspaper,
  Settings2,
  TrendingUp,
  ServerCrash,
  Clock,
} from "lucide-react"

export const siteConfig = {
  teams: [
    {
      name: "Signapse",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Bảng điều khiển",
      url: "#",
      icon: LayoutDashboard,
      items: [
        {
          title: "Tổng quan",
          url: "/",
        },
      ],
    },
    {
      title: "Quản lý nội dung",
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
          title: "Quản lý Blog",
          url: "/blogs",
        },
        {
          title: "Đăng tải Wordpress",
          url: "/wordpress",
        },
      ],
    },
    {
      title: "Giao dịch & Tín hiệu",
      url: "#",
      icon: TrendingUp,
      items: [
        {
          title: "Cấu hình Trade",
          url: "/settings/trade",
        },
        {
          title: "Danh sách theo dõi",
          url: "/watchlist",
        },
      ],
    },
    {
      title: "AI & Tương tác",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Mẫu AI (Prompts)",
          url: "/prompts",
        },
        {
          title: "Kênh Telegram",
          url: "/telegram",
        },
      ],
    },
    {
      title: "Hệ thống & Báo cáo",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Cronjob",
          url: "/cronjobs",
        },
        {
          title: "Thống kê & Báo cáo",
          url: "/reports",
        },
        {
          title: "Quản trị Dịch vụ",
          url: "/system",
        },
        {
          title: "Cài đặt chung",
          url: "/settings",
        },
      ],
    },
  ],
}
