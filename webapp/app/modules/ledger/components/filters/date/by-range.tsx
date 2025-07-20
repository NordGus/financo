import { ComponentProps, useEffect, useState } from "react"
import { DateRange } from "react-day-picker"
import { cn } from "~/lib/utils"
import { Calendar } from "~/modules/shared/components/ui/calendar"

interface ByRangeProps {
  value: DateRange
  onChange: (from: Date | undefined, to: Date | undefined) => void
  defaultValue?: Date
}

export function ByRange({
  value,
  onChange,
  className,
  defaultValue = new Date,
  ...props
}: ComponentProps<typeof Calendar> & ByRangeProps) {
  const [selected, setSelected] = useState({
    from: value.from ?? defaultValue,
    to: value.to ?? value.from ?? defaultValue
  })

  useEffect(() => {
    if (!value.from || !value.to)
      setSelected({ from: value.from ?? defaultValue, to: value.to ?? value.from ?? defaultValue })
    else if (
      value.from.toDateString() !== selected.from?.toDateString() ||
      value.to.toDateString() !== selected.to.toDateString()
    ) {
      setSelected({ from: value.from ?? defaultValue, to: value.to ?? value.from ?? defaultValue })
    }
  }, [value.from?.toDateString(), value.to?.toDateString()])

  useEffect(() => {
    onChange(selected.from, selected.to)
  }, [selected.from.toDateString(), selected.to.toDateString()])

  return (
    <Calendar
      {...props}
      mode="range"
      selected={selected}
      defaultMonth={value.to ?? defaultValue}
      onSelect={(range) => {
        if (!range || !range.from || !range.to) return

        setSelected({ from: range.from, to: range.to })
      }}
      className={cn(
        "bg-sidebar text-sidebar-primary-foreground",
        className
      )}
    />
  )
}