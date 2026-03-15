"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function RoleSelector({
  value,
  onSelect,
}: {
  value: string
  onSelect: (value: string) => void
}) {
  return (
    <Select value={value} onValueChange={onSelect}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="employee">Employee</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
