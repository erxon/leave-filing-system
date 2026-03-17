"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SelectSupervisor() {

  return (
    <Select>
      <SelectTrigger className="w-full max-w-full">
        <SelectValue placeholder="Select Supervisor" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Supervisor</SelectLabel>
          <SelectItem value="SUP001">Supervisor 1</SelectItem>
          <SelectItem value="SUP002">Supervisor 2</SelectItem>
          <SelectItem value="SUP003">Supervisor 3</SelectItem>
          <SelectItem value="SUP004">Supervisor 4</SelectItem>
          <SelectItem value="SUP005">Supervisor 5</SelectItem>
          <SelectItem value="SUP006">Supervisor 6</SelectItem>
          <SelectItem value="SUP007">Supervisor 7</SelectItem>
          <SelectItem value="SUP008">Supervisor 8</SelectItem>
          <SelectItem value="SUP009">Supervisor 9</SelectItem>
          <SelectItem value="SUP010">Supervisor 10</SelectItem>
          <SelectItem value="SUP011">Supervisor 11</SelectItem>
          <SelectItem value="SUP012">Supervisor 12</SelectItem>
          <SelectItem value="SUP013">Supervisor 13</SelectItem>
          <SelectItem value="SUP014">Supervisor 14</SelectItem>
          <SelectItem value="SUP015">Supervisor 15</SelectItem>
          <SelectItem value="SUP016">Supervisor 16</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

    