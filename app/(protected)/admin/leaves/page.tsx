import PageHeader from "../components/page-header"
import { getCompanyId } from "../positions/components/actions"
import { getLeaveConfigurationData } from "./components/actions"
import { LeaveConfigTable } from "./components/leave-config-table"

export default async function Page() {
  const companyId = await getCompanyId()

  if (!companyId) {
    return <div>Error: Company ID not found.</div>
  }

  const { leaveTypes, positions, leaveConfigs } =
    await getLeaveConfigurationData(companyId)

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="w-full space-y-6">
        <PageHeader
          title="Leave Configuration"
          description=" Set the standard Vacation Leave and Sick Leave allowances for each
            position."
        />
        <div className="space-y-4">
          <LeaveConfigTable
            companyId={companyId}
            leaveTypes={leaveTypes as any}
            positions={positions}
            initialConfigs={leaveConfigs as any}
          />
        </div>
      </div>
    </div>
  )
}
