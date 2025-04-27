import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ArrowLeftRight, Save, Trash } from "lucide-react";
import { ComponentProps, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSubmit } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "~/lib/utils";
import { CurrencyInput } from "~/modules/shared/components/inputs/currency-input";
import { Button } from "~/modules/shared/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "~/modules/shared/components/ui/form";
import { Label } from "~/modules/shared/components/ui/label";
import { Switch } from "~/modules/shared/components/ui/switch";
import { Textarea } from "~/modules/shared/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/modules/shared/components/ui/tooltip";
import { CURRENCIES, Currency } from "~/modules/shared/types/currency";
import { DATE_FORMAT, Kind, KINDS } from "../types/transactions";
import { ExecutedAt, IssuedAt } from "./form/transaction-date-selectors";
import { TransactionSource, TransactionTarget } from "./form/transaction-source-target";

const NOTES_MAX_LENGTH = 1000

const schema = z.object({
  sourceId: z.number().positive(),
  targetId: z.number().positive(),
  sourceAmount: z.number(),
  targetAmount: z.number(),
  issuedAt: z.date(),
  executedAt: z.date().nullish(),
  notes: z.string().max(NOTES_MAX_LENGTH).nullish(),
  currency: z.nativeEnum(CURRENCIES),
  kind: z.nativeEnum(KINDS)
})

type Transaction = {
  sourceId: number
  targetId: number
  sourceAmount: number
  targetAmount: number
  issuedAt: Date
  executedAt: Date | null | undefined
  notes: string | null | undefined,
  currency: Currency,
  kind: Kind
}

function capitalizeKind(kind: Kind): string {
  return `${kind.at(0)!.toLocaleUpperCase()}${kind.slice(1)}`
}

type Props = {
  transaction: Transaction
  role: "create" | "update"
}

export function FormTemplate({ transaction, className, role, ...props }: ComponentProps<"form"> & Props) {
  const [isPendingTransaction, setIsPendingTransaction] = useState(!transaction.executedAt)

  const submit = useSubmit()
  // const { accountsMap: accounts } = use(AccountsContext)

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      sourceId: transaction.sourceId,
      targetId: transaction.targetId,
      sourceAmount: transaction.sourceAmount,
      targetAmount: transaction.targetAmount,
      issuedAt: transaction.issuedAt,
      executedAt: transaction.executedAt,
      notes: transaction.notes,
      currency: transaction.currency,
      kind: transaction.kind,
    }
  })

  useEffect(() => {
    form.setValue("sourceId", transaction.sourceId)
    form.setValue("targetId", transaction.targetId)
    form.setValue("sourceAmount", transaction.sourceAmount)
    form.setValue("targetAmount", transaction.targetAmount)
    form.setValue("issuedAt", transaction.issuedAt)
    form.setValue("executedAt", transaction.executedAt)
    form.setValue("currency", transaction.currency)
    form.setValue("kind", transaction.kind)
    form.setValue("notes", transaction.notes)

    setIsPendingTransaction(!transaction.executedAt)
  }, [transaction])

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const promise = submit({
      ...values,
      issuedAt: format(values.issuedAt, DATE_FORMAT),
      executedAt: values.executedAt ? format(values.executedAt, DATE_FORMAT) : null,
      notes: values.notes ?? null,
      intent: role
    }, { method: "post", encType: "application/json" })

    toast.promise(
      promise,
      {
        loading: "Creating...",
        success: () => {
          if (values.executedAt) {
            return `${capitalizeKind(values.kind)} registered at ${format(values.executedAt, "PPP")}`
          }

          return `Pending ${values.kind} registered at ${format(values.issuedAt, "PPP")}`
        },
        error: "Oops!. Something went wrong"
      }
    )
  }

  const onDestroy = async () => {
    const promise = submit({
      ...transaction,
      issuedAt: format(transaction.issuedAt, DATE_FORMAT),
      executedAt: transaction.executedAt ? format(transaction.executedAt, DATE_FORMAT) : null,
      notes: transaction.notes ?? null,
      intent: "destroy"
    }, { method: "post", encType: "application/json" })

    toast.promise(
      promise,
      {
        loading: "Deleting...",
        success: () => "Transaction deleted",
        error: "Oops!. Something went wrong"
      }
    )
  }

  return (
    <Form {...form}>
      <form
        className={cn("grid grid-cols-2 px-1 grid-rows-[min-content_0.5fr_min-content_0.25fr_min-content_1fr] h-full max-h-full gap-2 overflow-y-auto no-scrollbar", className)}
        {...props}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="col-span-2 flex gap-2 items-center">
          {
            role === "update" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" variant="destructive" size={"icon"} onClick={onDestroy}>
                    <Trash />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {"Delete Transaction"}
                </TooltipContent>
              </Tooltip>
            )
          }
          <span className="flex-grow contents-[' ']" />
          <div className="col-span-2 flex gap-2 items-center *:cursor-pointer">
            <Switch
              id="is-pending-transaction"
              checked={isPendingTransaction}
              onCheckedChange={checked => {
                console.log("switch ran")
                if (checked) form.setValue("executedAt", null)
                else form.setValue("executedAt", form.getValues("issuedAt"))

                setIsPendingTransaction(checked)
              }}
            />
            <Label htmlFor="is-pending-transaction">This transaction has no effective date, yet</Label>
          </div>
          <span className="flex-grow contents-[' ']" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={"secondary"}
                onClick={() => {
                  const kind = form.getValues("kind")
                  const sourceId = form.getValues("sourceId")
                  const sourceAmount = form.getValues("sourceAmount")
                  const targetId = form.getValues("targetId")
                  const targetAmount = form.getValues("targetAmount")

                  if (kind === "expense") form.setValue("kind", "income")
                  if (kind === "income") form.setValue("kind", "expense")

                  form.setValue("sourceId", targetId)
                  form.setValue("sourceAmount", targetAmount)
                  form.setValue("targetId", sourceId)
                  form.setValue("targetAmount", sourceAmount)
                }}
              >
                <ArrowLeftRight />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {"Switch Transaction Direction"}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="submit" size={"icon"}>
                <Save />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {
                role === "update"
                  ? "Update Transaction"
                  : "Create Transaction"
              }
            </TooltipContent>
          </Tooltip>
        </div>

        <FormField
          control={form.control}
          name="sourceId"
          render={({ field }) => (
            <FormItem>
              <TransactionSource
                id={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="targetId"
          render={({ field }) => (
            <FormItem>
              <TransactionTarget
                id={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="issuedAt"
          render={({ field }) => (
            <FormItem>
              <IssuedAt
                value={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="executedAt"
          render={({ field }) => (
            <FormItem>
              <ExecutedAt
                value={field.value}
                issuedAt={form.getValues("issuedAt")}
                onChange={(date) => {
                  setIsPendingTransaction(!date)
                  field.onChange(date)
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sourceAmount"
          render={({ field }) => (
            <FormItem>
              <div className="rounded-lg border p-3">
                {field.value}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetAmount"
          render={({ field }) => (
            <FormItem>
              <div className="rounded-lg border p-3">
                {field.value}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <CurrencyInput onValueChange={field.onChange} defaultValue={field.value} value={field.value} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => {
            const charCount = field.value?.length ?? 0
            const isApproachingLimit = charCount >= NOTES_MAX_LENGTH * 0.9

            return (
              <FormItem className="col-span-2 flex flex-col">
                <FormControl className="flex-grow">
                  <Textarea
                    {...field}
                    value={field.value ?? undefined}
                    className={cn(
                      "resize-none",
                      isApproachingLimit && "border-yellow-500 focus-visible:ring-yellow-500"
                    )}
                    placeholder="Notes about the transaction..."
                  />
                </FormControl>
                <FormDescription className="text-right">
                  {charCount} / {NOTES_MAX_LENGTH}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        {/* <div className="grid col-span-2 grid-cols-5 grid-rows-4 gap-2 mx-auto w-full max-w-[45dvh]">
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
        </div> */}
      </form>
    </Form>
  )
}