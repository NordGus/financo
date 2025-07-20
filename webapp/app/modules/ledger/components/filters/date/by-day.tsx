import { ComponentProps, useEffect, useState } from "react"
import { cn } from "~/lib/utils"
import { Calendar } from "~/modules/shared/components/ui/calendar"

interface ByDayProps {
  value?: Date
  onChange: (date: Date) => void
  defaultValue?: Date
}

export function ByDay({
  value,
  onChange,
  className,
  defaultValue = new Date(),
  ...props
}: ComponentProps<typeof Calendar> & ByDayProps) {
  const [selected, setSelected] = useState(value ?? defaultValue)

  useEffect(() => {
    if (!value) setSelected(defaultValue)
    else if (value.toDateString() !== selected.toDateString()) setSelected(value)
  }, [value?.toDateString()])

  useEffect(() => {
    onChange(selected)
  }, [selected.toDateString()])

  return (
    <Calendar
      {...props}
      mode="single"
      selected={selected}
      defaultMonth={value ?? defaultValue}
      onSelect={(day) => setSelected(prev => day ?? prev)}
      className={cn("bg-sidebar", className)}
    />
  )
}