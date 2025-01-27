import { ConfirmationDialog } from "~/modules/shared/components/dialogs/confirmation";

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  childrenCount: number
  onConfirm: () => void
  submitting: boolean
}

export function UnarchiveDialog({
  open,
  onOpenChange,
  name,
  childrenCount,
  onConfirm,
  submitting
}: Props) {
  return (
    <ConfirmationDialog open={open} onOpenChange={onOpenChange} onConfirm={onConfirm} submitting={submitting}>
      You are about to unarchive <span className="font-bold">{name}</span> and its <span className="font-bold">{childrenCount}</span> child(ren). This will make it reappear as an selectable option in <span className="font-bold text-foreground">financo</span>. <span className="font-bold">This action can be reverted from the Categories</span>.
    </ConfirmationDialog>
  )
}