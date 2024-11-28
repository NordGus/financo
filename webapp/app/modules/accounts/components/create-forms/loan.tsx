import { InfoDialog } from "~/shared/components/dialogs/info";
import { DialogFooter, DialogHeader, DialogTitle } from "~/shared/components/ui/dialog";
import { accountKindsManual } from "../../manual/account-kinds-manual";

export function CreateLoanAccount() {
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          <div className="flex gap-2 items-center">
            New Loan Account <InfoDialog copy={accountKindsManual.loans} />
          </div>
        </DialogTitle>
      </DialogHeader>
      <div></div>
      <DialogFooter></DialogFooter>
    </>
  )
}
