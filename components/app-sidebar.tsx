"use client"

import * as React from "react"
import { SignOutButton } from "@clerk/nextjs"
import {
  BadgeCheckIcon,
  BellIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  LogOutIcon,
  SparklesIcon,
} from "lucide-react"
import { LocalizedLink as Link } from "@/components/localized-link"
import { usePathname } from "next/navigation"

import { useLocalization } from "@/app/lib/i18n/provider"
import { stripLocaleFromPathname } from "@/app/lib/i18n/routing"
import { NavItem, createSiteConfig, filterNavItemsByPermissions } from "@/config/site"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "./ui/sidebar"

const USER_MENU_TRIGGER_ID = "app-sidebar-user-menu-trigger"

function getNavCollapsibleContentId(index: number) {
  return `app-sidebar-nav-${index}-content`
}

type SimpleUser = {
  imageUrl: string
  fullName: string | null
  username: string | null
} | null

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: SimpleUser
  isAuthenticated: boolean
  permissions: string[]
}

export function AppSidebar({
  user,
  isAuthenticated,
  permissions,
  ...props
}: AppSidebarProps) {
  const { dictionary } = useLocalization()
  const localizedSiteConfig = createSiteConfig(dictionary)
  const visibleNavItems = filterNavItemsByPermissions(
    localizedSiteConfig.navMain,
    permissions
  )

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarBrand />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={visibleNavItems} />
      </SidebarContent>
      <SidebarFooter>{isAuthenticated && <NavUser user={user} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function SidebarBrand() {
  const { dictionary } = useLocalization()
  const localizedSiteConfig = createSiteConfig(dictionary)
  const Logo = localizedSiteConfig.brand.logo

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild size="lg" tooltip={localizedSiteConfig.brand.name}>
          <Link href="/">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Logo className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-medium">{localizedSiteConfig.brand.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {localizedSiteConfig.brand.subtitle}
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname()
  const { dictionary } = useLocalization()
  const pathWithoutLocale = stripLocaleFromPathname(pathname)

  const matchesPath = (url: string) => {
    if (url === "/") {
      return pathWithoutLocale === "/"
    }

    return pathWithoutLocale === url || pathWithoutLocale.startsWith(`${url}/`)
  }

  const hasActiveSubItem = (subItems?: { title: string; url: string }[]) => {
    return subItems?.some((subItem) => matchesPath(subItem.url)) ?? false
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{dictionary.navigation.platform}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {items.map((item, itemIndex) => {
            const hasSubItems = (item.items?.length ?? 0) > 0
            const isActive = hasSubItems ? hasActiveSubItem(item.items) : matchesPath(item.url)
            const collapsibleContentId = getNavCollapsibleContentId(itemIndex)

            if (!hasSubItems) {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive}
                    className="h-8 rounded-lg font-medium data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground data-active:hover:bg-sidebar-primary data-active:hover:text-sidebar-primary-foreground"
                  >
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            }

            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive ?? isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild aria-controls={collapsibleContentId}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={false}
                      className="h-8 rounded-lg font-medium"
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent id={collapsibleContentId}>
                    <SidebarMenuSub className="ml-3.5 mr-0 py-1 pr-0">
                      {item.items?.map((subItem) => {
                        const isSubItemActive = matchesPath(subItem.url)

                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              isActive={isSubItemActive}
                              asChild
                              className="h-8 rounded-lg font-medium data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground data-active:hover:bg-sidebar-primary data-active:hover:text-sidebar-primary-foreground"
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

interface NavUserProps {
  user: SimpleUser
}

function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar()
  const { dictionary } = useLocalization()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild id={USER_MENU_TRIGGER_ID}>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.imageUrl ?? ""} alt={user?.fullName ?? ""} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.fullName ?? ""}</span>
                <span className="truncate text-xs">{user?.username ?? ""}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
            aria-labelledby={USER_MENU_TRIGGER_ID}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.imageUrl ?? ""} alt={user?.fullName ?? ""} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.fullName ?? ""}</span>
                  <span className="truncate text-xs">{user?.username ?? ""}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <SparklesIcon />
                {dictionary.auth.upgrade}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/account">
                  <BadgeCheckIcon />
                  {dictionary.auth.account}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon />
                {dictionary.auth.billing}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                {dictionary.auth.notifications}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <SignOutButton>
                  <div className="flex w-full items-center gap-2 px-1 py-1.5">
                    <LogOutIcon />
                    <span>{dictionary.auth.signOut}</span>
                  </div>
                </SignOutButton>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
