import { endOfWeek, startOfWeek } from "date-fns"
import { ComponentProps, useDeferredValue, useEffect, useState } from "react"
import { DateRange } from "react-day-picker"
import { cn } from "~/lib/utils"
import { Calendar } from "~/modules/shared/components/ui/calendar"

interface ByWeekProps {
  value: DateRange
  onChange: (from: Date | undefined, to: Date | undefined) => void
  defaultValue?: Date
}

export function ByWeek({
  value,
  onChange,
  className,
  defaultValue = new Date,
  ...props
}: ComponentProps<typeof Calendar> & ByWeekProps) {
  const [selected, setSelected] = useState({
    from: startOfWeek(value.from ?? defaultValue),
    to: endOfWeek(value.to ?? defaultValue)
  })
  const deferredSelected = useDeferredValue(selected)

  useEffect(() => {
    if (!value.from || !value.to) setSelected({ from: startOfWeek(defaultValue), to: endOfWeek(defaultValue) })
    else if (
      value.from.toDateString() !== selected.from?.toDateString() ||
      value.to.toDateString() !== selected.to.toDateString()
    ) {
      setSelected({ from: startOfWeek(value.to), to: endOfWeek(value.to) })
    }
  }, [value.from?.toDateString(), value.to?.toDateString()])

  useEffect(() => {
    onChange(deferredSelected.from, deferredSelected.to)
  }, [deferredSelected.from.toDateString(), deferredSelected.to.toDateString()])

  return (
    // @ts-expect-error-error
    <Calendar
      {...props}
      mode="range"
      selected={selected}
      defaultMonth={value.to ?? defaultValue}
      modifiers={{ selected }}
      onDayClick={(day, modifiers) => {
        if (modifiers.selected) return;

        setSelected({ from: startOfWeek(day), to: endOfWeek(day) })
      }}
      className={cn(
        "[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[33px]",
        className
      )}
    />
  )
}