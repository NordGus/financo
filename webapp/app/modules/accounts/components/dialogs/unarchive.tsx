import { ConfirmationDialog } from "~/shared/components/dialogs/confirmation";
import { Account } from "../../types/account";
import { OnSubmitUnarchiveAccountAction } from "../../types/unarchive";

interface Props {
  account: Account
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: OnSubmitUnarchiveAccountAction
  submitting: boolean
}

export function UnarchiveAccount({ account, open, onOpenChange, onConfirm, submitting }: Props) {
  const { id, name } = account

  return (
    <ConfirmationDialog open={open} onOpenChange={onOpenChange} onConfirm={() => onConfirm(id)} submitting={submitting}>
      You are about to unarchive <span className="font-bold">{name}</span>. This will make it reappear as an selectable option in <span className="font-bold text-foreground">financo</span>. <span className="font-bold">This action can be reverted from the Accounts</span>.
    </ConfirmationDialog>
  )
}