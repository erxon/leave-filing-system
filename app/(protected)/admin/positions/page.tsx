import PositionCard from "./components/position-card"
import NewPosition from "./components/new-position"
import PositionFilters from "./components/position-filters"
import {
  getCompanyId,
  getDepartments,
  getPositions,
} from "./components/actions"
import { Position } from "./components/positions.type"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const search = typeof params.search === "string" ? params.search : undefined
  const departmentId =
    typeof params.department === "string" ? params.department : undefined

  const companyId = await getCompanyId()
  const departments = companyId ? await getDepartments(companyId) : []
  const positions = companyId
    ? await getPositions(companyId, search, departmentId)
    : []

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
      <PositionFilters departments={departments} />

      {/* Positions Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Position Card 1 */}
        <PositionList
          companyId={companyId!}
          departments={departments}
          positions={positions}
        />
      </div>
    </div>
  )
}

async function PositionList({
  companyId,
  departments,
  positions,
}: {
  companyId: string
  departments: { id: string; name: string }[]
  positions: Position[]
}) {
  return (
    <>
      {positions.map((position) => (
        <PositionCard
          key={position.id}
          position={position}
          companyId={companyId}
          departments={departments}
          positions={positions}
        />
      ))}
    </>
  )
}
