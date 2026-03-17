import { ModeToggle } from "./mode-toggle"
import { SidebarTrigger } from "./ui/sidebar"

export default function SiteHeader() {
  return (
    <div className="flex items-center gap-2 px-8 py-4">
      <SidebarTrigger />
      <ModeToggle />
    </div>
  )
}
