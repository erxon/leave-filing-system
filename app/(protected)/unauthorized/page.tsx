import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Unauthorized() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p className="text-muted-foreground">
          You do not have permission to access this page.
        </p>
        <Button asChild>
          <Link href="/">Go Back</Link>
        </Button>
      </div>
    </div>
  )
}
