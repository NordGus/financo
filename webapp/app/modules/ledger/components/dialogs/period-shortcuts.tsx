import { CalendarIcon } from "lucide-react"
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
  onOpenCustomPicker: (open: boolean) => void
  submitting: boolean
}

export function PeriodShortcuts({ open, onOpenChange, onOpenCustomPicker, submitting }: Props) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Period</DrawerTitle>
          <DrawerDescription className="hidden" data-hidden>
            Select which period you want preview
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid grid-cols-2 rounded-lg overflow-clip gap-2 px-4">
          <Button
            variant={"secondary"}
            size={"xl"}
            className="col-span-2"
            onClick={() => onOpenCustomPicker(true)}
            disabled={submitting}
          >
            <CalendarIcon />
            Select a custom period
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