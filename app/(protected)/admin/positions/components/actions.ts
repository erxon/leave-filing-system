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

export async function getDepartments(companyId: string) {
  try {
    const { data: departments, error } = await supabaseAdmin
      .from("departments")
      .select("id, name")
      .eq("company_id", companyId)

    if (error) {
      throw new Error(error.message)
    }

    return departments
  } catch (error) {
    return []
  }
}

export async function addPosition(data: {
  company_id: string
  department_id: string
  name: string
  description?: string
  reports_to?: string
}) {
  try {
    const { error } = await supabaseAdmin.from("positions").insert([data])

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath("/admin/positions")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: (error as Error).message }
  }
}

export async function updatePosition(
  id: string,
  data: {
    department_id: string
    name: string
    description?: string
    reports_to?: string
  }
) {
  try {
    const { error } = await supabaseAdmin
      .from("positions")
      .update(data)
      .eq("id", id)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath("/admin/positions")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: (error as Error).message }
  }
}

export async function deletePosition(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from("positions")
      .delete()
      .eq("id", id)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath("/admin/positions")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: (error as Error).message }
  }
}

export async function getPositions(
  companyId: string,
  search?: string,
  departmentId?: string
) {
  try {
    let query = supabaseAdmin
      .from("positions")
      .select(
        "id, name, description, department_id, reports_to, reporting_to:reports_to(name)"
      )
      .eq("company_id", companyId)

    if (search) {
      query = query.ilike("name", `%${search}%`)
    }

    if (departmentId && departmentId !== "all") {
      query = query.eq("department_id", departmentId)
    }

    const { data: positions, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    return (positions || []).map((p) => ({
      ...p,
      reporting_to: Array.isArray(p.reporting_to)
        ? (p.reporting_to[0] as { name: string } | undefined)
        : p.reporting_to,
    }))
  } catch (error) {
    console.error(error)
    return []
  }
}
