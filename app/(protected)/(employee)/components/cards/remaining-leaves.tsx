import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, HeartPulse, Activity } from "lucide-react"

export default function RemainingLeaves() {
  const leaves = [
    { type: "Vacation Leave", remaining: 15, icon: CalendarDays, color: "text-blue-500" },
    { type: "Sick Leave", remaining: 15, icon: HeartPulse, color: "text-red-500" },
    { type: "Emergency Leave", remaining: 15, icon: Activity, color: "text-orange-500" },
  ]

  return (
    <>
      {leaves.map((leave) => (
        <Card key={leave.type}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              {leave.type}
            </CardTitle>
            <leave.icon className={`h-4 w-4 ${leave.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leave.remaining} Days</div>
            <p className="text-xs text-muted-foreground">
              Remaining balance
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
