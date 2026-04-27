import { auth, currentUser } from "@clerk/nextjs/server"
import { cookies } from "next/headers"
import type { ReactNode } from "react"

import { getMyWorkspaces } from "@/app/api/workspaces/action"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { resolveActiveWorkspace } from "@/app/lib/workspaces/active"
import { WorkspaceResponse } from "@/app/lib/workspaces/definitions"
import { AppBreadcrumb } from "@/components/app-breadcrumbs"
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { PermissionProvider } from "@/components/permission-provider"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { WorkspaceSwitcher } from "@/components/workspace-switcher"

export default async function Layout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const { isAuthenticated } = await auth()

  if (!isAuthenticated) {
    return <div>Vui lòng đăng nhập để xem trang này.</div>
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

  const activeWorkspace = resolveActiveWorkspace(workspaces)

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
                <SidebarTrigger />
                <AppBreadcrumb />
              </div>

              <div className="flex min-w-0 items-center gap-2 md:justify-end">
                {canReadWorkspace ? (
                  <WorkspaceSwitcher
                    workspaces={workspaces}
                    activeWorkspace={activeWorkspace}
                    canCreateWorkspace={permissions.includes("workspace:create")}
                    canRenameWorkspace={permissions.includes("workspace:update")}
                    canSetDefaultWorkspace={permissions.includes("workspace:set-default")}
                    canReadAsset={permissions.includes("asset:read")}
                    canReadWatchlist={permissions.includes("watchlist:read")}
                    canCreateWatchlist={permissions.includes("watchlist:create")}
                    canDeleteWatchlist={permissions.includes("watchlist:delete")}
                    className="min-w-0 flex-1 md:flex-none"
                  />
                ) : null}
                <ModeToggle />
              </div>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-5">{children}</div>
        </SidebarInset>
      </PermissionProvider>
    </SidebarProvider>
  )
}
