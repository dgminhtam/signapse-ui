"use client"

import Link from "next/link"
import { format } from "date-fns"
import { Edit2, Plus, Tags, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { deleteTopic, toggleTopicActive } from "@/app/api/topics/action"
import { Page } from "@/app/lib/definitions"
import { TopicListResponse } from "@/app/lib/topics/definitions"
import { AppPagination } from "@/components/app-pagination"
import { AppSelectPageSize } from "@/components/app-select-page-size"
import { SortSelect } from "@/components/sort-select"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { TopicSearch } from "./topic-search"

interface TopicListPageProps {
  topicPage: Page<TopicListResponse>
}

export function TopicListPage({ topicPage }: TopicListPageProps) {
  const topics = topicPage?.content || []

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-1 items-center gap-4 sm:w-auto">
          <Button asChild>
            <Link href="/topics/create">
              <Plus data-icon="inline-start" /> Add topic
            </Link>
          </Button>
          <TopicSearch />
        </div>
        <div className="flex items-center gap-2">
          <SortSelect
            options={[
              { label: "Latest", value: "id_desc" },
              { label: "Oldest", value: "id_asc" },
              { label: "Name (A-Z)", value: "name_asc" },
              { label: "Slug (A-Z)", value: "slug_asc" },
            ]}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-md border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="font-semibold text-foreground">Topic</TableHead>
                <TableHead className="font-semibold text-foreground">Slug</TableHead>
                <TableHead className="text-center font-semibold text-foreground">Status</TableHead>
                <TableHead className="text-center font-semibold text-foreground">Created Date</TableHead>
                <TableHead className="text-center font-semibold text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.length > 0 ? (
                topics.map((topic) => (
                  <TableRow key={topic.id} className="border-border transition-colors hover:bg-muted/50">
                    <TableCell className="font-medium text-foreground">
                      <div className="flex flex-col">
                        <Link href={`/topics/${topic.id}`} className="hover:underline">
                          {topic.name}
                        </Link>
                        <span className="line-clamp-2 text-sm text-muted-foreground">
                          {topic.description || "No description"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {topic.slug}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <ToggleTopicActiveSwitch id={topic.id} active={topic.active} />
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground tabular-nums">
                      {format(new Date(topic.createdDate), "dd/MM/yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <Link href={`/topics/${topic.id}`}>
                            <Edit2 className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteTopicButton id={topic.id} name={topic.name} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-24 text-center">
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <Tags />
                        </EmptyMedia>
                        <EmptyTitle>No topics found</EmptyTitle>
                        <EmptyDescription>
                          Add your first topic to manage matching keywords and entities.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="my-4 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <AppSelectPageSize />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {(topicPage?.number ?? 0) + 1} of {topicPage?.totalPages ?? 0} ({topicPage?.totalElements ?? 0} topics)
          </span>
        </div>
        <div className="flex gap-2">
          <AppPagination
            totalElements={topicPage?.totalElements ?? 0}
            itemsPerPage={topicPage?.size ?? 12}
          />
        </div>
      </div>
    </div>
  )
}

function ToggleTopicActiveSwitch({ id, active }: { id: number; active: boolean }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleTopicActive(id)
      if (result.success) {
        toast.success(`Topic ${active ? "disabled" : "enabled"} successfully`)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Switch checked={active} onCheckedChange={handleToggle} disabled={isPending} />
      {isPending ? <Spinner className="size-3" /> : null}
    </div>
  )
}

function DeleteTopicButton({ id, name }: { id: number; name: string }) {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteTopic(id)
      if (result.success) {
        toast.success(`Topic "${name}" deleted successfully`)
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the topic <strong>{name}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault()
              handleDelete()
            }}
            disabled={isPending}
            className="bg-red-500 hover:bg-red-600"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
