import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { Account } from "~/modules/accounts/types/detailed";
import { Button } from "~/shared/components/ui/button";
import { DeleteDialog } from "../../dialogs/delete";

interface Props {
  account: Account
}

// [ ] change api query to return the expected data
export function Delete({ account: { id, name } }: Props) {
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <>
      <Button variant={"destructive"} onClick={() => setOpenDialog(true)}>
        <TrashIcon /> Delete
      </Button>

      <DeleteDialog
        account={{ id, name, transactions: 1 }}
        open={openDialog}
        onOpenChanged={setOpenDialog}
      />
    </>
  )
}