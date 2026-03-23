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
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Filter, MoreVertical, Trash2, Edit2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import PositionCard from "./components/position-card"
import NewPosition from "./components/new-position"
import {
  getCompanyId,
  getDepartments,
  getPositions,
} from "./components/actions"

export default async function Page() {
  const companyId = await getCompanyId()
  const departments = companyId ? await getDepartments(companyId) : []
  const positions = companyId ? await getPositions(companyId) : []

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Positions</h1>
          <p className="text-sm text-muted-foreground">
            Manage job titles and roles within the company.
          </p>
        </div>
        <NewPosition 
          companyId={companyId!} 
          departments={departments} 
          positions={positions}
        />
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search positions..."
            className="w-full pl-9 md:w-[300px]"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Positions Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Position Card 1 */}
        <PositionList />
      </div>
    </div>
  )
}

async function PositionList() {
  const companyId = await getCompanyId()
  const positions = companyId ? await getPositions(companyId) : []

  return (
    <>
      {positions.map((position) => (
        <PositionCard key={position.id} position={position} />
      ))}
    </>
  )
}
