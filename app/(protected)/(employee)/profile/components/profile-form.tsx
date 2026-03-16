"use client"

import { useState, useRef } from "react"
import { EmployeeProfile } from "@/lib/types"
import { uploadAvatar } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Loader2, UploadCloud } from "lucide-react"

export function ProfileForm({ employee }: { employee: EmployeeProfile }) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(employee.avatar_url || null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Quick size check (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
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
      formData.append("employeeId", employee.id)

      const result = await uploadAvatar(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Profile picture updated successfully!")
        setSelectedFile(null)
      }
    } catch (error) {
      toast.error("An unexpected error occurred.")
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Avatar Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Update your avatar. This will be shown to your manager and teammates.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-muted shadow-sm">
            <AvatarImage src={previewUrl || ""} alt="Profile picture" className="object-cover" />
            <AvatarFallback className="text-4xl">
              {employee.first_name[0]}{employee.last_name[0]}
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
              <p className="text-xs text-muted-foreground w-full text-center truncate px-4">
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

      {/* Account Info Card (Read Only for now) */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Your current employee details. Please contact HR to change these.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={employee.first_name} readOnly className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={employee.last_name} readOnly className="bg-muted/50" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Employee ID</Label>
            <Input value={employee.employee_id} readOnly className="bg-muted/50" />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Input value={employee.role} readOnly className="capitalize bg-muted/50" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
