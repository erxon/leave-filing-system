"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { getSignedUrl } from "../../profile/actions"

export function AvatarSmall({
  avatar_url,
  fallback,
}: {
  avatar_url: string
  fallback: string
}) {
  const [avatar, setAvatar] = useState<string>(avatar_url)

  useEffect(() => {
    async function fetchAvatar() {
      if (!avatar_url) return
      const { signedUrl } = await getSignedUrl({ filePath: avatar_url })
      if (signedUrl) {
        setAvatar(signedUrl)
      }
    }
    fetchAvatar()
  }, [avatar_url])

  return (
    <Avatar>
      <AvatarImage src={avatar} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  )
}

export function AvatarLarge({
  avatar_url,
  fallback,
}: {
  avatar_url: string
  fallback: string
}) {
  const [avatar, setAvatar] = useState<string>(avatar_url)

  useEffect(() => {
    async function fetchAvatar() {
      if (!avatar_url) return
      const { signedUrl } = await getSignedUrl({ filePath: avatar_url })
      if (signedUrl) {
        setAvatar(signedUrl)
      }
    }
    fetchAvatar()
  }, [avatar_url])

  return (
    <Avatar className="h-10 w-10">
      <AvatarImage src={avatar} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  )
}

