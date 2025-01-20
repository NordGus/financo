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
import { Account } from "../../types/account";

interface Props {
  account: Account
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (id: number) => Promise<void>
  submitting: boolean
}

export function ArchiveAccount({ account, open, onOpenChange, onConfirm, submitting }: Props) {
  const { id, name, additionalData: { transactions } } = account

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerHeader>Are you sure?</DrawerHeader>
          <DrawerDescription className="space-y-2">
            You are about to archive <span className="font-bold">{name}</span>. This will remove it as an selectable option from the rest of <span className="font-bold text-foreground">financo</span> while preserving its <span className="font-bold">{transactions}</span> transaction(s) in your ledger. <span className="font-bold">This action can be reverted from the Accounts archive</span>.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button onClick={() => onConfirm(id)} disabled={submitting}>
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