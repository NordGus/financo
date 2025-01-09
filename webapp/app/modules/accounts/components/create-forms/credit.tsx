import { DrawerHeader, DrawerTitle } from "~/shared/components/ui/drawer";
import { CreateAccount } from "../forms/create";

interface Props {
  onSuccess: () => void
  keyId: number
}

export function CreateCreditAccount({ onSuccess, keyId }: Props) {
  return (
    <>
      <DrawerHeader>
        <DrawerTitle>New Credit Account</DrawerTitle>
      </DrawerHeader>
      <CreateAccount
        kind="debt_credit"
        defaultCurrency="EUR"
        defaultIcon="credit_card"
        withCapital
        onSuccess={onSuccess}
        keyId={keyId}
      />
    </>
  )
}
