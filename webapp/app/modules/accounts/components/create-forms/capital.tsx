import { InfoDialog } from "~/shared/components/dialogs/info";
import { DialogHeader, DialogTitle } from "~/shared/components/ui/dialog";
import { accountKindsManual } from "../../manual/account-kinds-manual";
import { CreateAccount } from "../forms/create";

export function CreateCapitalAccount() {
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          <div className="flex gap-2 items-center">
            New Capital Account <InfoDialog copy={accountKindsManual.capital} />
          </div>
        </DialogTitle>
      </DialogHeader>
      <CreateAccount
        kind="capital_normal"
        defaultCurrency="EUR"
        defaultIcon="landmark"
      />
    </>
  )
}
