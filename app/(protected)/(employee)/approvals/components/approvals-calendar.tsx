"use client"

import React from "react"
import CustomCalendar, {
  Leave,
} from "@/app/(protected)/(employee)/calendar/components/custom-calendar"
import { LeaveApprovalItem } from "./columns"

interface ApprovalsCalendarProps {
  data: LeaveApprovalItem[]
}

export function ApprovalsCalendar({ data }: ApprovalsCalendarProps) {
  // Map LeaveApprovalItem to ApprovedLeave format for the calendar component
  const events: Leave[] = data.map((item) => ({
    id: item.id,
    employeeName: item.employee_name,
    // The calendar component expects specific types for 'type' and 'duration',
    // but we'll cast or adapt them as needed. The calendar component uses
    // background colors based on these types.
    type: item.type as "Sick Leave" | "Vacation Leave",
    duration: item.duration as "full-day" | "half-day",
    startDate: item.date,
    endDate: item.date,
    status: item.status, // Assuming single day if only one date is provided
  }))

  return (
    <div className="h-[700px]">
      <CustomCalendar events={events} />
    </div>
  )
}
