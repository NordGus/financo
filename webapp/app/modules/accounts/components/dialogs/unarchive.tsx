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
import { Account } from "../../types/account";

interface Props {
  account: Account
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (id: number) => Promise<void>
  submitting: boolean
}

export function UnarchiveAccount({ account, open, onOpenChange, onConfirm, submitting }: Props) {
  const { id, name } = account

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you sure?</DrawerTitle>
          <DrawerDescription className="space-y-2">
            You are about to unarchive <span className="font-bold">{name}</span>. This will make it reappear as an selectable option in <span className="font-bold text-foreground">financo</span>. <span className="font-bold">This action can be reverted from the Accounts</span>.
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