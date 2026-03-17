import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Page() {
  return (
    <>
      <div className="p-16">
        <p className="text-lg font-bold">
          Welcome to the Online Leave Filing System
        </p>
        <p>Please login to continue</p>
        <Button variant={"link"} asChild>
          <Link href={"/auth/login"}>Login</Link>
        </Button>
      </div>
    </>
  )
}
