"use client"

import React, { useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type ApprovedLeave = {
  id: string
  employeeName: string
  type: "Sick Leave" | "Vacation Leave"
  startDate: Date
  endDate: Date
  duration: "full-day" | "half-day"
}

export default function CustomCalendar({ events }: { events: ApprovedLeave[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const today = () => setCurrentMonth(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const daysInGrid = eachDayOfInterval({ start: startDate, end: endDate })
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Simple helper to check if a date falls within an event's range (inclusive)
  const isDateInEvent = (date: Date, event: ApprovedLeave) => {
    // Zero out time for comparison
    const targetDate = new Date(date).setHours(0, 0, 0, 0)
    const startDate = new Date(event.startDate).setHours(0, 0, 0, 0)
    const endDate = new Date(event.endDate).setHours(0, 0, 0, 0)
    return targetDate >= startDate && targetDate <= endDate
  }

  return (
    <div className="flex flex-col space-y-4 w-full h-full bg-card p-4 rounded-xl shadow-sm border">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={today}>
            Today
          </Button>
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* WeekDays Header */}
      <div className="grid grid-cols-7 gap-1 text-center font-medium text-muted-foreground mb-2">
        {weekDays.map((day) => (
          <div key={day} className="py-2 text-sm">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-px bg-muted rounded-md overflow-hidden flex-1 auto-rows-fr">
        <TooltipProvider>
          {daysInGrid.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, monthStart)
            const isCurrentDay = isToday(day)

            // Find events for this day
            const dayEvents = events.filter((e) => isDateInEvent(day, e))

            return (
              <div
                key={day.toString() + idx}
                className={`min-h-[100px] bg-background p-2 transition-colors hover:bg-muted/50 ${
                  !isCurrentMonth ? "text-muted-foreground/50 bg-muted/20" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span
                    className={`font-medium text-sm w-6 h-6 flex items-center justify-center rounded-full ${
                      isCurrentDay
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                </div>

                <div className="space-y-1 mt-2">
                  {dayEvents.map((event) => (
                    <Tooltip key={event.id}>
                      <TooltipTrigger asChild>
                        <div
                          className={`text-xs p-1 px-2 rounded-md truncate cursor-pointer ${
                            event.type === "Sick Leave"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          }`}
                        >
                          {event.employeeName}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-sm">
                          <p className="font-bold">{event.employeeName}</p>
                          <p>{event.type}</p>
                          <p className="text-muted-foreground">{event.duration}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(event.startDate, "MMM d")} -{" "}
                            {format(event.endDate, "MMM d, yyyy")}
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            )
          })}
        </TooltipProvider>
      </div>
    </div>
  )
}
