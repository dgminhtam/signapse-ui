import { BookOpen, Bot, GalleryVerticalEnd, LayoutDashboard, Newspaper, Settings2, SquareTerminal, TrendingUp, FileBarChart } from "lucide-react"

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
                }
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
            ],
        },
        {
            title: "AI & Tự động hóa",
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
                {
                    title: "Trang Wordpress",
                    url: "/wordpress",
                },
            ],
        },
        {
            title: "Giao dịch Bot",
            url: "#",
            icon: TrendingUp,
            items: [
                {
                    title: "Cấu hình Trade",
                    url: "/settings/trade",
                },
            ],
        },
        {
            title: "Báo cáo",
            url: "#",
            icon: FileBarChart,
            items: [
                {
                    title: "Danh sách báo cáo",
                    url: "/reports",
                },
            ],
        },
    ],
}
