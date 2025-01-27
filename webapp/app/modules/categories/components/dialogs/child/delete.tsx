import { ConfirmationDialog } from "~/modules/shared/components/dialogs/confirmation";

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  transactions: number
  onConfirm: () => void
  submitting: boolean
}

export function DeleteDialog({
  open,
  onOpenChange,
  name,
  transactions,
  onConfirm,
  submitting
}: Props) {
  return (
    <ConfirmationDialog open={open} onOpenChange={onOpenChange} onConfirm={onConfirm} submitting={submitting}>
      You are about to permanently delete <span className="font-bold">{name}</span> from your Categories and its related <span className="font-bold">{transactions}</span> transaction(s) from your ledger. <span className="font-bold">This action cannot be undone</span>.
    </ConfirmationDialog>
  )
}