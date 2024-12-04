import { InfoDialog } from "~/shared/components/dialogs/info";
import { DialogHeader, DialogTitle } from "~/shared/components/ui/dialog";
import { accountKindsManual } from "../../manual/account-kinds-manual";
import { CreateAccount } from "../forms/create";

export function CreatePersonalDebtAccount() {
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          <div className="flex gap-2 items-center">
            New Personal debt Account <InfoDialog copy={accountKindsManual.personalDebt} />
          </div>
        </DialogTitle>
      </DialogHeader>
      <CreateAccount
        kind="debt_personal"
        defaultCurrency="EUR"
        defaultIcon="user"
        withCapital
      />
    </>
  )
}
