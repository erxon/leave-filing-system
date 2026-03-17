"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import LeaveType from "../../components/leave-filing/ui/leave-type"
import DurationSelect from "../../components/leave-filing/ui/duration-select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format, startOfToday, addDays } from "date-fns"
import { fileMultipleLeaves } from "./actions"
import { toast } from "sonner"

export default function Page() {
  const [isLoading, setIsLoading] = useState(false)
  const [leaveType, setLeaveType] = useState<string>("VL")
  const [dates, setDates] = useState<Date[] | undefined>([])
  const [dateDetails, setDateDetails] = useState<
    Record<string, { duration: string; reason: string }>
  >({})

  const handleDateSelect = (selectedDates: Date[] | undefined) => {
    setDates(selectedDates)

    // Clean up details for unselected dates
    if (selectedDates) {
      const newDetails = { ...dateDetails }
      Object.keys(newDetails).forEach((key) => {
        const isStillSelected = selectedDates.some(
          (d) => d.toISOString() === key
        )
        if (!isStillSelected) {
          delete newDetails[key]
        }
      })

      // Initialize details for newly selected dates
      selectedDates.forEach((date) => {
        const key = date.toISOString()
        if (!newDetails[key]) {
          newDetails[key] = { duration: "full-day", reason: "" }
        }
      })

      setDateDetails(newDetails)
    } else {
      setDateDetails({})
    }
  }

  const handleDetailChange = (
    dateStr: string,
    field: "duration" | "reason",
    value: string
  ) => {
    setDateDetails((prev) => ({
      ...prev,
      [dateStr]: {
        ...prev[dateStr],
        [field]: value,
      },
    }))
  }

  const isFormValid =
    dates &&
    dates.length > 0 &&
    dates.every((d) => {
      const detail = dateDetails[d.toISOString()]
      return detail && detail.reason.trim() !== ""
    })

  const handleSubmit = async () => {
    const leaves = {
      leave_type: leaveType,
      dates: dates,
      date_details: dateDetails,
    }

    setIsLoading(true)
    try {
      const response = await fileMultipleLeaves(leaves)
      if (response.success) {
        toast.success("Leave filed successfully", {
          description: "Your leave request has been submitted.",
        })
        setDates([])
        setDateDetails({})
        setLeaveType("VL")
      } else {
        toast.error(response.message)
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-xl font-bold tracking-tight">File a Leave</h2>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left Column: Controls */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="leave-type">Leave Type</Label>
            <LeaveType
              onChange={(val: "VL" | "SL") => setLeaveType(val as "VL" | "SL")}
            />
          </div>

          {leaveType === "SL" && (
            <div className="space-y-2">
              <Label htmlFor="medical-cert">
                Medical Certificate (Required for Sick Leave)
              </Label>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input id="medical-cert" type="file" />
              </div>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            className="w-full"
          >
            {isLoading ? "Submitting..." : "Submit Leave Request"}
          </Button>
        </div>

        {/* Right Column: Calendar & Details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Select Dates</Label>
            <div className="inline-block w-fit rounded-md border bg-card p-4">
              <Calendar
                mode="multiple"
                selected={dates}
                onSelect={handleDateSelect}
                disabled={{ before: addDays(startOfToday(), 1) }}
              />
            </div>
          </div>

          {dates && dates.length > 0 && (
            <div className="space-y-4">
              <Label>Details for Selected Dates</Label>
              {dates.map((date) => {
                const dateStr = date.toISOString()
                const details = dateDetails[dateStr] || {
                  duration: "full-day",
                  reason: "",
                }

                return (
                  <div
                    key={dateStr}
                    className="space-y-4 rounded-md border bg-card p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{format(date, "PPP")}</span>
                      <div className="w-32">
                        <DurationSelect
                          onChange={(val: "full-day" | "half-day") =>
                            handleDetailChange(dateStr, "duration", val)
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`reason-${dateStr}`}>
                        Reason <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id={`reason-${dateStr}`}
                        placeholder="Please provide a reason..."
                        value={details.reason}
                        onChange={(e) =>
                          handleDetailChange(dateStr, "reason", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
