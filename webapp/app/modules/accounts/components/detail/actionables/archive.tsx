import { PackageIcon } from "lucide-react";
import { useState } from "react";
import { redirect } from "react-router";
import { Account } from "~/modules/accounts/types/detailed";
import { Button } from "~/shared/components/ui/button";
import { ArchiveDialog } from "../../dialogs/archive";

interface Props {
  account: Account
}

export function Archive({ account: { id, name, additionalData: { transactions } } }: Props) {
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <>
      <Button variant={"outline"} onClick={() => setOpenDialog(true)}>
        <PackageIcon /> Archive
      </Button>

      <ArchiveDialog
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