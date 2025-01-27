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
import { icons } from "~/modules/shared/components/ui/icon"
import { accountKindToHuman } from "~/modules/shared/helpers/account-kind-to-human"
import { ModuleKind } from "../../types/account"
import { defaultIcons } from "../../types/icons"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (kind: ModuleKind) => void
}

export function SelectAccountKindToCreate({ open, onOpenChange, onSelect }: Props) {
  const kinds: ModuleKind[] = ["capital_normal", "capital_savings", "debt_credit", "debt_loan", "debt_personal"]

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
              {icons[defaultIcons[kind]]} {accountKindToHuman(kind)}
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