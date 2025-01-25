import { Throbber } from "~/shared/components/throbber";
import { Button } from "~/shared/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader
} from "~/shared/components/ui/drawer";

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  transactions: number
  onConfirm: () => void
  submitting: boolean
}

export function DeleteDialog({
  open,
  onOpenChange,
  name,
  transactions,
  onConfirm,
  submitting
}: Props) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerHeader>Are you absolutely sure?</DrawerHeader>
          <DrawerDescription className="space-y-2">
            You are about to permanently delete <span className="font-bold">{name}</span> from your Categories and its related <span className="font-bold">{transactions}</span> transaction(s) from your ledger. <span className="font-bold">This action cannot be undone</span>.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button onClick={() => onConfirm} disabled={submitting}>
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