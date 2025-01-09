import { DrawerHeader, DrawerTitle } from "~/shared/components/ui/drawer";
import { CreateAccount } from "../forms/create";

interface Props {
  onSuccess: () => void
  keyId: number
}

export function CreateSavingsAccount({ onSuccess, keyId }: Props) {
  return (
    <>
      <DrawerHeader>
        <DrawerTitle>New Savings Account</DrawerTitle>
      </DrawerHeader>
      <CreateAccount
        kind="capital_savings"
        defaultCurrency="EUR"
        defaultIcon="piggy_bank"
        onSuccess={onSuccess}
        keyId={keyId}
      />
    </>
  )
}
