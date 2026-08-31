"use client"

import * as React from "react"
import { SignOutButton } from "@clerk/nextjs"
import {
  BadgeCheckIcon,
  BellIcon,
  ClipboardListIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  KeyRound,
  LogOutIcon,
  MessageSquareText,
  XIcon,
} from "lucide-react"
import { LocalizedLink as Link } from "@/components/localized-link"
import { usePathname } from "next/navigation"

import { useLocalization } from "@/app/lib/i18n/provider"
import { stripLocaleFromPathname } from "@/app/lib/i18n/routing"
import { FeedbackComposeDialog } from "@/components/feedback/feedback-compose-dialog"
import {
  NavItem,
  NavSection,
  createSiteConfig,
  filterNavItemsByPermissions,
} from "@/config/site"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuLinkItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { DropdownMenuContentInOverlay } from "./ui/dropdown-menu-content-in-overlay"
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

function getNavCollapsibleContentId(id: string) {
  return `app-sidebar-nav-${id}-content`
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
  isP0FixtureMode?: boolean
}

export function AppSidebar({
  user,
  isAuthenticated,
  permissions,
  isP0FixtureMode = false,
  ...props
}: AppSidebarProps) {
  const { dictionary } = useLocalization()
  const localizedSiteConfig = createSiteConfig(dictionary)
  const visibleNavSections = filterNavItemsByPermissions(
    localizedSiteConfig.navMain,
    permissions
  )

  return (
    <Sidebar
      collapsible="icon"
      mobileTitle={dictionary.navigation.mobileSidebarTitle}
      mobileDescription={dictionary.navigation.mobileSidebarDescription}
      {...props}
    >
      <SidebarHeader className="relative">
        <SidebarBrand />
        <MobileSidebarCloseButton />
      </SidebarHeader>
      <SidebarContent>
        <NavMain sections={visibleNavSections} />
      </SidebarContent>
      <SidebarFooter>
        {isAuthenticated && (
          <NavUser user={user} isP0FixtureMode={isP0FixtureMode} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function MobileSidebarCloseButton() {
  const { dictionary } = useLocalization()
  const { isMobile, setOpenMobile } = useSidebar()

  if (!isMobile) return null

  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-2 right-2 size-11 focus-visible:ring-sidebar-ring md:hidden"
      aria-label={dictionary.navigation.closeSidebar}
      onClick={() => setOpenMobile(false)}
    >
      <XIcon />
      <span className="sr-only">{dictionary.navigation.closeSidebar}</span>
    </Button>
  )
}

function SidebarBrand() {
  const { dictionary } = useLocalization()
  const { isMobile } = useSidebar()
  const localizedSiteConfig = createSiteConfig(dictionary)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          render={<Link href="/dashboard" />}
          size="lg"
          tooltip={localizedSiteConfig.brand.name}
          className={cn(isMobile && "pr-10")}
        >
          <Logo width={32} height={32} />
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-medium">
              {localizedSiteConfig.brand.name}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {localizedSiteConfig.brand.subtitle}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function NavMain({ sections }: { sections: NavSection[] }) {
  const pathname = usePathname()
  const { isMobile, state } = useSidebar()
  const pathWithoutLocale = stripLocaleFromPathname(pathname)
  const isCollapsedDesktop = state === "collapsed" && !isMobile

  const matchesPath = (url: string) => {
    return pathWithoutLocale === url || pathWithoutLocale.startsWith(`${url}/`)
  }

  const hasActiveSubItem = (subItems?: { title: string; url: string }[]) => {
    return subItems?.some((subItem) => matchesPath(subItem.url)) ?? false
  }

  return sections.map((section) => (
    <SidebarGroup key={section.id}>
      <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {section.items.map((item) => {
            const hasSubItems = (item.items?.length ?? 0) > 0
            const isActive = hasSubItems
              ? hasActiveSubItem(item.items)
              : matchesPath(item.url)

            return (
              <NavMainItem
                key={item.id}
                item={item}
                isActive={isActive}
                isCollapsedDesktop={isCollapsedDesktop}
                matchesPath={matchesPath}
              />
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ))
}

const navMenuButtonClassName =
  "h-11 rounded-lg font-medium md:h-8 data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground data-active:hover:bg-sidebar-primary data-active:hover:text-sidebar-primary-foreground"

function NavMainItem({
  item,
  isActive,
  isCollapsedDesktop,
  matchesPath,
}: {
  item: NavItem
  isActive: boolean
  isCollapsedDesktop: boolean
  matchesPath: (url: string) => boolean
}) {
  if (!item.items?.length) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          render={<Link href={item.url} />}
          tooltip={item.title}
          isActive={isActive}
          aria-current={isActive ? "page" : undefined}
          className={navMenuButtonClassName}
        >
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return isCollapsedDesktop ? (
    <CollapsedNavGroup item={item} matchesPath={matchesPath} />
  ) : (
    <ExpandedNavGroup
      item={item}
      isActive={isActive}
      matchesPath={matchesPath}
    />
  )
}

function ExpandedNavGroup({
  item,
  isActive,
  matchesPath,
}: {
  item: NavItem
  isActive: boolean
  matchesPath: (url: string) => boolean
}) {
  const collapsibleContentId = getNavCollapsibleContentId(item.id)

  return (
    <Collapsible
      defaultOpen={isActive}
      className="group/collapsible"
      render={<SidebarMenuItem />}
    >
      <CollapsibleTrigger
        aria-controls={collapsibleContentId}
        render={
          <SidebarMenuButton
            tooltip={item.title}
            isActive={false}
            className={navMenuButtonClassName}
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        }
      />
      <CollapsibleContent id={collapsibleContentId}>
        <SidebarMenuSub className="mr-0 ml-3.5 py-1 pr-0">
          {item.items?.map((subItem) => {
            const isSubItemActive = matchesPath(subItem.url)

            return (
              <SidebarMenuSubItem key={subItem.id}>
                <SidebarMenuSubButton
                  isActive={isSubItemActive}
                  render={<Link href={subItem.url} />}
                  aria-current={isSubItemActive ? "page" : undefined}
                  className={navMenuButtonClassName}
                >
                  <span>{subItem.title}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            )
          })}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}

function CollapsedNavGroup({
  item,
  matchesPath,
}: {
  item: NavItem
  matchesPath: (url: string) => boolean
}) {
  return (
    <SidebarMenuItem>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          render={
            <SidebarMenuButton
              tooltip={item.title}
              aria-haspopup="menu"
              className={navMenuButtonClassName}
            />
          }
        >
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContentInOverlay
          side="right"
          align="start"
          sideOffset={8}
          className="min-w-56"
        >
          <DropdownMenuGroup>
            {item.items?.map((subItem) => {
              const isSubItemActive = matchesPath(subItem.url)

              return (
                <DropdownMenuLinkItem
                  key={subItem.id}
                  render={
                    <Link
                      href={subItem.url}
                      aria-current={isSubItemActive ? "page" : undefined}
                    />
                  }
                  className={cn(
                    "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                    !isSubItemActive &&
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:bg-sidebar-accent focus:text-sidebar-accent-foreground",
                    isSubItemActive &&
                      "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground focus:bg-sidebar-primary focus:text-sidebar-primary-foreground"
                  )}
                >
                  {subItem.title}
                </DropdownMenuLinkItem>
              )
            })}
          </DropdownMenuGroup>
        </DropdownMenuContentInOverlay>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

interface NavUserProps {
  user: SimpleUser
  isP0FixtureMode: boolean
}

function NavUser({ user, isP0FixtureMode }: NavUserProps) {
  const { isMobile } = useSidebar()
  const { dictionary } = useLocalization()
  const [composeOpen, setComposeOpen] = React.useState(false)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
            id={USER_MENU_TRIGGER_ID}
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={user?.imageUrl ?? ""}
                alt={user?.fullName ?? ""}
              />
              <AvatarFallback className="rounded-lg text-foreground">
                CN
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {user?.fullName ?? ""}
              </span>
              <span className="truncate text-xs">{user?.username ?? ""}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContentInOverlay
            className="w-(--anchor-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
            aria-labelledby={USER_MENU_TRIGGER_ID}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user?.imageUrl ?? ""}
                      alt={user?.fullName ?? ""}
                    />
                    <AvatarFallback className="rounded-lg text-foreground">
                      CN
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user?.fullName ?? ""}
                    </span>
                    <span className="truncate text-xs">
                      {user?.username ?? ""}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLinkItem render={<Link href="/account" />}>
                <BadgeCheckIcon />
                {dictionary.auth.account}
              </DropdownMenuLinkItem>
              <DropdownMenuLinkItem render={<Link href="/developer-token" />}>
                <KeyRound />
                {dictionary.navigation.apiAccessToken}
              </DropdownMenuLinkItem>
              <DropdownMenuItem>
                <BellIcon />
                {dictionary.auth.notifications}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setComposeOpen(true)}>
                <MessageSquareText />
                {dictionary.feedback.composeAction}
              </DropdownMenuItem>
              <DropdownMenuLinkItem render={<Link href="/feedback" />}>
                <ClipboardListIcon />
                {dictionary.feedback.historyAction}
              </DropdownMenuLinkItem>
            </DropdownMenuGroup>
            {isP0FixtureMode ? null : (
              <>
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
              </>
            )}
          </DropdownMenuContentInOverlay>
        </DropdownMenu>
        <FeedbackComposeDialog
          open={composeOpen}
          onOpenChange={setComposeOpen}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
