import { InfoDialog } from "~/shared/components/dialogs/info";
import { DialogHeader, DialogTitle } from "~/shared/components/ui/dialog";
import { accountKindsManual } from "../../manual/account-kinds-manual";
import { CreateAccount } from "../forms/create";

interface Props {
  onSuccess: () => void
  keyId: number
}

export function CreateCreditAccount({ onSuccess, keyId }: Props) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          <div className="flex gap-2 items-center">
            New Credit Account <InfoDialog copy={accountKindsManual.credit} />
          </div>
        </DialogTitle>
      </DialogHeader>
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
