"use server"

import supabaseAdmin from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function getLeaveConfigurationData(companyId: string) {
  try {
    // Fetch leave types
    const { data: leaveTypes, error: ltError } = await supabaseAdmin
      .from("leave_types")
      .select("id, leave_type, code")
      .in("code", ["VL", "SL"])

    if (ltError) throw new Error(ltError.message)

    // Fetch positions
    const { data: positions, error: posError } = await supabaseAdmin
      .from("positions")
      .select("id, name")
      .eq("company_id", companyId)

    if (posError) throw new Error(posError.message)

    // Fetch existing leave configurations
    const { data: leaveConfigs, error: confError } = await supabaseAdmin
      .from("leave_configuration")
      .select("*")
      .eq("company_id", companyId)

    if (confError) throw new Error(confError.message)

    return {
      leaveTypes: leaveTypes || [],
      positions: positions || [],
      leaveConfigs: leaveConfigs || [],
    }
  } catch (error) {
    console.error("Error fetching leave configuration data:", error)
    return {
      leaveTypes: [],
      positions: [],
      leaveConfigs: [],
    }
  }
}

export async function updateLeaveConfiguration(data: {
  company_id: string
  position_id: string
  leave_type: number
  number_of_leaves: number
}) {
  try {
    // Check if configuration already exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("leave_configuration")
      .select("id")
      .eq("company_id", data.company_id)
      .eq("position_id", data.position_id)
      .eq("leave_type", data.leave_type)
      .single()

    if (fetchError) throw new Error(fetchError.message)

    let error
    if (existing) {
      // Update
      const { error: updateError } = await supabaseAdmin
        .from("leave_configuration")
        .update({
          number_of_leaves: data.number_of_leaves,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
      error = updateError
    } else {
      // Insert
      const { error: insertError } = await supabaseAdmin
        .from("leave_configuration")
        .insert([data])
      error = insertError
    }

    if (error) throw new Error(error.message)

    revalidatePath("/admin/leaves")
    return { success: true }
  } catch (error) {
    console.error("Error updating leave configuration:", error)
    return { success: false, error: (error as Error).message }
  }
}
