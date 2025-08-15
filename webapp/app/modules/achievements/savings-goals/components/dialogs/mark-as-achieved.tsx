import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Trophy, X } from "lucide-react";
import { createContext, PropsWithChildren, use, useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { createPath, useFetcher, useLocation } from "react-router";
import { toast } from "sonner";
import z from "zod";
import { DateInput } from "~/modules/shared/components/inputs/date-input";
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
import { Form, FormField, FormItem, FormMessage } from "~/modules/shared/components/ui/form";
import { Label } from "~/modules/shared/components/ui/label";
import { Currency } from "~/modules/shared/types/currency";
import { clientAction } from "~/routes/savings-goals/edit";

type SavingsGoalData = {
  id: number
  name: string
  target: number
  saved: number
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

const schema = z.object({
  achievedAt: z.date({ error: "invalid" })
})

// Mark As Achieved Dialog exposes a combination of Contexts, Components and
// Hooks to expose the functionality to trigger the dialog from every child in
// the financo, so make sure to wrap the components you want to control.
export function MarkAsAchievedDialog({ children }: PropsWithChildren) {
  const { submit } = useFetcher<typeof clientAction>({ key: "mark-as-achieved.savings-goal.dialog" })
  const { pathname, search, hash } = useLocation()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      achievedAt: new Date()
    }
  })

  const [savingsGoal, setSavingsGoal] = useState<SavingsGoalData | null>(null)
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onConfirmSavingsGoalMarkAsAchieved = useCallback<OnConfirmSavingsGoalMarkAsAchieved>((goal) => {
    if (goal.saved !== goal.target) return

    setSavingsGoal(goal)
    setOpen(true)
    setIsSubmitting(false)
  }, [setSavingsGoal, setOpen, setIsSubmitting])

  const context = useMemo<DialogState>(() => ({
    submitting: isSubmitting,
    onConfirmSavingsGoalMarkAsAchieved,
  }), [isSubmitting, onConfirmSavingsGoalMarkAsAchieved])

  const onOpenChange = useCallback((open: boolean) => {
    if (isSubmitting) return;

    setOpen(open)
  }, [isSubmitting, setOpen])

  const onSubmit = useCallback(async (values: z.infer<typeof schema>) => {
    if (savingsGoal?.id === undefined) return;

    setIsSubmitting(true)

    toast.promise(
      submit(
        {
          achievedAt: format(values.achievedAt, "yyyy-MM-dd"),
          intent: "mark-as-achieved"
        },
        {
          action: createPath({ pathname: `/savings-goals/${savingsGoal.id}`, search, hash }),
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
  }, [savingsGoal?.id, savingsGoal?.name, setIsSubmitting, search, hash])

  useEffect(() => {
    setIsSubmitting(false)
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return

    form.reset({ achievedAt: new Date() })
  }, [open, form.reset])

  useEffect(() => {
    if (Object.keys(form.formState.errors).length === 0) return

    console.error(form.formState.errors)
  }, [form.formState.errors])

  return (
    <MarkAsAchievedDialogContext.Provider value={context}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="mark-savings-goal-as-achieved-form" className="hidden">
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
                  <div className="space-y-2.5">
                    <ul className="space-y-2 text-sm">
                      <li>This will permanently move <span className="font-black">{savingsGoal.name}</span> to your Trophy Room history.</li>
                      <li>And will make <span className="font-black">financo</span> recalculate your progress relative to the remaining Savings Goals.</li>
                    </ul>

                    <FormField
                      control={form.control}
                      name="achievedAt"
                      render={({ field }) => (
                        <FormItem className="pt-4">
                          <Label>
                            <span>{`Which date you consider `}<span className="font-black">{savingsGoal.name}</span>{` was achieved?`}</span>
                          </Label>
                          <DateInput
                            value={field.value}
                            onSelect={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                  type="submit"
                  form="mark-savings-goal-as-achieved-form"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Throbber /> : <Trophy />} Mark as Achieved
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Form>
      </Dialog>
      {children}
    </MarkAsAchievedDialogContext.Provider >
  )
}