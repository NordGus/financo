import { ConfirmationDialog } from "~/shared/components/dialogs/confirmation";
import { Account } from "../../types/account";
import { OnSubmitArchiveAccountAction } from "../../types/archive";

interface Props {
  account: Account
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: OnSubmitArchiveAccountAction
  submitting: boolean
}

export function ArchiveAccount({ account, open, onOpenChange, onConfirm, submitting }: Props) {
  const { id, name, additionalData: { transactions } } = account

  return (
    <ConfirmationDialog open={open} onOpenChange={onOpenChange} onConfirm={() => onConfirm(id)} submitting={submitting}>
      You are about to archive <span className="font-bold">{name}</span>. This will remove it as an selectable option from the rest of <span className="font-bold text-foreground">financo</span> while preserving its <span className="font-bold">{transactions}</span> transaction(s) in your ledger. <span className="font-bold">This action can be reverted from the Accounts archive</span>.
    </ConfirmationDialog>
  )
}