"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { addDays, format, startOfToday } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

export function DatePicker({
  date: externalDate,
  setDate: externalSetDate,
  onChange,
}: {
  date?: Date
  setDate?: React.Dispatch<React.SetStateAction<Date>>
  onChange?: (date: Date) => void
}) {
  const [internalDate, internalSetDate] = React.useState<Date>(
    addDays(startOfToday(), 1)
  )

  const date = externalDate ?? internalDate
  const setDate = (newDate: Date | undefined) => {
    if (!newDate) return
    if (externalSetDate) {
      externalSetDate(newDate)
    } else {
      internalSetDate(newDate)
    }
    onChange?.(newDate)
  }

  return (
    <Popover>
      <PopoverTrigger className="w-full" asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          {date ? format(date, "PPP") : <span>Pick a date</span>}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          required
          selected={date}
          onSelect={setDate}
          defaultMonth={date}
          disabled={{ before: addDays(startOfToday(), 1) }}
        />
      </PopoverContent>
    </Popover>
  )
}
