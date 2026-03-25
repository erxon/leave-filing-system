"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { format } from "date-fns"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { HolidayEvent } from "./custom-calendar"
import { Button } from "@/components/ui/button"

interface HolidayCardProps {
  holidays: HolidayEvent[]
}

export function HolidayCard({ holidays }: HolidayCardProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Sort holidays by date for the list view
  const sortedHolidays = [...holidays].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const totalPages = Math.ceil(sortedHolidays.length / itemsPerPage)
  
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedHolidays = sortedHolidays.slice(startIndex, startIndex + itemsPerPage)

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  return (
    <Card className="flex flex-col h-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Upcoming Holidays</CardTitle>
        <CardDescription>
          Company-wide days off
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {paginatedHolidays.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming holidays.</p>
        ) : (
          <ul className="space-y-4">
            {paginatedHolidays.map((holiday) => (
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
      {totalPages > 1 && (
        <CardFooter className="flex justify-between items-center border-t pt-4 pb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
