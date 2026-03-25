"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"
import { updateLeaveConfiguration } from "./actions"

interface LeaveType {
  id: number
  leave_type: string
  code: string
}

interface Position {
  id: string
  name: string
}

interface LeaveConfig {
  id: number
  position_id: string
  leave_type: number
  number_of_leaves: number
}

interface LeaveConfigTableProps {
  companyId: string
  leaveTypes: LeaveType[]
  positions: Position[]
  initialConfigs: LeaveConfig[]
}

export function LeaveConfigTable({
  companyId,
  leaveTypes,
  positions,
  initialConfigs,
}: LeaveConfigTableProps) {
  const [configs, setConfigs] = useState<
    Record<string, Record<number, number>>
  >(() => {
    const initial: Record<string, Record<number, number>> = {}
    positions.forEach((pos) => {
      initial[pos.id] = {}
      leaveTypes.forEach((lt) => {
        const config = initialConfigs.find(
          (c) => c.position_id === pos.id && c.leave_type === lt.id
        )
        initial[pos.id][lt.id] = config ? config.number_of_leaves : 0
      })
    })
    return initial
  })

  const [saving, setSaving] = useState<string | null>(null) // position_id

  const handleValueChange = (posId: string, ltId: number, value: string) => {
    const numValue = parseInt(value) || 0
    setConfigs((prev) => ({
      ...prev,
      [posId]: {
        ...prev[posId],
        [ltId]: numValue,
      },
    }))
  }

  const handleSave = async (posId: string) => {
    setSaving(posId)
    try {
      const updates = leaveTypes.map((lt) =>
        updateLeaveConfiguration({
          company_id: companyId,
          position_id: posId,
          leave_type: lt.id,
          number_of_leaves: configs[posId][lt.id],
        })
      )

      const results = await Promise.all(updates)
      const allSuccess = results.every((r) => r.success)

      if (allSuccess) {
        toast.success(
          `Leave settings updated for ${positions.find((p) => p.id === posId)?.name}`
        )
      } else {
        toast.error("Some updates failed. Please try again.")
      }
    } catch {
      toast.error("An unexpected error occurred.")
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 transition-colors hover:bg-muted/50">
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Position
            </th>
            {leaveTypes.map((lt) => (
              <th
                key={lt.id}
                className="h-12 w-32 px-4 text-left align-middle font-medium text-muted-foreground"
              >
                {lt.leave_type} (Days)
              </th>
            ))}
            <th className="h-12 w-24 px-4 text-right align-middle font-medium text-muted-foreground">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {positions.length === 0 ? (
            <tr className="border-b transition-colors hover:bg-muted/50">
              <td
                colSpan={leaveTypes.length + 2}
                className="p-4 text-center align-middle text-muted-foreground"
              >
                No positions found. Please add positions first.
              </td>
            </tr>
          ) : (
            positions.map((pos) => (
              <tr
                key={pos.id}
                className="border-b transition-colors hover:bg-muted/50"
              >
                <td className="p-4 align-middle font-medium">{pos.name}</td>
                {leaveTypes.map((lt) => (
                  <td key={lt.id} className="p-4 align-middle">
                    <Input
                      type="number"
                      min="0"
                      value={configs[pos.id][lt.id]}
                      onChange={(e) =>
                        handleValueChange(pos.id, lt.id, e.target.value)
                      }
                      className="w-24"
                    />
                  </td>
                ))}
                <td className="p-4 text-right align-middle">
                  <Button
                    size="sm"
                    onClick={() => handleSave(pos.id)}
                    disabled={saving === pos.id}
                  >
                    {saving === pos.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
