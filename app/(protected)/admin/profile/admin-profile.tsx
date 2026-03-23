"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { getAvatar, updatePersonalDetails, uploadAvatar } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Loader2, UploadCloud } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

interface AdminProfile {
  avatar: string
  first_name: string
  last_name: string
}

export default function AdminProfile({ admin }: { admin: AdminProfile }) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    admin.avatar || null
  )
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [personalDetails, setPersonalDetails] = useState({
    first_name: admin.first_name,
    last_name: admin.last_name,
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchAvatar = useCallback(async () => {
    const avatar = await getAvatar()
    setPreviewUrl(avatar.publicUrl)
  }, [])

  useEffect(() => {
    fetchAvatar()
  }, [fetchAvatar])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Quick size check (e.g., max 5MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB")
      return
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      toast.info("No new image selected.")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const result = await uploadAvatar(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Profile picture updated successfully!")
        setSelectedFile(null)
      }
    } catch {
      toast.error("An unexpected error occurred.")
    } finally {
      setIsUploading(false)
    }
  }

  const handlePersonalDetailsUpdate = async () => {
    setIsLoading(true)

    try {
      const result = await updatePersonalDetails(personalDetails)
      if (result.success) {
        toast.info("Personal details updated successfully!")
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Update your avatar. This will be shown to your manager and
            teammates.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Avatar className="h-32 w-32 border-4 border-muted shadow-sm md:h-40 md:w-40">
            <AvatarImage
              src={previewUrl || ""}
              alt="Profile picture"
              className="object-cover"
            />
            <AvatarFallback className="text-4xl">
              {admin.first_name[0]}
              {admin.last_name[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex w-full flex-col items-center space-y-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleUploadClick}
              className="w-full max-w-xs"
              disabled={isUploading}
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              {selectedFile ? "Change Selection" : "Select New Image"}
            </Button>
            {selectedFile && (
              <p className="w-full truncate px-4 text-center text-xs text-muted-foreground">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t p-4">
          <Button
            onClick={handleSubmit}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Save Image"
            )}
          </Button>
        </CardFooter>
      </Card>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={personalDetails.first_name}
            onChange={(e) => {
              setPersonalDetails({
                ...personalDetails,
                first_name: e.target.value,
              })
            }}
            className="bg-muted/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={personalDetails.last_name}
            onChange={(e) => {
              setPersonalDetails({
                ...personalDetails,
                last_name: e.target.value,
              })
            }}
            className="bg-muted/50"
          />
        </div>
        <Button disabled={isLoading} onClick={handlePersonalDetailsUpdate}>
          {isLoading ? (
            <>
              <Spinner />
              Updating...
            </>
          ) : (
            "Update"
          )}
        </Button>
      </div>
    </div>
  )
}
