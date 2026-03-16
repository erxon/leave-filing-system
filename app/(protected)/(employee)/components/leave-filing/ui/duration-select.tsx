import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function DurationSelect({
  onChange,
}: {
  onChange: (value: "full-day" | "half-day") => void
}) {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select duration" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Duration</SelectLabel>
          <SelectItem value="full-day">Full-day</SelectItem>
          <SelectItem value="half-day">Half-day</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
