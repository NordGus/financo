import { DrawerHeader, DrawerTitle } from "~/shared/components/ui/drawer";
import { CreateAccount } from "../forms/create";

interface Props {
  onSuccess: () => void
  keyId: number
}

export function CreateCapitalAccount({ onSuccess, keyId }: Props) {
  return (
    <>
      <DrawerHeader>
        <DrawerTitle>New Capital Account</DrawerTitle>
      </DrawerHeader>
      <CreateAccount
        kind="capital_normal"
        defaultCurrency="EUR"
        defaultIcon="landmark"
        onSuccess={onSuccess}
        keyId={keyId}
      />
    </>
  )
}
