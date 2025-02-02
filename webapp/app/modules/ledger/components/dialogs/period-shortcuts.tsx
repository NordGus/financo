import { CalendarIcon, CircleEllipsisIcon, InfinityIcon } from "lucide-react"
import { Button } from "~/modules/shared/components/ui/button"
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
  onOpenRangePicker: (open: boolean) => void
  onOpenDayPicker: (open: boolean) => void
  onFilterChange: (from?: Date, to?: Date) => void
  submitting: boolean
}

export function PeriodShortcuts({
  open,
  onOpenChange,
  onOpenRangePicker,
  onOpenDayPicker,
  onFilterChange,
  submitting
}: Props) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Period</DrawerTitle>
          <DrawerDescription className="hidden" data-hidden>
            Select which period you want preview
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid grid-cols-2 rounded-lg overflow-clip gap-1 px-4">
          <Button
            variant={"secondary"}
            size={"xl"}
            className="col-span-2"
            onClick={() => onOpenRangePicker(true)}
            disabled={submitting}
          >
            <CircleEllipsisIcon /> Select Range
          </Button>
          <Button
            variant={"secondary"}
            size={"xl"}
            onClick={() => onFilterChange()}
            disabled={submitting}
          >
            <InfinityIcon /> Always
          </Button>
          <Button
            variant={"secondary"}
            size={"xl"}
            onClick={() => onOpenDayPicker(true)}
            disabled={submitting}
          >
            <CalendarIcon /> Select Day
          </Button>
        </div>
        <DrawerFooter>
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