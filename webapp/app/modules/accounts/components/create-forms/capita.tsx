import { DialogTitle } from "@radix-ui/react-dialog";
import { InfoDialog } from "~/shared/components/dialogs/info";
import { DialogFooter, DialogHeader } from "~/shared/components/ui/dialog";
import { accountKindsManual } from "../../manual/account-kinds-manual";

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
      <div></div>
      <DialogFooter></DialogFooter>
    </>
  )
}
