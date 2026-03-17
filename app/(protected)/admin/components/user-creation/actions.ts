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
  role: string
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
    })

  if (employeeCreationError) throw employeeCreationError

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
      manager: manager_id (first_name, last_name),
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
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

  if (error) throw error

  revalidatePath("/admin")
  return { success: true }
}
