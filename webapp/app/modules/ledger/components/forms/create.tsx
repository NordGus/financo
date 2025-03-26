import { format } from "date-fns"
import { useRef } from "react"
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
  const today = useRef<Date>(new Date())

  return (
    <div className="p-4 grid grid-cols-2 grid-rows-auto gap-2">
      <div className="rounded-lg border h-16">
        From account
      </div>
      <div className="rounded-lg border h-16">
        To account
      </div>
      <div className="rounded-lg bg-zinc-700">
        Source amount
      </div>
      <div className="rounded-lg bg-zinc-700">
        Target amount
      </div>
      <div className="rounded-lg border col-span-2">
        Notes
      </div>
      <div className="col-span-2 grid grid-cols-5 grid-rows-4 gap-2">
        <div className="rounded-lg border aspect-square">div</div>
        <div className="rounded-lg border aspect-square">7</div>
        <div className="rounded-lg border aspect-square">8</div>
        <div className="rounded-lg border aspect-square">9</div>
        <div className="rounded-lg border aspect-square">back</div>
        <div className="rounded-lg border aspect-square">by</div>
        <div className="rounded-lg border aspect-square">4</div>
        <div className="rounded-lg border aspect-square">5</div>
        <div className="rounded-lg border aspect-square">6</div>
        <div className="rounded-lg border aspect-square">date</div>
        <div className="rounded-lg border aspect-square">minus</div>
        <div className="rounded-lg border aspect-square">1</div>
        <div className="rounded-lg border aspect-square">2</div>
        <div className="rounded-lg border aspect-square">3</div>
        <div className="rounded-lg border row-span-2">done</div>
        <div className="rounded-lg border aspect-square">plus</div>
        <div className="rounded-lg border aspect-square">curr</div>
        <div className="rounded-lg border aspect-square">0</div>
        <div className="rounded-lg border aspect-square">info</div>
      </div>
      <div className="text-sm col-span-2 text-center">
        Issued {format(today.current, "LLL dd, y")}. Effective {format(today.current, "LLL dd, y")}
      </div>
    </div>
  )
}