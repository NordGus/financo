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
  name: string
  transactions: number
  children: number
  onConfirm: () => void
  submitting: boolean
}

export function ArchiveDialog({
  open,
  onOpenChange,
  name,
  transactions,
  children,
  onConfirm,
  submitting
}: Props) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you sure?</DrawerTitle>
          <DrawerDescription className="space-y-2">
            You are about to archive <span className="font-bold">{name}</span>. This will remove it as an selectable option from the rest of <span className="font-bold text-foreground">financo</span> while preserving its <span className="font-bold">{transactions}</span> transaction(s) in your ledger and its <span className="font-bold">{children}</span> child(ren). <span className="font-bold">This action can be reverted from the Categories archive</span>.
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