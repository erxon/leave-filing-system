import { getCompanyDetails } from "./actions"
import CompanyForm from "./company-form"
import CompanyLogo from "./company-logo"

export default async function CompanyDetails() {
  const company = await getCompanyDetails()

  if (!company) {
    return <div>No company found</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">Company</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <CompanyLogo company={company} />
        <CompanyForm company={company} />
      </div>
    </div>
  )
}
