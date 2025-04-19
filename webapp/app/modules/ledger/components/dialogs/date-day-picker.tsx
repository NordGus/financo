import { ListFilterIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "~/modules/shared/components/ui/button"
import { Calendar } from "~/modules/shared/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/modules/shared/components/ui/dialog"
import {
  DrawerClose
} from "~/modules/shared/components/ui/drawer"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: Date | undefined
  onConfirm: (date: Date | undefined) => void
  submitting: boolean
}

export function DateDayPicker({ open, onOpenChange, date, onConfirm, submitting }: Props) {
  const [selected, setSelected] = useState<Date | undefined>(date)

  useEffect(() => setSelected(date), [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-fit">
        <DialogHeader>
          <DialogTitle>Pick a Day</DialogTitle>
          <DialogDescription className="hidden" data-hidden>
            {"Select the date you want to filter the ledger's Transactions by"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <Calendar
            initialFocus
            mode="single"
            numberOfMonths={3}
            defaultMonth={selected}
            selected={selected}
            onSelect={setSelected}
          />
        </div>
        <DialogFooter>
          <DrawerClose asChild>
            <Button variant={"outline"} disabled={submitting}>
              Cancel
            </Button>
          </DrawerClose>
          <Button
            onClick={() => onConfirm(selected)}
            disabled={submitting || !selected}
          >
            <ListFilterIcon /> Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}