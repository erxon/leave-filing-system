"use client"

import React, { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { getCroppedImg } from "@/lib/image-utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Area, Point } from "react-easy-crop"


interface ImageCropperProps {
  image: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCropComplete: (croppedImage: Blob) => void
}

export function ImageCropper({
  image,
  open,
  onOpenChange,
  onCropComplete,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)


  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop)
  }

  const onZoomChange = (zoom: number) => {
    setZoom(zoom)
  }

  const onCropAreaComplete = useCallback(
    (_: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )


  const handleCrop = async () => {
    if (!image || !croppedAreaPixels) return

    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels)
      if (croppedImage) {
        onCropComplete(croppedImage)
        onOpenChange(false)
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (!image) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] gap-0 p-0 overflow-hidden">
        <DialogHeader className="p-6">
          <DialogTitle>Crop Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="relative h-[400px] w-full bg-muted">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={onCropChange}
            onCropComplete={onCropAreaComplete}
            onZoomChange={onZoomChange}
          />
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => onZoomChange(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCrop}>Crop & Save</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
