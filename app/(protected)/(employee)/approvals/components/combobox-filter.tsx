"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { useEffect, useState } from "react"
import { approvingMangerEmployees } from "../actions"

export default function ComboboxFilter({
  value,
  onValueChange,
}: {
  value: string
  onValueChange: (value: string) => void
}) {
  const [approvingManagerEmployees, setApprovingManagerEmployees] = useState<
    string[]
  >(["all"])

  const fetchApprovingManagerEmployees = async () => {
    const employees = await approvingMangerEmployees()
    setApprovingManagerEmployees(
      employees.map(
        (employee) => `${employee.first_name} ${employee.last_name}`
      )
    )
  }

  useEffect(() => {
    fetchApprovingManagerEmployees()
  }, [])

  return (
    <Combobox
      items={approvingManagerEmployees}
      value={value}
      onValueChange={(value) => onValueChange(value!)}
    >
      <ComboboxInput placeholder="Filter by employee name..." />
      <ComboboxContent>
        <ComboboxEmpty>No employees found</ComboboxEmpty>
        <ComboboxList>
          <ComboboxItem key="all" value="all">
            All
          </ComboboxItem>
          {approvingManagerEmployees.map((employee) => (
            <ComboboxItem key={employee} value={employee}>
              {employee}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
