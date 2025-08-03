import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Save, Trash, Trophy, X } from "lucide-react";
import { ComponentProps, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import z from "zod";
import { cn } from "~/lib/utils";
import { CurrencyAmountInput } from "~/modules/shared/components/inputs/currency-amount-input";
import { CurrencyInput } from "~/modules/shared/components/inputs/currency-input";
import { Throbber } from "~/modules/shared/components/throbber";
import { Button } from "~/modules/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/modules/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage
} from "~/modules/shared/components/ui/form";
import { Input } from "~/modules/shared/components/ui/input";
import { Textarea } from "~/modules/shared/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "~/modules/shared/components/ui/tooltip";
import { Currency } from "~/modules/shared/types/currency";
import { DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH } from "../schemas/constants";
import { formSchema } from "../schemas/create-or-update";

type Props = {
  name: string | undefined
  description: string | null | undefined
  targetAmount: number | undefined
  currency: Currency | undefined
  role: "create" | "update"
}

export function FormTemplate({
  name,
  description,
  targetAmount,
  currency,
  role,
  ...props
}: ComponentProps<"form"> & Props) {
  const fetcher = useFetcher()

  const { submit: destroySavingsGoal, state: destroyState } = useFetcher()
  const [openDestroyDialog, setOpenDestroyDialog] = useState(false)

  const { submit: markSavingsGoalAsAchieved, state: markAsAchieveState } = useFetcher()
  const [openMarkAsAchievedDialog, setOpenMarkAsAchievedDialog] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name ?? "New Savings Goal",
      description,
      target: targetAmount ?? 0,
      currency,
      intent: role
    }
  })

  useEffect(() => {
    form.reset({
      name: name ?? "New Savings Goal",
      description,
      target: targetAmount ?? 0,
      currency,
      intent: role
    })
  }, [
    name,
    description,
    targetAmount,
    currency,
    role,
    form.reset
  ])

  useEffect(() => {
    if (Object.keys(form.formState.errors).length === 0) return

    console.error(form.formState.errors)
  }, [form.formState.errors])

  useEffect(() => {
    if (destroyState !== "idle") return // to prevent unnecessary re-renders

    setOpenDestroyDialog(false)
  }, [destroyState, setOpenDestroyDialog])

  useEffect(() => {
    if (markAsAchieveState !== "idle") return // to prevent unnecessary re-renders

    setOpenMarkAsAchievedDialog(false)
  }, [markAsAchieveState, setOpenMarkAsAchievedDialog])

  const formName = form.watch("name")
  const formCurrency = form.watch("currency")

  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    toast.promise(
      fetcher.submit(
        { ...values },
        { method: "post", encType: "application/json" }
      ),
      {
        loading: values.intent === "create" ? "Creating..." : "Updating...",
        success: () => {
          if (values.intent !== "create") return `${values.name} updated!`
          return `${values.name} created!`
        },
        error: `Couldn't save ${values.name}, something went wrong`
      }
    )
  }, [fetcher.submit])

  const onDestroy = useCallback(() => {
    if (role !== "update") {
      toast.error("This goal is not saved yet")
      return
    }

    toast.promise(
      destroySavingsGoal(
        { intent: "destroy" },
        { method: "post", encType: "application/json" }
      ),
      {
        loading: "deleting...",
        success: `${formName} deleted!`,
        error: `Couldn't delete ${formName}, something went wrong`
      }
    )
  }, [destroySavingsGoal, formName, role])

  const onMarkAsAchieved = useCallback(() => {
    if (role !== "update") {
      toast.error("This goal is not saved yet")
      return
    }

    toast.promise(
      markSavingsGoalAsAchieved(
        { intent: "mark-as-achieved" },
        { method: "post", encType: "application/json" }
      ),
      {
        loading: "deleting...",
        success: `${formName} marked as achieved!`,
        error: `Couldn't marked as achieved ${formName}, something went wrong`
      }
    )
  }, [markSavingsGoalAsAchieved, formName, role])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
        className={cn(
          "overflow-auto flex flex-col gap-2 px-1 no-scrollbar relative",
          props.className
        )}
        id="saving-goal-form"
      >
        <div className="flex gap-2 items-start">
          {
            role === "update" && (
              <>
                <Dialog open={openDestroyDialog} onOpenChange={setOpenDestroyDialog}>
                  <Tooltip>
                    <DialogTrigger asChild>
                      <TooltipTrigger asChild>
                        <Button type="button" variant="destructive" size={"icon"} className="dark:bg-destructive">
                          <Trash />
                        </Button>
                      </TooltipTrigger>
                    </DialogTrigger>
                    <TooltipContent>
                      {"Delete Savings Goal"}
                    </TooltipContent>
                  </Tooltip>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {`Do you want to delete this Savings Goal?`}
                      </DialogTitle>
                      <DialogDescription>
                        {`This action is irreversible. It will be remove of this goal from your history and financo will recalculated your progress.`}
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant={"outline"} type="button">
                          <X /> Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        onClick={onDestroy}
                        variant={"destructive"}
                        type="button"
                      >
                        {
                          destroyState !== "idle"
                            ? <Throbber />
                            : <><Trash /> Delete</>
                        }
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog open={openMarkAsAchievedDialog} onOpenChange={setOpenMarkAsAchievedDialog}>
                  <Tooltip>
                    <DialogTrigger asChild>
                      <TooltipTrigger asChild>
                        <Button type="button" size={"icon"}>
                          <Trophy />
                        </Button>
                      </TooltipTrigger>
                    </DialogTrigger>
                    <TooltipContent>
                      {"Mark Savings Goal as achieved"}
                    </TooltipContent>
                  </Tooltip>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {`Do you want to mark this Savings Goal as achieved?`}
                      </DialogTitle>
                      <DialogDescription>
                        {`This action is irreversible. It will be move to your Trophy Room history and financo will recalculated your progress.`}
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant={"outline"} type="button">
                          <X /> Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        onClick={onMarkAsAchieved}
                        type="button"
                      >
                        {
                          markAsAchieveState !== "idle"
                            ? <Throbber />
                            : <><Check /> Mark as Achieved</>
                        }
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )
          }
          <span className="flex-1 contents-[' ']" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                form="saving-goal-form"
                size={"icon"}
              >
                {
                  fetcher.state !== "idle"
                    ? <Throbber />
                    : <Save />
                }
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {
                role === "update"
                  ? "Update Savings Goal"
                  : "Create Savings Goal"
              }
            </TooltipContent>
          </Tooltip>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => {
            const charCount = field.value?.length ?? 0
            const isApproachingLimit = charCount >= NAME_MAX_LENGTH * 0.9
            const isAboveLimit = charCount > NAME_MAX_LENGTH

            return (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className={cn(
                      isApproachingLimit && "border-yellow-500 focus-visible:ring-yellow-500",
                      isAboveLimit && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                </FormControl>
                <FormDescription>
                  {NAME_MAX_LENGTH - charCount} characters remaining
                </FormDescription>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => {
            const charCount = field.value?.length ?? 0
            const isApproachingLimit = charCount >= DESCRIPTION_MAX_LENGTH * 0.9
            const isAboveLimit = charCount > DESCRIPTION_MAX_LENGTH

            return (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? undefined}
                    placeholder="You can add a little extra information to remind you what is this Goal about..."
                    maxLength={DESCRIPTION_MAX_LENGTH}
                    className={cn(
                      "h-32",
                      isApproachingLimit && "border-yellow-500 focus-visible:ring-yellow-500",
                      isAboveLimit && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                </FormControl>
                <FormDescription>
                  {DESCRIPTION_MAX_LENGTH - charCount} characters remaining
                </FormDescription>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <CurrencyInput onValueChange={field.onChange} defaultValue={field.value} value={field.value} />
              <FormDescription>
                The currency you are saving on
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="target"
          render={({ field }) => (
            <FormItem>
              <CurrencyAmountInput
                currency={formCurrency}
                value={field.value}
                onChange={field.onChange}
                name="Target"
                placeholder="Target"
                forDebts={false}
                fixedSign={true}
                disabled={!formCurrency}
              />
              <FormDescription>
                {"The amount you want to save."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}