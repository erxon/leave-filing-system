"use server"

import supabaseAdmin from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

export async function getCompanyDetails() {
  try {
    const supabase = await createClient()
    const { data: admin, error: adminError } = await supabase.auth.getUser()
    const { data: company, error: companyError } = await supabaseAdmin
      .from("administrators")
      .select("company_id")
      .eq("user_id", admin?.user?.id)
      .single()

    if (companyError || adminError) {
      throw new Error("Error fetching company details")
    }

    const { data: companyDetails, error: companyDetailsError } =
      await supabaseAdmin
        .from("company")
        .select("*")
        .eq("id", company?.company_id)
        .single()

    if (companyDetailsError) {
      throw new Error("Error fetching company details")
    }

    return companyDetails
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function updateCompanyDetails(
  id: string,
  data: { name: string; phone: string; email: string }
) {
  try {
    const { error } = await supabaseAdmin
      .from("company")
      .update(data)
      .eq("id", id)

    if (error) {
      throw new Error(error.message)
    }

    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: (error as Error).message }
  }
}

export async function uploadLogo(companyId: string, formData: FormData) {
  try {
    const file = formData.get("file") as File
    if (!file) {
      throw new Error("No file provided")
    }

    const fileExt = file.name.split(".").pop()
    const fileName = `${companyId}-${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    // 1. Upload to Supabase Storage 'logos' bucket
    const { error: uploadError } = await supabaseAdmin.storage
      .from("logos")
      .upload(filePath, file)

    if (uploadError) {
      console.error("Upload error:", uploadError)
      throw new Error("Failed to upload logo to storage")
    }

    // 2. Get Public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("logos")
      .getPublicUrl(filePath)

    const publicUrl = publicUrlData.publicUrl

    // 3. Update company table
    const { error: updateError } = await supabaseAdmin
      .from("company")
      .update({ logo: publicUrl })
      .eq("id", companyId)

    if (updateError) {
      throw new Error("Failed to update company with new logo")
    }

    return { success: true, logoUrl: publicUrl }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
