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
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type Leave = {
  id: string
  employeeName: string
  type: "Sick Leave" | "Vacation Leave"
  startDate: Date
  endDate: Date
  duration: "full-day" | "half-day"
  status: string
}

export type HolidayEvent = {
  id: string
  name: string
  date: Date
}

export default function CustomCalendar({
  events,
  holidays = [],
}: {
  events: Leave[]
  holidays?: HolidayEvent[]
}) {
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
  const isDateInEvent = (date: Date, event: Leave) => {
    // Zero out time for comparison
    const targetDate = new Date(date).setHours(0, 0, 0, 0)
    const startDate = new Date(event.startDate).setHours(0, 0, 0, 0)
    const endDate = new Date(event.endDate).setHours(0, 0, 0, 0)
    return targetDate >= startDate && targetDate <= endDate
  }

  // Helper to check if a date is a holiday
  const getHolidaysForDate = (date: Date) => {
    const targetDate = new Date(date).setHours(0, 0, 0, 0)
    return holidays.filter(
      (h) => new Date(h.date).setHours(0, 0, 0, 0) === targetDate
    )
  }

  return (
    <div className="flex h-full w-full flex-col space-y-4 rounded-xl border bg-card p-4 shadow-sm">
      {/* Header */}

      <div className="mb-4 flex items-center justify-between">
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
      <div className="mb-2 grid grid-cols-7 gap-1 text-center font-medium text-muted-foreground">
        {weekDays.map((day) => (
          <div key={day} className="py-2 text-sm">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid flex-1 auto-rows-fr grid-cols-7 gap-px overflow-hidden rounded-md bg-muted">
        <TooltipProvider>
          {daysInGrid.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, monthStart)
            const isCurrentDay = isToday(day)

            // Find events and holidays for this day
            const dayEvents = events.filter((e) => isDateInEvent(day, e))
            const dayHolidays = getHolidaysForDate(day)

            return (
              <div
                key={day.toString() + idx}
                className={`min-h-[100px] bg-background p-2 transition-colors hover:bg-muted/50 ${
                  !isCurrentMonth ? "bg-muted/20 text-muted-foreground/50" : ""
                }`}
              >
                <div className="mb-1 flex items-start justify-between">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium ${
                      isCurrentDay ? "bg-primary text-primary-foreground" : ""
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                </div>

                <div className="mt-2 space-y-1">
                  {/* Render Holidays First */}
                  {dayHolidays.map((holiday) => (
                    <Tooltip key={holiday.id}>
                      <TooltipTrigger asChild>
                        <div className="flex cursor-pointer items-center space-x-1 truncate rounded-md bg-purple-100 p-1 px-2 text-xs text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                          <Star className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{holiday.name}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-sm">
                          <p className="flex items-center space-x-1 font-bold">
                            <Star className="mr-1 h-4 w-4 text-purple-500" />
                            {holiday.name}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {format(holiday.date, "PPP")}
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}

                  {/* Render Leaves */}
                  {dayEvents.map((event) => (
                    <Tooltip key={event.id}>
                      <TooltipTrigger asChild>
                        <div
                          className={`cursor-pointer truncate rounded-md p-1 px-2 text-xs ${
                            event.type === "Sick Leave" &&
                            event.status === "approved" &&
                            "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300"
                          } ${
                            event.type === "Vacation Leave" &&
                            event.status === "approved" &&
                            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          } ${
                            event.status === "pending" &&
                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                          } ${
                            event.status === "disapproved" &&
                            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          }`}
                        >
                          {event.employeeName}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-sm">
                          <p className="font-bold">{event.employeeName}</p>
                          <p>{event.type}</p>
                          <p className="text-muted-foreground">
                            {event.duration}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
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
