import { useDeferredValue, useEffect, useState } from "react"
import { YearPicker } from "~/modules/shared/components/pickers/year-picker"

interface ByYearProps {
  value?: Date
  onChange: (date: Date) => void
  className?: string
}

export function ByYear({ value, onChange, className }: ByYearProps) {
  const [selected, setSelected] = useState(value ?? new Date)
  const deferredSelected = useDeferredValue(selected)

  useEffect(() => {
    if (!value) setSelected(new Date)
    else if (value.toDateString() !== selected.toDateString()) setSelected(value)
  }, [value?.toDateString()])

  useEffect(() => {
    onChange(deferredSelected)
  }, [deferredSelected.toDateString()])

  return (
    <YearPicker
      value={selected}
      onChange={(date) => setSelected(date)}
      className={className}
    />
  )
}