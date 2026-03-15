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
import { getManagers } from "../actions"
import { Employee } from "./users/columns"

export function ManagersSelector({
  companyId,
  value,
  field,
  onSelect,
  disabled,
}: {
  companyId: string
  value: { label: string; value: string }
  field: any
  onSelect: (value: { label: string; value: string } | null) => void
  disabled: boolean
}) {
  const [managers, setManagers] = useState<{ label: string; value: string }[]>(
    []
  )

  useEffect(() => {
    const fetchManagers = async () => {
      const managers = await getManagers(companyId)
      setManagers(
        managers.map((manager) => {
          return {
            label: `${manager.first_name} ${manager.last_name}`,
            value: manager.id,
          }
        })
      )
    }
    fetchManagers()
  }, [companyId])

  return (
    <Combobox
      disabled={disabled}
      items={managers}
      value={value}
      onValueChange={onSelect}
      itemToStringValue={(manager) => manager.label}
    >
      <ComboboxInput
        disabled={disabled}
        placeholder="Select a manager"
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        autoComplete="off"
      />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(manager) => (
            <ComboboxItem key={manager.value} value={manager}>
              {manager.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
