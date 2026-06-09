import { auth, currentUser } from "@clerk/nextjs/server"
import { cookies } from "next/headers"
import type { ReactNode } from "react"

import { getMyWorkspaces } from "@/app/api/workspaces/action"
import {
  canCreatePersonalNotes,
  canReadPersonalNotes,
  canUpdatePersonalNotes,
} from "@/app/lib/personal-notes/permissions"
import { getServerDictionary } from "@/app/lib/i18n/server"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { resolveActiveWorkspace } from "@/app/lib/workspaces/active"
import { WorkspaceResponse } from "@/app/lib/workspaces/definitions"
import { AppBreadcrumb } from "@/components/app-breadcrumbs"
import { AppSidebar } from "@/components/app-sidebar"
import { LanguageSelector } from "@/components/language-selector"
import { ModeToggle } from "@/components/mode-toggle"
import { PermissionProvider } from "@/components/permission-provider"
import { PersonalNotesQuickSheet } from "@/components/personal-notes-quick-sheet"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { WorkspaceSwitcher } from "@/components/workspace-switcher"
import { Separator } from "@/components/ui/separator"

export default async function Layout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const { isAuthenticated } = await auth()
  const dictionary = await getServerDictionary()

  if (!isAuthenticated) {
    return <div>{dictionary.auth.signInRequired}</div>
  }

  const user = await currentUser()
  const simpleUser = user
    ? {
      imageUrl: user.imageUrl,
      fullName: user.fullName,
      username: user.username,
    }
    : null

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  const permissions = await getCurrentPermissions()
  const canReadWorkspace = permissions.includes("workspace:read")
  const canReadNotes = canReadPersonalNotes(permissions)
  let workspaces: WorkspaceResponse[] = []

  if (canReadWorkspace) {
    try {
      const workspacePage = await getMyWorkspaces({
        filter: "",
        page: 0,
        size: 100,
        sort: [{ field: "id", direction: "asc" }],
      })
      workspaces = workspacePage.content ?? []
    } catch {
      workspaces = []
    }
  }

  const currentWorkspace = resolveActiveWorkspace(workspaces)

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <PermissionProvider permissions={permissions}>
        <AppSidebar
          user={simpleUser}
          isAuthenticated={isAuthenticated}
          permissions={permissions}
        />
        <SidebarInset>
          <header className="flex min-h-16 shrink-0 items-center border-b px-4 py-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:min-h-12">
            <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 items-center gap-2">
                <SidebarTrigger aria-label={dictionary.navigation.toggleSidebar} />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-8"
                />
                <AppBreadcrumb />
              </div>

              <div className="flex min-w-0 items-center gap-2 md:justify-end">
                {canReadWorkspace ? (
                  <WorkspaceSwitcher
                    workspaces={workspaces}
                    currentWorkspace={currentWorkspace}
                    canCreateWorkspace={permissions.includes("workspace:create")}
                    canRenameWorkspace={permissions.includes("workspace:update")}
                    canSetCurrentWorkspace={permissions.includes("workspace:set-current")}
                    canReadAsset={permissions.includes("asset:read")}
                    canReadWatchlist={permissions.includes("watchlist:read")}
                    canCreateWatchlist={permissions.includes("watchlist:create")}
                    canDeleteWatchlist={permissions.includes("watchlist:delete")}
                    className="min-w-0 flex-1 md:flex-none"
                  />
                ) : null}
                {canReadNotes ? (
                  <PersonalNotesQuickSheet
                    canCreate={canCreatePersonalNotes(permissions)}
                    canUpdate={canUpdatePersonalNotes(permissions)}
                  />
                ) : null}
                <LanguageSelector />
                <ModeToggle />
              </div>
            </div>
          </header>
          <div className="flex min-h-0 flex-1 flex-col gap-4 p-5">
            {children}
          </div>
        </SidebarInset>
      </PermissionProvider>
    </SidebarProvider>
  )
}
