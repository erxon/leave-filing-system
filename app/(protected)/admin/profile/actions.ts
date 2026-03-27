"use server"

import supabaseAdmin from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient()
  const { data: admin } = await supabase.auth.getUser()

  const userId = admin?.user?.id
  const file = formData.get("file") as File

  if (!file || !userId) {
    return { error: "Missing file or user ID" }
  }

  const fileExt = file.name.split(".").pop()
  const fileName = `${userId}-${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  // 1. Upload to Supabase Storage 'avatars' bucket
  const { error: uploadError } = await supabaseAdmin.storage
    .from("avatars")
    .upload(filePath, file)

  if (uploadError) {
    console.error("Upload error:", uploadError)
    return {
      error:
        "Failed to upload image. Please ensure the 'avatars' bucket exists and is configured.",
    }
  }

  // 2. Get Public URL
  const { data: publicUrlData } = supabaseAdmin.storage
    .from("avatars")
    .getPublicUrl(filePath)

  const publicUrl = publicUrlData.publicUrl

  // 3. Update administrators table
  const { error: updateError } = await supabaseAdmin
    .from("administrators")
    .update({ avatar: publicUrl })
    .eq("user_id", userId)

  if (updateError) {
    console.error("Update DB error:", updateError)
    return { error: "Failed to update profile with new image." }
  }

  revalidatePath("/admin/profile")

  return { success: true, avatarUrl: publicUrl }
}

export async function getAdminProfile() {
  const supabase = await createClient()
  const { data: admin, error } = await supabase.auth.getUser()
  const { data: adminData, error: adminDataError } = await supabaseAdmin
    .from("administrators")
    .select("*")
    .eq("user_id", admin?.user?.id)
    .single()

  if (error || adminDataError) {
    throw new Error("Error fetching admin")
  }

  return adminData
}

export async function updatePersonalDetails(personalDetails: {
  first_name: string
  last_name: string
}) {
  try {
    const supabase = await createClient()

    const { data: admin, error } = await supabase.auth.getUser()
    const { error: adminDataError } = await supabaseAdmin
      .from("administrators")
      .update(personalDetails)
      .eq("user_id", admin?.user?.id)
      .single()

    if (error || adminDataError) {
      throw new Error("Error updating admin")
    }

    revalidatePath("/admin/profile")

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function getAvatar() {
  const supabase = await createClient()
  const { data: admin, error } = await supabase.auth.getUser()
  const { data: adminData, error: adminDataError } = await supabaseAdmin
    .from("administrators")
    .select("avatar")
    .eq("user_id", admin?.user?.id)
    .single()

  const path = adminData?.avatar
    ? adminData?.avatar?.split("avatars/").pop()
    : ""

  const { data } = await supabaseAdmin.storage
    .from("avatars")
    .createSignedUrl(path, 60 * 60 * 24 * 7)

  if (error || adminDataError) {
    throw new Error("Error fetching admin")
  }

  if (!data) {
    throw new Error("Error fetching admin")
  }

  return data.signedUrl
}
