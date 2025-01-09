import { DrawerHeader, DrawerTitle } from "~/shared/components/ui/drawer";
import { CreateAccount } from "../forms/create";

interface Props {
  onSuccess: () => void
  keyId: number
}

export function CreateLoanAccount({ onSuccess, keyId }: Props) {
  return (
    <>
      <DrawerHeader>
        <DrawerTitle>New Loan Account</DrawerTitle>
      </DrawerHeader>
      <CreateAccount
        kind="debt_loan"
        defaultCurrency="EUR"
        defaultIcon="hand_coins"
        withCapital
        onSuccess={onSuccess}
        keyId={keyId}
      />
    </>
  )
}
