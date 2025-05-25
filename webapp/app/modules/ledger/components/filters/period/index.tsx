import { useDeferredValue, useEffect, useMemo, useState } from "react"
import { Period } from "~/modules/ledger/types/filters"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/modules/shared/components/ui/select"

interface ByPeriodProps {
  value: Period
  onChange: (period: Period) => void
}

export function ByPeriod({ value, onChange }: ByPeriodProps) {
  const [selected, setSelected] = useState(value)
  const deferredValue = useDeferredValue(selected)

  useEffect(() => {
    onChange(deferredValue)
  }, [deferredValue])

  useEffect(() => {
    if (value === selected) return

    setSelected(value)
  }, [value])

  const periods = useMemo<{ value: Period, name: string }[]>(() => {
    return [
      { value: "custom", name: "By Range" },
      { value: "daily", name: "By Day" },
      { value: "weekly", name: "By Week" },
      { value: "monthly", name: "By Month" },
      { value: "yearly", name: "By Year" },
      { value: "unlimited", name: "Entire Ledger" }
    ]
  }, [])

  return (
    <Select
      value={selected}
      onValueChange={(period) => setSelected(period as Period)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select time period to filter by" />
      </SelectTrigger>
      <SelectContent>
        {periods.map(({ value, name }) => (
          <SelectItem key={`period.select.${value}`} value={value}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}