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

    // 0. Get existing logo to delete later if update is successful
    const { data: currentCompany } = await supabaseAdmin
      .from("company")
      .select("logo")
      .eq("id", companyId)
      .single()

    const oldLogoUrl = currentCompany?.logo

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
      // Clean up the uploaded file if DB update fails
      await supabaseAdmin.storage.from("logos").remove([filePath])
      throw new Error("Failed to update company with new logo")
    }

    // 4. Delete old logo from storage if it exists in the 'logos' bucket
    if (oldLogoUrl && oldLogoUrl.includes("logos/")) {
      const oldPath = oldLogoUrl.split("logos/").pop()
      if (oldPath) {
        const { error: deleteError } = await supabaseAdmin.storage
          .from("logos")
          .remove([oldPath])

        if (deleteError) {
          console.error("Failed to delete old logo:", oldPath, deleteError)
        }
      }
    }

    return { success: true, logoUrl: publicUrl }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function getSignedURLForLogo({ filePath }: { filePath: string }) {
  const supabase = await createClient()

  const path = filePath.includes("logos/")
    ? filePath.split("logos/").pop()
    : filePath

  if (!path) {
    return { error: "Invalid logo path" }
  }

  const { data, error } = await supabase.storage
    .from("logos")
    .createSignedUrl(path, 60)

  if (error) {
    console.error("Error getting signed URL for path:", path, error)
    return { error: `Failed to get signed URL: ${error.message}` }
  }

  return { success: true, signedUrl: data.signedUrl }
}
