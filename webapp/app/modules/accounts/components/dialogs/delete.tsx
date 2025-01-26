import { ConfirmationDialog } from "~/shared/components/dialogs/confirmation";
import { Account } from "../../types/account";
import { OnSubmitDeleteAccountAction } from "../../types/delete";

interface Props {
  account: Account
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: OnSubmitDeleteAccountAction
  submitting: boolean
}

export function DeleteAccount({ account, open, onOpenChange, onConfirm, submitting }: Props) {
  const { id, name, additionalData: { transactions } } = account

  return (
    <ConfirmationDialog open={open} onOpenChange={onOpenChange} onConfirm={() => onConfirm(id)} submitting={submitting}>
      You are about to permanently delete <span className="font-bold">{name}</span> from your Accounts and its related <span className="font-bold">{transactions}</span> transaction(s) from your ledger. <span className="font-bold">This action cannot be undone</span>.
    </ConfirmationDialog>
  )
}