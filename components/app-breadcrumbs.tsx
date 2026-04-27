"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb"

const FRIENDLY_SEGMENT_NAMES: Record<string, string> = {
  categories: "Danh mục",
  create: "Tạo mới",
  "ai-provider-configs": "Nhà cung cấp AI",
  blogs: "Blog",
  cronjobs: "Tác vụ định kỳ",
  "developer-token": "Token nhà phát triển",
  "economic-calendar": "Lịch kinh tế",
  events: "Sự kiện",
  "graph-view": "Biểu đồ tri thức",
  "market-query": "Truy vấn thị trường",
  "news-articles": "Tài liệu nguồn",
  "news-outlets": "Nguồn tin",
  roles: "Vai trò",
  "source-documents": "Tài liệu nguồn",
  "system-prompts": "Prompt hệ thống",
}

function formatSegment(segment: string, index: number) {
  const decodedSegment = decodeURIComponent(segment)

  if (FRIENDLY_SEGMENT_NAMES[decodedSegment]) {
    return FRIENDLY_SEGMENT_NAMES[decodedSegment]
  }

  if (index > 0) {
    return "Chi tiết"
  }

  return decodedSegment
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function AppBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap">
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink asChild>
            <Link href="/">Trang chủ</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`
          const isLast = index === segments.length - 1
          const title = formatSegment(segment, index)

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className={!isLast ? "hidden md:block" : "min-w-0"}>
                {isLast ? (
                  <BreadcrumbPage className="max-w-[45vw] truncate md:max-w-[36rem]">
                    {title}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
