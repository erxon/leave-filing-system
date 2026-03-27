"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import {
  ApproveDialog,
  PendingDialog,
  RejectDialog,
  RemoveDialog,
} from "./dialogs/action-dialogs"

export type LeaveApprovalItem = {
  id: string
  employee_id: string
  employee_name: string
  avatar_url: string
  date: Date
  duration: string
  reason: string
  type: string
  status: string
  remarks?: string | null
}

export const columns: ColumnDef<LeaveApprovalItem>[] = [
  {
    accessorKey: "id",
    header: "Request ID",
  },
  {
    accessorKey: "employee_name",
    header: "Employee",
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },

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
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "reason",
    header: "Reason",
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
      }
      return <Badge variant="outline">{status}</Badge>
    },
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
    cell: ({ row }) => {
      return row.getValue("remarks") || "-"
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionCell row={row} />,
  },
]

function ActionCell({ row }: { row: Row<LeaveApprovalItem> }) {
  const [rejectOpen, setRejectOpen] = useState(false)
  const [approveOpen, setApproveOpen] = useState(false)
  const [pendingOpen, setPendingOpen] = useState(false)
  const [removeOpen, setRemoveOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {row.original.status === "pending" && (
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setApproveOpen(true)}>
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRejectOpen(true)}>
                Reject
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
          {row.original.status === "approved" && (
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setPendingOpen(true)}>
                Pending
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
          {row.original.status === "cancelled" && (
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setRemoveOpen(true)}>
                Remove
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPendingOpen(true)}>
                Pending
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <RejectDialog
        id={row.original.id}
        open={rejectOpen}
        setOpen={setRejectOpen}
      />
      <ApproveDialog
        id={row.original.id}
        open={approveOpen}
        setOpen={setApproveOpen}
      />
      <PendingDialog
        id={row.original.id}
        open={pendingOpen}
        setOpen={setPendingOpen}
      />
      <RemoveDialog
        id={row.original.id}
        open={removeOpen}
        setOpen={setRemoveOpen}
      />
    </>
  )
}
