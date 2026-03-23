import PageHeader from "../components/page-header"
import { getCompanyId, getDepartmentsList } from "./components/actions"
import NewDepartment from "./components/new-department"
import DepartmentFilters from "./components/department-filters"
import DepartmentCard from "./components/department-card"
import { Department } from "./components/departments.type"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const search = typeof params.search === "string" ? params.search : undefined

  const companyId = await getCompanyId()
  const departments = companyId 
    ? await getDepartmentsList(companyId, search) 
    : []

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Departments"
          description="Manage departments within the company."
        />
        <NewDepartment companyId={companyId!} />
      </div>

      {/* Filters and Search */}
      <DepartmentFilters />

      {/* Departments Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DepartmentList 
          companyId={companyId!} 
          departments={departments} 
        />
      </div>
    </div>
  )
}

function DepartmentList({
  companyId,
  departments,
}: {
  companyId: string
  departments: Department[]
}) {
  if (departments.length === 0) {
    return (
      <div className="col-span-full flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
        <p className="text-sm text-muted-foreground">No departments found.</p>
      </div>
    )
  }

  return (
    <>
      {departments.map((dept) => (
        <DepartmentCard 
          key={dept.id} 
          department={dept} 
          companyId={companyId} 
        />
      ))}
    </>
  )
}
