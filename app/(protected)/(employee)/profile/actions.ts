"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function uploadAvatar(formData: FormData) {
  const file = formData.get("file") as File
  const employeeId = formData.get("employeeId") as string

  if (!file || !employeeId) {
    return { error: "Missing file or employee ID" }
  }

  const supabase = await createClient()

  const fileExt = file.name.split(".").pop()
  const fileName = `${employeeId}-${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  // 1. Upload to Supabase Storage 'avatars' bucket
  const { error: uploadError } = await supabase.storage
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
  const { data: publicUrlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath)

  const publicUrl = publicUrlData.publicUrl

  // 3. Update employee_profiles table
  const { error: updateError } = await supabase
    .from("employee_profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", employeeId)

  if (updateError) {
    console.error("Update DB error:", updateError)
    return { error: "Failed to update profile with new image." }
  }

  revalidatePath("/profile")
  revalidatePath("/dashboard")

  return { success: true, avatarUrl: publicUrl }
}

export async function getSignedUrl({ filePath }: { filePath: string }) {
  const supabase = await createClient()

  // If filePath is a full URL, extract the path after 'avatars/'
  const path = filePath.includes("avatars/")
    ? filePath.split("avatars/").pop()
    : filePath

  if (!path) {
    return { error: "Invalid file path" }
  }

  const { data, error } = await supabase.storage
    .from("avatars")
    .createSignedUrl(path, 60)

  if (error) {
    console.error("Error getting signed URL for path:", path, error)
    return { error: `Failed to get signed URL: ${error.message}` }
  }

  return { success: true, signedUrl: data.signedUrl }
}

