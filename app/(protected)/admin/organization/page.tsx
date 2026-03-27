import PageHeader from "../components/page-header"
import { getCompanyId, getDepartments, getPositions } from "../positions/components/actions"
import OrgChart from "./components/org-chart"

export default async function OrganizationPage() {
  const companyId = await getCompanyId()
  const departments = companyId ? await getDepartments(companyId) : []
  const positions = companyId ? await getPositions(companyId) : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Organization Chart"
          description="Visual hierarchy of departments and positions within the company."
        />
      </div>

      <div className="rounded-xl border bg-card/50 shadow-sm overflow-x-auto min-h-[600px] p-2 sm:p-4">
        <OrgChart departments={departments} positions={positions} />
      </div>
    </div>
  )
}
