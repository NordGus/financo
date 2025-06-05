import { DynamicIcon } from "lucide-react/dynamic"
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
import { accountKindToHuman } from "~/modules/shared/helpers/account-kind-to-human"
import { Kind } from "../../types/accounts"
import { defaultIcons } from "../../types/icons"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (kind: Kind) => void
}

export function SelectAccountKindToCreate({ open, onOpenChange, onSelect }: Props) {
  const kinds: Kind[] = ["capital", "savings", "debt", "credit"]

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create Account</DrawerTitle>
          <DrawerDescription>What kind of account do you want to create?</DrawerDescription>
        </DrawerHeader>
        <div className="grid grid-cols-2 p-4 gap-4">
          {kinds.map((kind) => (
            <Button key={`select.kind.${kind}`} onClick={() => onSelect(kind)}>
              <DynamicIcon name={defaultIcons[kind]} /> {accountKindToHuman(kind)}
            </Button>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}