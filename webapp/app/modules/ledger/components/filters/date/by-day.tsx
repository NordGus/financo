import { ComponentProps, useDeferredValue, useEffect, useState } from "react"
import { cn } from "~/lib/utils"
import { Calendar } from "~/modules/shared/components/ui/calendar"

interface ByDayProps {
  value?: Date
  onChange: (date: Date) => void
}

export function ByDay({ value, onChange, className, ...props }: ComponentProps<typeof Calendar> & ByDayProps) {
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
    <Calendar
      {...props}
      mode="single"
      selected={selected}
      onSelect={(day) => setSelected(prev => day ?? prev)}
      className={cn(
        "[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[33px]",
        className
      )}
    />
  )
}