"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { DatePicker } from "../../components/leave-filing/ui/date-picker"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"

export function DateRangeFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const startParam = searchParams.get("start")
  const endParam = searchParams.get("end")

  const [startDate, setStartDate] = useState<Date | undefined>(
    startParam ? new Date(startParam) : undefined
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    endParam ? new Date(endParam) : undefined
  )

  const updateParams = (key: string, date: Date | undefined) => {
    const params = new URLSearchParams(searchParams.toString())
    if (date) {
      params.set(key, format(date, "yyyy-MM-dd"))
    } else {
      params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleStartChange = (date: Date | undefined) => {
    setStartDate(date)
    updateParams("start", date)
  }

  const handleEndChange = (date: Date | undefined) => {
    setEndDate(date)
    updateParams("end", date)
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Label className="text-sm text-muted-foreground">Start</Label>
        <div className="w-40">
          <DatePicker date={startDate} onChange={handleStartChange} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Label className="text-sm text-muted-foreground">End</Label>
        <div className="w-40">
          <DatePicker date={endDate} onChange={handleEndChange} />
        </div>
      </div>
    </div>
  )
}

