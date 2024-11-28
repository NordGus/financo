import { InfoDialog } from "~/shared/components/dialogs/info";
import { DialogFooter, DialogHeader, DialogTitle } from "~/shared/components/ui/dialog";
import { accountKindsManual } from "../../manual/account-kinds-manual";

export function CreateSavingsAccount() {
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          <div className="flex gap-2 items-center">
            New Savings Account <InfoDialog copy={accountKindsManual.savings} />
          </div>
        </DialogTitle>
      </DialogHeader>
      <div></div>
      <DialogFooter></DialogFooter>
    </>
  )
}
