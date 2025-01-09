import { DrawerHeader, DrawerTitle } from "~/shared/components/ui/drawer";
import { CreateAccount } from "../forms/create";

interface Props {
  onSuccess: () => void
  keyId: number
}

export function CreatePersonalDebtAccount({ onSuccess, keyId }: Props) {
  return (
    <>
      <DrawerHeader>
        <DrawerTitle>New Personal debt Account</DrawerTitle>
      </DrawerHeader>
      <CreateAccount
        kind="debt_personal"
        defaultCurrency="EUR"
        defaultIcon="user"
        withCapital
        onSuccess={onSuccess}
        keyId={keyId}
      />
    </>
  )
}
