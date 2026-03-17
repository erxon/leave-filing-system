"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export type LeaveHistoryItem = {
  id: string
  employee_id: string
  date: Date
  duration: string
  reason: string
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
    cell: ({ row }) => {
      return (
        <Button
          variant={"ghost"}
          size="icon-sm"
          onClick={() => console.log(row.original)}
        >
          <MoreHorizontal />
        </Button>
      )
    },
  },
]
