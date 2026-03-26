"use client"

import { Calendar } from "@/components/ui/calendar"
import { Leave, HolidayEvent } from "../../calendar/components/custom-calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface DashboardCalendarProps {
  leaves: Leave[]
  holidays: HolidayEvent[]
}

export function DashboardCalendar({ leaves, holidays }: DashboardCalendarProps) {
  // Get all dates for holidays and approved leaves
  const holidayDates = holidays.map((h) => new Date(h.date))
  const leaveDates = leaves.flatMap((l) => {
    const dates = []
    const current = new Date(l.startDate)
    const end = new Date(l.endDate)
    // Add all dates between start and end inclusive
    while (current <= end) {
      dates.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return dates
  })

  const modifiers = {
    holiday: holidayDates,
    leave: leaveDates,
  }

  const modifiersClassNames = {
    holiday:
      "bg-purple-100 text-purple-900 font-bold dark:bg-purple-900/40 dark:text-purple-300",
    leave:
      "bg-green-100 text-green-900 font-bold dark:bg-green-900/40 dark:text-green-300",
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Department Calendar</CardTitle>
        <CardDescription>Upcoming leaves and holidays</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center">
        <Calendar
          mode="multiple"
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          className="rounded-md border p-3 w-full max-w-[280px]"
        />
        <div className="mt-4 flex space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 rounded-full bg-purple-400"></div>
            <span className="text-muted-foreground">Holiday</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 rounded-full bg-green-400"></div>
            <span className="text-muted-foreground">Leave</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
