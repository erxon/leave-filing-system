"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, UploadCloud, Building2 } from "lucide-react"
import { getSignedURLForLogo, uploadLogo } from "./actions"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface CompanyLogoProps {
  company: {
    id: string
    name: string
    logo?: string | null
  }
}

export default function CompanyLogo({ company }: CompanyLogoProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    company.logo || null
  )
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  async function getLogoURL() {
    const result = await getSignedURLForLogo({ filePath: company.logo || "" })
    if (result.success) {
      setPreviewUrl(result.signedUrl)
    }
  }

  useEffect(() => {
    getLogoURL()
  }, [company.logo])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB")
      return
    }

    setSelectedFile(file)
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.info("No new image selected.")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const result = await uploadLogo(company.id, formData)

      if (!result.success) {
        toast.error(result.error || "Failed to upload logo")
      } else {
        toast.success("Company logo updated successfully!")
        setSelectedFile(null)
        router.refresh()
      }
    } catch {
      toast.error("An unexpected error occurred.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Logo</CardTitle>
        <CardDescription>
          Update your company logo. This will be shown on reports and
          notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg border-2 border-muted bg-muted/50 p-2 shadow-sm md:h-40 md:w-40">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={company.name}
              className="h-full w-full object-contain"
            />
          ) : (
            <Building2 className="h-16 w-16 text-muted-foreground" />
          )}
        </div>

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
        <Button onClick={handleSubmit} disabled={!selectedFile || isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Save Logo"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
