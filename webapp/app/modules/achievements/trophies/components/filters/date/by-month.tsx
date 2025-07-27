import { useDeferredValue, useEffect, useState } from "react"
import { MonthPicker } from "~/modules/shared/components/pickers/month-picker"

interface Props {
  value?: Date
  onChange: (date: Date) => void
  defaultValue?: Date
  className?: string
}

export function ByMonth({ value, onChange, defaultValue = new Date, className }: Props) {
  const [selected, setSelected] = useState(value ?? defaultValue)
  const deferredSelected = useDeferredValue(selected)

  useEffect(() => {
    if (value?.toDateString() === selected.toDateString()) return

    setSelected(value ?? defaultValue)
  }, [value?.toDateString()])

  useEffect(() => {
    onChange(deferredSelected)
  }, [deferredSelected.toDateString()])

  return (
    <MonthPicker
      value={selected}
      onChange={(date) => setSelected(date)}
      defaultValue={defaultValue}
      className={className}
    />
  )
}