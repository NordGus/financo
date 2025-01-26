import { PropsWithChildren } from "react";
import { Throbber } from "~/shared/components/throbber";
import { Button } from "~/shared/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "~/shared/components/ui/drawer";

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  submitting: boolean
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  submitting,
  children
}: PropsWithChildren<Props>) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you sure?</DrawerTitle>
          <DrawerDescription className="space-y-2">
            {children}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button onClick={onConfirm} disabled={submitting}>
            {submitting ? <Throbber size={"sm"} /> : "Confirm"}
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