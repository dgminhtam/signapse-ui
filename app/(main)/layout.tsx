import { auth, currentUser } from '@clerk/nextjs/server'
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from '@/components/mode-toggle';
import { AppBreadcrumb } from '@/components/app-breadcrumbs';
import { AppSidebar } from '@/components/app-sidebar';
import { PermissionProvider } from '@/components/permission-provider';
import { cookies } from "next/headers"
import { getMyWorkspaces } from '@/app/api/workspaces/action';
import { getCurrentPermissions } from '@/app/lib/permissions-server';
import { WorkspaceResponse } from '@/app/lib/workspaces/definitions';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return <div>Sign in to view this page</div>;
  }
  const user = await currentUser();
  const simpleUser = user ? {
    imageUrl: user.imageUrl,
    fullName: user.fullName,
    username: user.username
  } : null;

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  let workspaces: WorkspaceResponse[] = []
  const permissions = await getCurrentPermissions()

  if (permissions.includes("workspace:read")) {
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

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <PermissionProvider permissions={permissions}>
        <AppSidebar
          user={simpleUser}
          isAuthenticated={isAuthenticated}
          permissions={permissions}
          workspaces={workspaces}
        />
        <SidebarInset>
          <header className="flex h-18 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger />
              <ModeToggle />
              <AppBreadcrumb />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-5">
            {children}
          </div>
        </SidebarInset>
      </PermissionProvider>
    </SidebarProvider>
  );
}
