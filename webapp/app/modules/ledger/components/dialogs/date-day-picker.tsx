import { ListFilterIcon } from "lucide-react"
import { useEffect, useState } from "react"
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
  date: Date | undefined
  onConfirm: (date: Date | undefined) => void
  submitting: boolean
}

export function DateDayPicker({ open, onOpenChange, date, onConfirm, submitting }: Props) {
  const [selected, setSelected] = useState<Date | undefined>(date)

  useEffect(() => setSelected(date), [open])

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Date</DrawerTitle>
          <DrawerDescription className="hidden" data-hidden>
            Select which Date you want preview
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex justify-center">
          <Calendar
            initialFocus
            mode="single"
            defaultMonth={selected}
            selected={selected}
            onSelect={setSelected}
          />
        </div>
        <DrawerFooter className="grid grid-cols-2">
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
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}