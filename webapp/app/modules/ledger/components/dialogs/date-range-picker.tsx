import { useEffect, useState } from "react"
import { DateRange } from "react-day-picker"
import { Button } from "~/modules/shared/components/ui/button"
import { Calendar } from "~/modules/shared/components/ui/calendar"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "~/modules/shared/components/ui/drawer"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  range: DateRange | undefined
  onConfirm: (range: DateRange | undefined) => void
  submitting: boolean
}

export function DateRangePicker({ open, onOpenChange, range, onConfirm, submitting }: Props) {
  const [date, setDate] = useState<DateRange | undefined>(range)

  useEffect(() => setDate(range), [open])

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Period</DrawerTitle>
          <DrawerDescription className="hidden" data-hidden>
            Select which period you want preview
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex justify-center">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
          />
        </div>
        <DrawerFooter>
          <Button onClick={() => onConfirm(date)} disabled={submitting || !date?.from || !date.to}>
            Apply
          </Button>
          <DrawerClose asChild>
            <Button variant={"outline"} disabled={submitting}>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}