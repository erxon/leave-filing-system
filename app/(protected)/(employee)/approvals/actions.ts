"use server"

import { getEmployee } from "@/app/auth/actions"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

async function getRemainingLeaves(employee_id: string, leave_type: string) {
  const supabase = await createClient()
  const { data: remainingLeaves, error: remainingLeavesError } = await supabase
    .from("remaining_leaves")
    .select("*")
    .eq("employee_id", employee_id)
    .eq("leave_type", leave_type)
    .single()

  if (remainingLeavesError) {
    throw new Error("Error fetching remaining leaves")
  }

  return remainingLeaves
}

async function updateLeaveStatus(
  id: string,
  approving_manager_id: string,
  status: number
) {
  const supabase = await createClient()
  const { data: leave, error } = await supabase
    .from("leaves")
    .update({ status, updated_at: new Date() })
    .eq("approving_manager_id", approving_manager_id)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw new Error("Error updating leave status")
  }

  return { data: leave }
}

async function updateRemainingLeaves(
  employee_id: string,
  leave_type: string,
  add: boolean,
  duration: string
) {
  const supabase = await createClient()
  const remainingLeaves = await getRemainingLeaves(employee_id, leave_type)

  const amount = duration === "full-day" ? 1 : 0.5
  let numberOfRemainingLeaves = Number(remainingLeaves.remaining_leaves)

  if (add) {
    numberOfRemainingLeaves += amount
  } else {
    numberOfRemainingLeaves -= amount
  }

  const { error: updateRemainingLeavesError } = await supabase
    .from("remaining_leaves")
    .update({
      remaining_leaves: numberOfRemainingLeaves,
      updated_at: new Date(),
    })
    .eq("employee_id", employee_id)
    .eq("leave_type", leave_type)

  if (updateRemainingLeavesError) {
    throw new Error("Error updating remaining leaves")
  }
}

export async function getDepartmentEmployees() {
  const supabase = await createClient()
  const manager = await getEmployee()

  if (!manager) return []

  const { data: employees, error } = await supabase
    .from("employee_profiles")
    .select("id, first_name, last_name")
    .eq("manager_id", manager.id)
    .order("first_name", { ascending: true })

  if (error) {
    console.error("Error fetching employees:", error)
    return []
  }

  return employees
}

export async function approveLeave(id: string) {
  try {
    const supabase = await createClient()
    const employee = await getEmployee()

    // Get current status before updating
    const { data: currentLeave, error: fetchError } = await supabase
      .from("leaves")
      .select("status")
      .eq("id", id)
      .single()

    if (fetchError || !currentLeave) {
      throw new Error("Error fetching leave details")
    }

    // Don't deduct if already approved
    if (currentLeave.status === 2) {
      return { success: true }
    }

    const { data: leave } = await updateLeaveStatus(id, employee.id, 2)
    await updateRemainingLeaves(
      leave.employee_id,
      leave.leave_type,
      false,
      leave.duration
    )

    revalidatePath("/approvals")
    return { success: true }
  } catch (error) {
    console.error("Error approving leave:", error)
    return { success: false }
  }
}

export async function rejectLeave(id: string, remarks: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("leaves")
    .update({ status: 3, remarks })
    .eq("id", id)

  if (error) {
    console.error("Error rejecting leave:", error)
    return { error }
  }

  revalidatePath("/approvals")
  return { success: true }
}

export async function pendingLeave(id: string) {
  try {
    const supabase = await createClient()
    const employee = await getEmployee()

    // Get current status before updating
    const { data: currentLeave, error: fetchError } = await supabase
      .from("leaves")
      .select("status, employee_id, leave_type, duration")
      .eq("id", id)
      .single()

    if (fetchError || !currentLeave) {
      throw new Error("Error fetching leave details")
    }

    const wasApproved = currentLeave.status === 2

    const { data: leave } = await updateLeaveStatus(id, employee.id, 1)

    // Only add back leaves if it was previously approved
    if (wasApproved) {
      await updateRemainingLeaves(
        leave.employee_id,
        leave.leave_type,
        true,
        leave.duration
      )
    }

    revalidatePath("/approvals")
    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message }
    }
    return { success: false, message: "An unknown error occurred" }
  }
}

export async function removeLeave(id: string) {
  try {
    const supabase = await createClient()
    const manager = await getEmployee()

    // Get current status before updating
    const { data: currentLeave, error: fetchError } = await supabase
      .from("leaves")
      .select("status, employee_id, leave_type, duration")
      .eq("id", id)
      .single()

    if (fetchError || !currentLeave) {
      throw new Error("Error fetching leave details")
    }

    const wasCancelled = currentLeave.status === 4

    const { error } = await supabase
      .from("leaves")
      .delete()
      .eq("approving_manager_id", manager.id)
      .eq("id", id)

    if (error) {
      throw new Error("Error removing leave")
    }

    // Only add back leaves if it was previously approved
    if (wasCancelled) {
      await updateRemainingLeaves(
        currentLeave.employee_id,
        currentLeave.leave_type,
        true,
        currentLeave.duration
      )
    }

    revalidatePath("/approvals")
    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message }
    }
    return { success: false, message: "An unknown error occurred" }
  }
}

export async function approvingMangerEmployees() {
  const employees = await getDepartmentEmployees()
  return employees
}

export async function getLeavesForExport(filters: {
  startDate?: Date
  endDate?: Date
  status?: string
  employeeId?: string
}) {
  try {
    const supabase = await createClient()
    const manager = await getEmployee()

    if (!manager) return { success: false, message: "Unauthorized" }

    let query = supabase
      .from("leaves")
      .select(
        `
        id,
        date,
        duration,
        reason,
        leave_types ( leave_type ),
        status ( status_name ),
        employee_profiles!leaves_employee_id_fkey ( first_name, last_name )
      `
      )
      .eq("approving_manager_id", manager.id)

    if (filters.startDate) {
      query = query.gte("date", filters.startDate.toISOString())
    }
    if (filters.endDate) {
      query = query.lte("date", filters.endDate.toISOString())
    }
    if (filters.employeeId && filters.employeeId !== "all") {
      query = query.eq("employee_id", filters.employeeId)
    }
    if (filters.status && filters.status !== "all") {
      // Find status ID based on name if needed, or assume UI passes ID.
      // Let's assume UI passes status name for filter, but Supabase table uses ID.
      // We need to map status names to IDs.
      const statusMap: Record<string, number> = {
        pending: 1,
        approved: 2,
        rejected: 3,
      }
      if (statusMap[filters.status.toLowerCase()]) {
        query = query.eq("status", statusMap[filters.status.toLowerCase()])
      }
    }

    const { data: leaves, error } = await query.order("date", {
      ascending: false,
    })

    if (error) throw error

    return { success: true, data: leaves }
  } catch (error) {
    console.error("Error fetching leaves for export:", error)
    return { success: false, message: "Failed to fetch data" }
  }
}
