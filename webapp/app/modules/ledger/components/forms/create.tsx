import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "~/modules/shared/components/ui/drawer"
import { useCreationStore } from "../../stores/creation"
import { OnSubmitCreateTransactionAction } from "../../types/create"
import { Kind } from "../../types/transactions"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitAction: OnSubmitCreateTransactionAction
  submitting: boolean
}

export function CreateTransaction({ open, onOpenChange, onSubmitAction, submitting }: Props) {
  const { kind, source, target } = useCreationStore(state => state)
  const reset = useCreationStore(state => state.reset)

  return (
    <Drawer modal open={open} onOpenChange={onOpenChange} onAnimationEnd={(open) => !open && reset()}>
      <DrawerContent className="">
        <DrawerHeader className="hidden">
          <DrawerTitle>New Transaction</DrawerTitle>
          <DrawerDescription>
            {"Please fill the Transaction's data"}
          </DrawerDescription>
        </DrawerHeader>
        <CreateForm
          kind={kind}
          source={source}
          target={target}
          onSubmitAction={onSubmitAction}
          submitting={submitting}
        />
      </DrawerContent>
    </Drawer>
  )
}

interface FormProps {
  kind: Kind
  source: number
  target: number
  onSubmitAction: OnSubmitCreateTransactionAction
  submitting: boolean
}

function CreateForm({ }: FormProps) {
  return (
    <>
      <p>Form goes here</p>
    </>
  )
}