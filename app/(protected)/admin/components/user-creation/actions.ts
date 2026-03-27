"use server"

import supabaseAdmin from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function registerEmployee(
  employeeId: string,
  tempPassword: string,
  firstName: string,
  lastName: string,
  companyId: string,
  managerId: string,
  role: string,
  positionId: string,
  departmentId: string
) {
  const shadowEmail = `${employeeId.toLowerCase()}@internal.hr-system.com`

  const { data: authUser, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: shadowEmail,
      password: tempPassword,
      email_confirm: true,
      app_metadata: {
        company_id: companyId,
        role: role,
      },
    })

  if (authError) throw authError

  const roles = [
    { role: "employee", id: 1 },
    { role: "manager", id: 2 },
  ]

  const { error: employeeCreationError } = await supabaseAdmin
    .from("employee_profiles")
    .insert({
      id: authUser.user.id,
      company_id: companyId,
      role: roles.find((r) => r.role === role)?.id,
      employee_id: employeeId,
      first_name: firstName,
      last_name: lastName,
      temp_password: tempPassword,
      manager_id: managerId || null,
      position_id: positionId,
      department_id: departmentId,
    })

  if (employeeCreationError) throw employeeCreationError

  // Initialize remaining leaves based on position configuration
  const { data: leaveConfigs } = await supabaseAdmin
    .from("leave_configuration")
    .select("leave_type, number_of_leaves")
    .eq("company_id", companyId)
    .eq("position_id", positionId)
    .eq("department_id", departmentId)

  if (leaveConfigs && leaveConfigs.length > 0) {
    const remainingLeavesToInsert = leaveConfigs.map((config) => ({
      company_id: companyId,
      employee_id: authUser.user.id,
      leave_type: config.leave_type,
      remaining_leaves: config.number_of_leaves,
      position_id: positionId,
      approving_manager_id: managerId || null,
    }))

    const { error: leavesError } = await supabaseAdmin
      .from("remaining_leaves")
      .insert(remainingLeavesToInsert)

    if (leavesError) {
      console.error("Error initializing remaining leaves:", leavesError)
    }
  }

  revalidatePath("/admin")
  return { success: true }
}

export async function getEmployees(companyId: string) {
  const { data: employees, error } = await supabaseAdmin
    .from("employee_profiles")
    .select(
      `
      id,
      company_id,
      role,
      employee_id,
      first_name,
      last_name,
      manager_id,
      position_id,
      manager: manager_id (first_name, last_name),
      position: position_id (name),
      temp_password,
      created_at,
      updated_at
      `
    )
    .eq("company_id", companyId)

  if (error) throw error

  return employees
}

export async function getManagers(companyId: string) {
  const { data: managers, error } = await supabaseAdmin
    .from("employee_profiles")
    .select("*")
    .eq("company_id", companyId)
    .eq("role", 2)

  if (error) throw error

  return managers
}

export async function getEmployee(employeeId: string) {
  const { data: employee, error } = await supabaseAdmin
    .from("employee_profiles")
    .select("*, manager: manager_id (first_name, last_name)")
    .eq("id", employeeId)
    .single()

  if (error) throw error

  return employee
}

export async function getManager(managerId: string) {
  const { data: manager, error } = await supabaseAdmin
    .from("employee_profiles")
    .select("*")
    .eq("id", managerId)
    .single()

  if (error) throw error

  return manager
}

export async function deleteUser(userId: string) {
  // Delete related records first to avoid foreign key constraint errors
  await supabaseAdmin
    .from("remaining_leaves")
    .delete()
    .eq("employee_id", userId)

  await supabaseAdmin.from("leaves").delete().eq("employee_id", userId)

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

  if (error) throw error

  revalidatePath("/admin/users")
  return { success: true }
}

export async function updateEmployee(
  id: string,
  employeeId: string,
  firstName: string,
  lastName: string,
  companyId: string,
  managerId: string,
  role: string,
  positionId: string
) {
  const roles = [
    { role: "employee", id: 1 },
    { role: "manager", id: 2 },
  ]

  const { error } = await supabaseAdmin
    .from("employee_profiles")
    .update({
      employee_id: employeeId,
      first_name: firstName,
      last_name: lastName,
      role: roles.find((r) => r.role === role)?.id,
      manager_id: managerId || null,
      position_id: positionId,
    })
    .eq("id", id)

  if (error) throw error

  // Also update Auth metadata
  await supabaseAdmin.auth.admin.updateUserById(id, {
    app_metadata: {
      company_id: companyId,
      role: role,
    },
  })

  revalidatePath("/admin/users")
  return { success: true }
}
