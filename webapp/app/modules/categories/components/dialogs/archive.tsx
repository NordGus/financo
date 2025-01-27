import { ConfirmationDialog } from "~/modules/shared/components/dialogs/confirmation";

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  transactions: number
  childrenCount: number
  onConfirm: () => void
  submitting: boolean
}

export function ArchiveDialog({
  open,
  onOpenChange,
  name,
  transactions,
  childrenCount,
  onConfirm,
  submitting
}: Props) {
  return (
    <ConfirmationDialog open={open} onOpenChange={onOpenChange} onConfirm={onConfirm} submitting={submitting}>
      You are about to archive <span className="font-bold">{name}</span>. This will remove it as an selectable option from the rest of <span className="font-bold text-foreground">financo</span> while preserving its <span className="font-bold">{transactions}</span> transaction(s) in your ledger and its <span className="font-bold">{childrenCount}</span> child(ren). <span className="font-bold">This action can be reverted from the Categories archive</span>.
    </ConfirmationDialog>
  )
}