"use client"

import { Button } from "@/components/ui/button"
import LeaveType from "./leave-type"
import SelectSupervisor from "./select-supervisor"
import { Input } from "@/components/ui/input"
import { DatePicker } from "./date-picker"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import MultipleDatePicker from "./multiple-date-picker"

export default function LeaveFilingForm() {
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardDescription>
            Fill all the required details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Input placeholder="Employee ID" type="text" />
            <Input placeholder="First Name" type="text" />
            <Input placeholder="Last Name" type="text" />
            <MultipleDatePicker />
            <SelectSupervisor />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Submit</Button>
        </CardFooter>
      </Card>
    </>
  )
}
