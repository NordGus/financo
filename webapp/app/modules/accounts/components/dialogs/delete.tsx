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

export function DeleteAccount({ account, open, onOpenChange, onConfirm, submitting }: Props) {
  const { id, name, additionalData: { transactions } } = account

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerHeader>Are you absolutely sure?</DrawerHeader>
          <DrawerDescription className="space-y-2">
            You are about to permanently delete <span className="font-bold">{name}</span> from your Accounts and its related <span className="font-bold">{transactions}</span> transaction(s) from your ledger. <span className="font-bold">This action cannot be undone</span>.
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