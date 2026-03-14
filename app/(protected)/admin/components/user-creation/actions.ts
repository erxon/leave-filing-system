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

  if (role === "manager") {
    const { error: managerError } = await supabaseAdmin
      .from("approving_managers")
      .insert({
        id: authUser.user.id,
        company_id: companyId,
        role: 2,
        employee_id: employeeId,
        first_name: firstName,
        last_name: lastName,
        temp_password: tempPassword,
      })

    if (managerError) throw managerError
  } else if (role === "employee") {
    const { error: employeeError } = await supabaseAdmin
      .from("employees")
      .insert({
        id: authUser.user.id,
        company_id: companyId,
        role: 1,
        employee_id: employeeId,
        first_name: firstName,
        last_name: lastName,
        manager_id: managerId,
      })

    if (employeeError) throw employeeError
  } else {
    throw new Error("Invalid role")
  }

  return { success: true }
}

export async function getManagers(companyId: string) {
  const { data: managers, error } = await supabaseAdmin
    .from("approving_managers")
    .select("*")
    .eq("company_id", companyId)

  if (error) throw error

  return managers
}

export async function deleteUser(userId: string) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

  if (error) throw error

  revalidatePath("/admin")
  return { success: true }
}
