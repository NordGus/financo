import { InfoDialog } from "~/shared/components/dialogs/info";
import { DialogHeader, DialogTitle } from "~/shared/components/ui/dialog";
import { accountKindsManual } from "../../manual/account-kinds-manual";
import { CreateAccount } from "../forms/create";

export function CreateCreditAccount() {
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
        kind="debt_loan"
        defaultCurrency="EUR"
        defaultIcon="hand_coins"
        withCapital
      />
    </>
  )
}
