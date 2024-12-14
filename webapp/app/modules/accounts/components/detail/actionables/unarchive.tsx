import { PackageOpenIcon } from "lucide-react";
import { useState } from "react";
import { redirect } from "react-router";
import { Account } from "~/modules/accounts/types/detailed";
import { Button } from "~/shared/components/ui/button";
import { UnarchiveDialog } from "../../dialogs/unarchive";

interface Props {
  account: Account
}

export function Unarchive({ account: { id, name, additionalData: { transactions } } }: Props) {
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <>
      <Button variant={"outline"} onClick={() => setOpenDialog(true)}>
        <PackageOpenIcon /> Unarchive
      </Button>

      <UnarchiveDialog
        account={{ id, name, transactions }}
        open={openDialog}
        onOpenChanged={setOpenDialog}
        onSuccess={() => {
          setOpenDialog(false)
          redirect(".")
        }}
      />
    </>
  )
}