"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { format } from "date-fns"
import { Star } from "lucide-react"
import { HolidayEvent } from "./custom-calendar"

interface HolidayCardProps {
  holidays: HolidayEvent[]
}

export function HolidayCard({ holidays }: HolidayCardProps) {
  // Sort holidays by date for the list view
  const sortedHolidays = [...holidays].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return (
    <Card className="flex flex-col h-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Upcoming Holidays</CardTitle>
        <CardDescription>
          Company-wide days off
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {sortedHolidays.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming holidays.</p>
        ) : (
          <ul className="space-y-4">
            {sortedHolidays.map((holiday) => (
              <li
                key={holiday.id}
                className="flex items-start space-x-3 rounded-md border p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {holiday.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {format(holiday.date, "EEEE, MMMM d, yyyy")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
