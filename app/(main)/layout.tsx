import { auth, currentUser } from '@clerk/nextjs/server'
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from '@/components/mode-toggle';
import { AppBreadcrumb } from '@/components/app-breadcrumbs';
import { AppSidebar } from '@/components/app-sidebar';
import { cookies } from "next/headers"

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

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar user={simpleUser} isAuthenticated={isAuthenticated} />
      <SidebarInset>
        <header className="flex h-18 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <ModeToggle />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            <AppBreadcrumb />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-5">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}