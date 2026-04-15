"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { CheckIcon, ChevronsUpDownIcon, PencilIcon, PlusIcon, XIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  createWorkspace,
  setDefaultWorkspace,
  updateWorkspace,
} from "@/app/api/workspaces/action"
import { WorkspaceResponse } from "@/app/lib/workspaces/definitions"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"

interface WorkspaceSwitcherProps {
  workspaces: WorkspaceResponse[]
  activeWorkspace: WorkspaceResponse | null
  logo: React.ElementType
}

export function WorkspaceSwitcher({
  workspaces,
  activeWorkspace,
  logo: Logo,
}: WorkspaceSwitcherProps) {
  const router = useRouter()
  const { isMobile } = useSidebar()
  const [isPending, startTransition] = React.useTransition()

  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [createName, setCreateName] = React.useState("")
  const [createSlug, setCreateSlug] = React.useState("")

  const [isRenameOpen, setIsRenameOpen] = React.useState(false)
  const [renameName, setRenameName] = React.useState("")
  const [renameSlug, setRenameSlug] = React.useState("")

  React.useEffect(() => {
    if (!isRenameOpen || !activeWorkspace) return
    setRenameName(activeWorkspace.name ?? "")
    setRenameSlug(activeWorkspace.slug ?? "")
  }, [activeWorkspace, isRenameOpen])

  async function handleSwitchWorkspace(workspace: WorkspaceResponse) {
    if (!activeWorkspace || workspace.id === activeWorkspace.id) {
      return
    }

    startTransition(async () => {
      const result = await setDefaultWorkspace(workspace.id)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success(`Đã chuyển sang workspace "${workspace.name}"`)
      router.refresh()
    })
  }

  async function handleCreateWorkspace() {
    const name = createName.trim()
    const slug = createSlug.trim()

    if (!name) {
      toast.error("Vui lòng nhập tên workspace")
      return
    }

    startTransition(async () => {
      const result = await createWorkspace({
        name,
        ...(slug ? { slug } : {}),
      })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success("Tạo workspace thành công")
      setCreateName("")
      setCreateSlug("")
      setIsCreateOpen(false)
      router.refresh()
    })
  }

  async function handleRenameWorkspace() {
    if (!activeWorkspace) {
      return
    }

    if (activeWorkspace.personal) {
      toast.error("Workspace cá nhân không hỗ trợ đổi tên")
      return
    }

    const name = renameName.trim()
    const slug = renameSlug.trim()

    if (!name) {
      toast.error("Vui lòng nhập tên workspace")
      return
    }

    startTransition(async () => {
      const result = await updateWorkspace(activeWorkspace.id, {
        name,
        ...(slug ? { slug } : {}),
      })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success("Cập nhật workspace thành công")
      setIsRenameOpen(false)
      router.refresh()
    })
  }


  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Logo />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {activeWorkspace?.name ?? "No Workspace selected"}
                  </span>
                  <span className="truncate text-xs">
                    {activeWorkspace
                      ? (activeWorkspace.personal ? "Personal workspace" : activeWorkspace.slug)
                      : "Please select or create one"}
                  </span>
                </div>
                <ChevronsUpDownIcon className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Workspaces
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                {workspaces.map((workspace) => {
                  const isSelected = activeWorkspace?.id === workspace.id
                  return (
                    <DropdownMenuItem
                      key={workspace.id}
                      disabled={isPending}
                      onClick={() => handleSwitchWorkspace(workspace)}
                      className="gap-2 p-2"
                    >
                      <div className="flex size-6 items-center justify-center rounded-md border">
                        <Logo />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate">{workspace.name}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {workspace.personal ? "personal" : workspace.slug}
                        </span>
                      </div>
                      {isSelected ? <CheckIcon className="size-4 text-primary" /> : null}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 p-2"
                onSelect={(event) => {
                  event.preventDefault()
                  setIsCreateOpen(true)
                }}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <PlusIcon className="size-4" />
                </div>
                <div className="font-medium">Tạo workspace</div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 p-2"
                disabled={!activeWorkspace || activeWorkspace.personal}
                onSelect={(event) => {
                  event.preventDefault()
                  setIsRenameOpen(true)
                }}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <PencilIcon className="size-4" />
                </div>
                <div className="font-medium">Đổi tên workspace</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <DialogPrimitive.Root open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 w-[min(520px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-popover text-popover-foreground shadow-lg data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
            <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
              <div className="flex flex-col gap-1">
                <DialogPrimitive.Title className="text-lg font-medium text-foreground">
                  Tạo workspace mới
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-sm text-muted-foreground">
                  Nhập tên và slug (tuỳ chọn) để tạo workspace mới.
                </DialogPrimitive.Description>
              </div>
              <DialogPrimitive.Close asChild>
                <Button type="button" variant="ghost" size="icon-sm">
                  <XIcon />
                  <span className="sr-only">Đóng</span>
                </Button>
              </DialogPrimitive.Close>
            </div>

            <div className="flex flex-col gap-4 px-6 py-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tên workspace *</label>
                <Input
                  value={createName}
                  onChange={(event) => setCreateName(event.target.value)}
                  placeholder="Ví dụ: Team Research"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug (tuỳ chọn)</label>
                <Input
                  value={createSlug}
                  onChange={(event) => setCreateSlug(event.target.value)}
                  placeholder="team-research"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
              <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
                Hủy
              </Button>
              <Button type="button" disabled={isPending} onClick={handleCreateWorkspace}>
                Tạo workspace
              </Button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <DialogPrimitive.Root open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 w-[min(520px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-popover text-popover-foreground shadow-lg data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
            <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
              <div className="flex flex-col gap-1">
                <DialogPrimitive.Title className="text-lg font-medium text-foreground">
                  Đổi tên workspace
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-sm text-muted-foreground">
                  Cập nhật tên hoặc slug cho workspace đang chọn.
                </DialogPrimitive.Description>
              </div>
              <DialogPrimitive.Close asChild>
                <Button type="button" variant="ghost" size="icon-sm">
                  <XIcon />
                  <span className="sr-only">Đóng</span>
                </Button>
              </DialogPrimitive.Close>
            </div>

            <div className="flex flex-col gap-4 px-6 py-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tên workspace *</label>
                <Input
                  value={renameName}
                  onChange={(event) => setRenameName(event.target.value)}
                  placeholder="Ví dụ: Team Research"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug (tuỳ chọn)</label>
                <Input
                  value={renameSlug}
                  onChange={(event) => setRenameSlug(event.target.value)}
                  placeholder="team-research"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
              <Button type="button" variant="ghost" onClick={() => setIsRenameOpen(false)}>
                Hủy
              </Button>
              <Button
                type="button"
                disabled={isPending || !activeWorkspace || activeWorkspace.personal}
                onClick={handleRenameWorkspace}
              >
                Lưu thay đổi
              </Button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  )
}
