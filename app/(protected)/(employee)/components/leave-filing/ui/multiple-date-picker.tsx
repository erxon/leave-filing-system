"use client"

import { Button } from "@/components/ui/button"
import { DatePicker } from "./date-picker"
import LeaveType from "./leave-type"
import { Plus, X } from "lucide-react"
import { addDays, startOfToday } from "date-fns"
import { useEffect, useState } from "react"
import DurationSelect from "./duration-select"

interface Leaves {
  date: Date
  leaveType: string
  duration: string
}

export default function MultipleDatePicker() {
  const [date, setDate] = useState<Date | undefined>(addDays(startOfToday(), 1))
  const [leaves, setLeaves] = useState<Leaves[]>([])
  const [leaveType, setLeaveType] = useState<string>("VL")
  const [duration, setDuration] = useState<string>("whole-day")

  const handleAddDate = () => {
    if (!date || !leaveType) return

    setLeaves((prev: Leaves[]) => {
      if (
        prev.find((item) => {
          return item.date === date
        })
      ) {
        return [...prev]
      } else {
        return [
          ...prev,
          { date: date, leaveType: leaveType, duration: duration },
        ]
      }
    })
  }

  return (
    <div>
      <div className="mb-4 flex flex-col items-end gap-2 border p-2">
        <DatePicker onChange={setDate} date={date} />
        <LeaveType onChange={setLeaveType} />
        <DurationSelect onChange={setDuration} />
        <Button onClick={handleAddDate} size={"icon"} variant={"outline"}>
          <Plus />
        </Button>
      </div>
      <div className="mt-4 flex flex-col gap-2 px-1">
        {leaves.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg border p-2 text-xs shadow-sm transition-all hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <span className="font-medium">{item.date.toDateString()}</span>
              <span className="text-muted-foreground">•</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold">
                {item.leaveType}
              </span>
            </div>
            <Button
              onClick={() => setLeaves(leaves.filter((_, i) => i !== index))}
              size={"icon-sm"}
              variant={"destructive"}
            >
              <X className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
