"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default function ProfileCard() {
  return (
    <div className="flex w-full items-center justify-between gap-4 border p-2 md:w-80">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarFallback>CN</AvatarFallback>
          <AvatarImage src={""} />
        </Avatar>
        <div>
          <p className="font-medium text-sm lg:text-md">Ericson Castasus</p>
          <p className="text-xs md:text-sm">123456</p>
        </div>
      </div>
      <Button size={"sm"} variant={"ghost"}>Logout</Button>
    </div>
  )
}
