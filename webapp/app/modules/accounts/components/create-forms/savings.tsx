import { InfoDialog } from "~/shared/components/dialogs/info";
import { DialogHeader, DialogTitle } from "~/shared/components/ui/dialog";
import { accountKindsManual } from "../../manual/account-kinds-manual";
import { CreateAccount } from "../forms/create";

interface Props {
  onSuccess: () => void
}

export function CreateSavingsAccount({ onSuccess }: Props) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          <div className="flex gap-2 items-center">
            New Savings Account <InfoDialog copy={accountKindsManual.savings} />
          </div>
        </DialogTitle>
      </DialogHeader>
      <CreateAccount
        kind="capital_savings"
        defaultCurrency="EUR"
        defaultIcon="piggy_bank"
        onSuccess={onSuccess}
      />
    </>
  )
}
