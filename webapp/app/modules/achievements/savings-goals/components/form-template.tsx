import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Trash, Trophy } from "lucide-react";
import { ComponentProps, useCallback, useEffect } from "react";
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
import { useDestroyDialog } from "./dialogs/destroy";
import { useMarkAsAchievedDialog } from "./dialogs/mark-as-achieved";

type Props = {
  goalId: number | undefined
  name: string | undefined
  description: string | null | undefined
  targetAmount: number | undefined
  savedAmount: number | undefined
  currency: Currency | undefined
  role: "create" | "update"
}

export function FormTemplate({
  goalId,
  name,
  description,
  targetAmount,
  currency,
  savedAmount,
  role,
  ...props
}: ComponentProps<"form"> & Props) {
  const { submit, state } = useFetcher()

  const {
    submitting: isDeletingGoal,
    onConfirmSavingsGoalDeletion: onConfirmDestroy
  } = useDestroyDialog()

  const {
    submitting: isMarkingAsAchieved,
    onConfirmSavingsGoalMarkAsAchieved: onConfirmMarkAsAchieved,
  } = useMarkAsAchievedDialog()

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

  const formName = form.watch("name")
  const formTarget = form.watch("target")
  const formCurrency = form.watch("currency")

  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    toast.promise(
      submit(
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
  }, [submit])

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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      className="dark:bg-destructive"
                      size={"icon"}
                      onClick={() => {
                        if (role !== "update") {
                          toast.error("This goal is not saved yet")
                          return
                        }

                        onConfirmDestroy({
                          id: goalId!,
                          name: formName,
                          target: formTarget,
                          currency: formCurrency
                        })
                      }}
                    >
                      {
                        isDeletingGoal
                          ? <Throbber />
                          : (
                            <>
                              <Trash />
                            </>
                          )
                      }
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {"Delete Savings Goal"}
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      disabled={savedAmount !== targetAmount}
                      size={"icon"}
                      onClick={() => {
                        if (role !== "update") {
                          toast.error("This goal is not saved yet")
                          return
                        }

                        onConfirmMarkAsAchieved({
                          id: goalId!,
                          name: formName,
                          target: formTarget,
                          saved: savedAmount!,
                          currency: formCurrency
                        })
                      }}
                    >
                      {
                        isMarkingAsAchieved
                          ? <Throbber />
                          : (
                            <>
                              <Trophy />
                            </>
                          )
                      }
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {"Mark Savings Goal as achieved"}
                  </TooltipContent>
                </Tooltip>
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
                  state === "submitting"
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