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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { AvatarLarge, AvatarSmall } from "./employee-avatars"

export type Leave = {
  id: string
  employeeName: string
  avatar_url?: string | null
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
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const today = () => setCurrentMonth(new Date())

  const handleDayClick = (day: Date, dayEvents: Leave[]) => {
    if (dayEvents.length > 0) {
      setSelectedDay(day)
      setIsDialogOpen(true)
    }
  }

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
                className={`min-h-[120px] bg-background p-2 transition-colors hover:bg-muted/50 ${
                  !isCurrentMonth ? "bg-muted/20 text-muted-foreground/50" : ""
                } ${dayEvents.length > 0 ? "cursor-pointer" : ""}`}
                onClick={() => handleDayClick(day, dayEvents)}
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
                      <TooltipContent className="bg-purple-500 dark:bg-purple-800">
                        <div className="text-sm">
                          <p className="flex items-center space-x-1 font-bold dark:text-purple-200">
                            <Star className="mr-1 h-4 w-4 text-purple-200" />
                            {holiday.name}
                          </p>
                          <p className="mt-1 text-xs text-white">
                            {format(holiday.date, "PPP")}
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}

                  {/* Render Leaves (Limited to 3) */}
                  {dayEvents.slice(0, 3).map((event) => (
                    <Tooltip key={event.id}>
                      <TooltipTrigger asChild>
                        <div
                          className={`flex cursor-pointer items-center gap-1 truncate rounded-md p-1 px-2 text-xs ${
                            event.type.toLowerCase() === "sick leave" &&
                            event.status === "approved" &&
                            "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300"
                          } ${
                            event.type.toLowerCase() === "vacation leave" &&
                            event.status === "approved" &&
                            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          } ${
                            event.status.toLowerCase() === "pending" &&
                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                          } ${
                            event.status.toLowerCase() === "disapproved" &&
                            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          }`}
                        >
                          <AvatarSmall
                            avatar_url={event.avatar_url || ""}
                            fallback={
                              event.employeeName.split(" ")[0].charAt(0) +
                              event.employeeName.split(" ")[1].charAt(0)
                            }
                          />
                          <span className="truncate">{event.employeeName}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-sm">
                          <p className="font-bold">{event.employeeName}</p>
                          <p>{event.type}</p>
                          <p className="text-muted">{event.duration}</p>
                          <p className="mt-1 text-xs text-muted">
                            {format(event.startDate, "MMM d")} -{" "}
                            {format(event.endDate, "MMM d, yyyy")}
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}

                  {/* Show +X more indicator */}
                  {dayEvents.length > 3 && (
                    <div className="px-1 text-[10px] font-medium text-muted-foreground">
                      + {dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </TooltipProvider>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Leaves for{" "}
              {selectedDay ? format(selectedDay, "MMMM d, yyyy") : ""}
            </DialogTitle>
            <DialogDescription>
              Full list of approved leave requests for this date.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-2">
            {selectedDay &&
              events
                .filter((e) => isDateInEvent(selectedDay, e))
                .map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center space-x-3 rounded-lg border p-3 shadow-sm transition-colors hover:bg-muted/30"
                  >
                    <AvatarLarge
                      avatar_url={event.avatar_url || ""}
                      fallback={
                        event.employeeName.split(" ")[0].charAt(0) +
                        event.employeeName.split(" ")[1].charAt(0)
                      }
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="leading-none font-bold">
                            {event.employeeName}
                          </p>
                          <div className="flex gap-1.5">
                            <Badge
                              variant="secondary"
                              className={`px-1.5 py-0 text-[10px] ${
                                event.type.toLowerCase() === "vacation leave"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                  : "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300"
                              }`}
                            >
                              {event.type}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="px-1.5 py-0 text-[10px]"
                            >
                              {event.duration === "full-day"
                                ? "Full Day"
                                : "Half Day"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {format(event.startDate, "MMM d")} -{" "}
                        {format(event.endDate, "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
