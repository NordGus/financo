import { ListFilterIcon } from "lucide-react"
import { ComponentProps, useEffect, useState } from "react"
import { DateRange } from "react-day-picker"
import { Button } from "~/modules/shared/components/ui/button"
import { Calendar } from "~/modules/shared/components/ui/calendar"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "~/modules/shared/components/ui/dialog"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  range: DateRange | undefined
  onConfirm: (range: DateRange | undefined) => void
  submitting: boolean
}

export function DateRangePicker({
  open,
  onOpenChange,
  range,
  onConfirm,
  submitting,
  ...props
}: ComponentProps<typeof Dialog> & Props) {
  const [date, setDate] = useState<DateRange | undefined>(range)

  useEffect(() => setDate(range), [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...props}>
      <DialogContent className="sm:max-w-fit">
        <DialogHeader>
          <DialogTitle>Pick a Date Range</DialogTitle>
          <DialogDescription>
            {"Select the date range you want to filter the ledger's Transactions by"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <Calendar
            initialFocus
            mode="range"
            numberOfMonths={3}
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"} disabled={submitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={() => onConfirm(date)} disabled={submitting || !date?.from || !date.to}>
            <ListFilterIcon /> Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}