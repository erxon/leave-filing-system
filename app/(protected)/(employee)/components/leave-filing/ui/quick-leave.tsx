"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DatePicker } from "./date-picker"
import LeaveType from "./leave-type"
import DurationSelect from "./duration-select"
import { useState } from "react"
import { addDays, startOfToday } from "date-fns"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface Leave {
  leave_type: "VL" | "SL"
  reason: string | null
  duration: "full-day" | "half-day" | null
}

export default function QuickLeave() {
  const [date, setDate] = useState<Date | undefined>(addDays(startOfToday(), 1))
  const [leave, setLeave] = useState<Leave>({
    leave_type: "VL",
    reason: null,
    duration: null,
  })

  const handleFileLeave = () => {
    console.log(leave)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Quick Leave</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick Leave Filing</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <DatePicker onChange={setDate} date={date} />
          <LeaveType
            onChange={(value) => setLeave({ ...leave, leave_type: value })}
          />
          <DurationSelect
            onChange={(value) => setLeave({ ...leave, duration: value })}
          />
          <Textarea
            placeholder="Reason"
            className="resize-none"
            onChange={(e) => setLeave({ ...leave, reason: e.target.value })}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleFileLeave}>File</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
