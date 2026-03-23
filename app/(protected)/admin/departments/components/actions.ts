"use server"

import supabaseAdmin from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getCompanyId() {
  try {
    const supabase = await createClient()
    const { data: admin, error: adminError } = await supabase.auth.getUser()

    if (adminError || !admin?.user) {
      throw new Error("Guest or unauthenticated user")
    }

    const { data: company, error: companyError } = await supabaseAdmin
      .from("administrators")
      .select("company_id")
      .eq("user_id", admin.user.id)
      .single()

    if (companyError) {
      throw new Error("Error fetching company ID")
    }

    return company.company_id
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getDepartmentsList(companyId: string, search?: string) {
  try {
    let query = supabaseAdmin
      .from("departments")
      .select("*")
      .eq("company_id", companyId)

    if (search) {
      query = query.ilike("name", `%${search}%`)
    }

    const { data: departments, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    return departments || []
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function addDepartment(data: {
  company_id: string
  name: string
  description?: string
}) {
  try {
    const { error } = await supabaseAdmin.from("departments").insert([data])

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath("/admin/departments")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: (error as Error).message }
  }
}

export async function updateDepartment(
  id: string,
  data: {
    name: string
    description?: string
  }
) {
  try {
    const { error } = await supabaseAdmin
      .from("departments")
      .update(data)
      .eq("id", id)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath("/admin/departments")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteDepartment(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from("departments")
      .delete()
      .eq("id", id)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath("/admin/departments")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: (error as Error).message }
  }
}
