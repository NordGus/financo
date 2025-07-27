import { endOfWeek, startOfWeek } from "date-fns"
import { ComponentProps, useEffect, useState } from "react"
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
  defaultValue = new Date(),
  ...props
}: ComponentProps<typeof Calendar> & ByWeekProps) {
  const [selected, setSelected] = useState({
    from: startOfWeek(value.to ?? defaultValue),
    to: endOfWeek(value.to ?? defaultValue)
  })

  useEffect(() => {
    const from = value.from?.toDateString()
    const to = value.to?.toDateString()
    const selectedFrom = selected.from?.toDateString()
    const selectedTo = selected.to?.toDateString()

    if (!from || !to)
      setSelected({ from: startOfWeek(defaultValue), to: endOfWeek(defaultValue) })
    else if (from !== selectedFrom || to !== selectedTo)
      setSelected({ from: startOfWeek(value.to!), to: endOfWeek(value.to!) })
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
      modifiers={{ selected }}
      onDayClick={(day, modifiers) => {
        if (modifiers.selected) return;

        setSelected({ from: startOfWeek(day), to: endOfWeek(day) })
      }}
      onSelect={() => { }} // This is here to prevent render errors.
      className={cn("bg-sidebar", className)}
    />
  )
}