"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { recallLeaveRequest } from "./actions"
import { toast } from "sonner"

export type LeaveHistoryItem = {
  id: string
  employee_id: string
  date: Date
  duration: string
  reason: string
}

const ActionCell = ({ row }: { row: Row<LeaveHistoryItem> }) => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size="icon-sm">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            disabled={row.getValue("status") !== "approved"}
            onClick={() => setOpen(true)}
          >
            Recall
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <RecallDialog id={row.getValue("id")} open={open} setOpen={setOpen} />
    </>
  )
}

export const columns: ColumnDef<LeaveHistoryItem>[] = [
  {
    accessorKey: "id",
    header: "Request ID",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return format(row.getValue("date"), "MMM d, yyyy")
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      return <span className="capitalize">{row.getValue("duration")}</span>
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      if (status === "approved") {
        return <Badge variant="default">{status}</Badge>
      } else if (status === "pending") {
        return <Badge variant="secondary">{status}</Badge>
      } else if (status === "disapproved") {
        return <Badge variant="destructive">{status}</Badge>
      } else if (status === "cancelled") {
        return <Badge variant="outline">{status}</Badge>
      }
    },
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
    cell: ({ row }) => {
      return row.getValue("remarks")
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ActionCell,
  },
]

function RecallDialog({
  id,
  open,
  setOpen,
}: {
  id: string
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const [loading, setLoading] = useState<boolean>(false)

  const handleRecall = async () => {
    try {
      setLoading(true)

      await recallLeaveRequest(id)

      setLoading(false)
      setOpen(false)
      toast.info("Leave request recalled")
    } catch (error) {
      console.error("Error recalling leave request:", error)
      setLoading(false)
      setOpen(false)
      toast.error("Failed to recall leave request")
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Recall Leave Request</AlertDialogTitle>
          <AlertDialogDescription>
            This action will recall your leave request and will be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleRecall} disabled={loading}>
            {loading ? "Recalling..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
