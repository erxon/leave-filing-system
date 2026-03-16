"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import LeaveHistory from "../components/leave-history/ui/leave-history"
import { LeaveHistoryItem } from "../components/leave-history/ui/columns"
import { Employee } from "../../admin/components/user-creation/ui/users/columns"

export default function LeaveFiling({
  data,
  employee,
}: {
  data: LeaveHistoryItem[] // Updated from Payment
  employee: Employee
}) {
  const isMobile = useMediaQuery("(max-width: 1380px)")

  return (
    <div>
      <div className="lg:grid lg:grid-cols-10 lg:gap-4">
        <div className="lg:col-span-7">
          <h1 className="text-lg font-medium">Leaves</h1>
        </div>
      </div>
    </div>
  )
}
