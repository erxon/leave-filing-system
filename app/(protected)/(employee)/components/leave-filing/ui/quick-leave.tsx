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
import { fileSingleLeave } from "../actions"
import { Leave } from "@/lib/types"
import { toast } from "sonner"

export default function QuickLeave() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [date, setDate] = useState<Date | undefined>(addDays(startOfToday(), 1))
  const [leave, setLeave] = useState<Omit<Leave, "date">>({
    leave_type: "VL",
    reason: null,
    duration: null,
  })

  const handleFileLeave = async () => {
    if (!date) return
    if (!leave.duration || !leave.leave_type || !leave.reason) return

    const leaveValues = {
      date: date,
      ...leave,
    }

    setIsLoading(true)
    try {
      const result = await fileSingleLeave(leaveValues)

      if (result.success) {
        toast("Leave filed successfully", {
          description: `Your leave on ${date.toDateString()} has been filed, status will be updated soon`,
        })
      } else {
        toast("Error", {
          description: result.message,
        })
      }
    } catch {
      toast("Error", {
        description: "Something went wrong, please try again later",
        className: "bg-red-500 text-white",
      })
    } finally {
      setIsLoading(false)
      setOpen(false)
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
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
          <Button onClick={handleFileLeave} disabled={isLoading}>
            {isLoading ? "Filing..." : "File"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
