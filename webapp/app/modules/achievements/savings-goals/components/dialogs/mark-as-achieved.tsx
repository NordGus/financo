import { Trophy, X } from "lucide-react";
import { createContext, PropsWithChildren, use, useCallback, useEffect, useMemo, useState } from "react";
import { useFetcher, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { Throbber } from "~/modules/shared/components/throbber";
import { Button } from "~/modules/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "~/modules/shared/components/ui/dialog";
import { Currency } from "~/modules/shared/types/currency";
import { clientAction } from "~/routes/savings-goals/edit";

type SavingsGoalData = {
  id: number
  name: string
  target: number
  currency: Currency
}

type OnConfirmSavingsGoalMarkAsAchieved = (goal: SavingsGoalData) => void

type DialogState = {
  submitting: boolean
  onConfirmSavingsGoalMarkAsAchieved: OnConfirmSavingsGoalMarkAsAchieved
}

const MarkAsAchievedDialogContext = createContext<DialogState>({
  submitting: false,
  onConfirmSavingsGoalMarkAsAchieved: () => { }
})

export function useMarkAsAchievedDialog(): DialogState {
  return use(MarkAsAchievedDialogContext)
}

// Mark As Achieved Dialog exposes a combination of Contexts, Components and
// Hooks to expose the functionality to trigger the dialog from every child in
// the financo, so make sure to wrap the components you want to control.
export function MarkAsAchievedDialog({ children }: PropsWithChildren) {
  const { data, state, submit } = useFetcher<typeof clientAction>({ key: "mark-as-achieved.savings-goal.dialog" })
  const { search, hash } = useLocation()
  const navigate = useNavigate()

  const [savingsGoal, setSavingsGoal] = useState<SavingsGoalData | null>(null)
  const [open, setOpen] = useState(false)

  const isSubmitting = state === "submitting"

  const onConfirmSavingsGoalMarkAsAchieved = useCallback<OnConfirmSavingsGoalMarkAsAchieved>((goal) => {
    setSavingsGoal(goal)
    setOpen(true)
  }, [setSavingsGoal, setOpen])

  const context = useMemo<DialogState>(() => ({
    submitting: isSubmitting,
    onConfirmSavingsGoalMarkAsAchieved,
  }), [isSubmitting, onConfirmSavingsGoalMarkAsAchieved])

  const onOpenChange = useCallback((open: boolean) => {
    if (isSubmitting) return;

    setOpen(open)
  }, [isSubmitting, setOpen])

  const onConfirmed = useCallback(() => {
    if (savingsGoal?.id === undefined) return;

    toast.promise(
      submit(
        { intent: "mark-as-achieved" },
        {
          action: `/savings-goals/${savingsGoal.id}`,
          method: "post",
          encType: "application/json",
        }
      ).then(undefined, () => setOpen(false)),
      {
        loading: "Marking as Achieved...",
        success: `'${savingsGoal.name}' marked as achieved!`,
        error: `Couldn't marked as achieved '${savingsGoal.name}', something went wrong`
      }
    )
  }, [savingsGoal?.id, savingsGoal?.name, setOpen])

  useEffect(() => {
    if (!open) return
    if (data?.id === undefined) return
    if (savingsGoal?.id === undefined) return
    if (data.id !== savingsGoal.id) return

    setOpen(false)
    // This is not ideal, but until I find a way to trigger the redirection
    // until I find a way to trigger it on animation end.
    setTimeout(() => navigate({ pathname: "/savings-goals", search, hash }, { replace: true }), 200)
  }, [data?.id, savingsGoal?.id, open, navigate])

  return (
    <MarkAsAchievedDialogContext.Provider value={context}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="min-w-[35dvw]">
          <DialogHeader>
            {
              !savingsGoal
                ? (
                  <>
                    <DialogTitle>{`Retrieving Savings Goal...`}</DialogTitle>
                    <DialogDescription>{`Please wait a minute...`}</DialogDescription>
                  </>
                )
                : (
                  <>
                    <DialogTitle>
                      {`Do you want to delete this Savings Goal?`}
                    </DialogTitle>
                    <DialogDescription>
                      {`You're about to marked `}<span className="font-bold">{savingsGoal.name}</span>{` as Achieved. This is action cannot be undone!`}
                    </DialogDescription>
                  </>
                )
            }
          </DialogHeader>
          {
            savingsGoal && (
              <ul className="space-y-2 text-sm">
                <li>This will permanently move <span className="font-black">{savingsGoal.name}</span> to your Trophy Room history.</li>
                <li>And will make <span className="font-black">financo</span> recalculate your progress relative to the remaining Savings Goals.</li>
              </ul>
            )
          }
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant={"outline"}
                type="button"
                disabled={isSubmitting}
              >
                <X /> Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={onConfirmed}
              type="button"
              disabled={isSubmitting}
            >
              {
                isSubmitting
                  ? <Throbber />
                  : <><Trophy /> Mark as Achieved</>
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {children}
    </MarkAsAchievedDialogContext.Provider>
  )
}