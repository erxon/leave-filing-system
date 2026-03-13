"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

type Manager = {
  label: string
  value: string
}

const managers: Manager[] = [
  { label: "Manager 1", value: "manager_1" },
  { label: "Manager 2", value: "manager_2" },
  { label: "Manager 3", value: "manager_3" },
]

export function ManagersSelector({
  value,
  field,
  onSelect,
  disabled,
}: {
  value: { label: string; value: string }
  field: any
  onSelect: (value: { label: string; value: string } | null) => void
  disabled: boolean
}) {
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
