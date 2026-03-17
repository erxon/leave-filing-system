"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function LeaveType({
  onChange,
}: {
  onChange?: (value: "VL" | "SL") => void
}) {
  return (
    <Select onValueChange={onChange} defaultValue="VL">
      <SelectTrigger className="w-full max-w-full">
        <SelectValue placeholder="Select Leave Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Leave Type</SelectLabel>
          <SelectItem value="VL">Vacation Leave</SelectItem>
          <SelectItem value="SL">Sick Leave</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
