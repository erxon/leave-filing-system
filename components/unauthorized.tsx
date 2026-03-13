import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconArrowBack } from "@tabler/icons-react"

export default function Unauthorized() {
  return (
    <>
      <div className="max-w-200 p-16">
        <div className="mb-4 flex flex-col gap-2">
          <p className="text-lg font-bold">You are not authorized</p>
          <p>
            Contact your system administrator if you think this is a mistake
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={"outline"} asChild>
            <Link href={"/"}>
              <IconArrowBack />
              Return
            </Link>
          </Button>
          <Button variant={"ghost"}>Logout</Button>
        </div>
      </div>
    </>
  )
}
